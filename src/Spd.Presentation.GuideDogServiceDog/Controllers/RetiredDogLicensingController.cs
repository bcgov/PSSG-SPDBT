using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.GuideDogServiceDog.Controllers
{
    [ApiController]
    public class RetiredDogLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IValidator<RetiredDogLicenceAppAnonymousSubmitRequest> _retiredDogAppAnonymousSubmitRequestValidator;
        private readonly IValidator<RetiredDogLicenceAppUpsertRequest> _retiredDogAppUpsertValidator;
        private readonly IValidator<RetiredDogLicenceAppChangeRequest> _retiredDogAppChangeValidator;

        public RetiredDogLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<RetiredDogLicenceAppAnonymousSubmitRequest> retiredDogAppAnonymousSubmitRequestValidator,
            IValidator<RetiredDogLicenceAppUpsertRequest> retiredDogAppUpsertValidator,
            IValidator<RetiredDogLicenceAppChangeRequest> retiredDogAppChangeValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _retiredDogAppAnonymousSubmitRequestValidator = retiredDogAppAnonymousSubmitRequestValidator;
            _retiredDogAppUpsertValidator = retiredDogAppUpsertValidator;
            _retiredDogAppChangeValidator = retiredDogAppChangeValidator;
        }

        #region authenticated

        /// <summary>
        /// Create/partial save retired dog certification application
        /// </summary>
        /// <param name="licenceUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/retired-dog-app")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<RetiredDogAppCommandResponse> SaveRetiredDogCertApplication([FromBody][Required] RetiredDogLicenceAppUpsertRequest licenceUpsertRequest)
        {
            if (licenceUpsertRequest.ApplicantId == Guid.Empty)
                throw new ApiException(HttpStatusCode.BadRequest, "must have applicant");
            licenceUpsertRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            return await _mediator.Send(new RetiredDogLicenceAppUpsertCommand(licenceUpsertRequest));
        }

        /// <summary>
        /// Get retired dog certification application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/retired-dog-app/{licenceAppId}")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<RetiredDogLicenceAppResponse> GetRetiredDogApplication([FromRoute][Required] Guid licenceAppId)
        {
            return await _mediator.Send(new RetiredDogLicenceApplicationQuery(licenceAppId));
        }

        /// <summary>
        /// Submit new retired dog certification Application authenticated with bcsc
        /// </summary>
        /// <param name="gdsdSubmitRequest"></param>
        /// <returns></returns>
        [Route("api/retired-dog-app/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<RetiredDogAppCommandResponse> SubmitRetiredDogApplication([FromBody][Required] RetiredDogLicenceAppUpsertRequest gdsdSubmitRequest, CancellationToken ct)
        {
            var validateResult = await _retiredDogAppUpsertValidator.ValidateAsync(gdsdSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            gdsdSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            return await _mediator.Send(new RetiredDogLicenceAppSubmitCommand(gdsdSubmitRequest));
        }

        /// <summary>
        /// Renew, Replace retired dog certification app
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.        
        /// </summary>
        /// <param name="changeRequest">RetiredDogLicenceAppChangeRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/retired-dog-app/change")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<RetiredDogAppCommandResponse?> RenewReplaceRetiredDogApplicationAuthenticated(RetiredDogLicenceAppChangeRequest changeRequest, CancellationToken ct)
        {
            RetiredDogAppCommandResponse? response = null;

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(changeRequest.DocumentKeyCodes, ct);
            var validateResult = await _retiredDogAppChangeValidator.ValidateAsync(changeRequest, ct);

            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            changeRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            if (changeRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                RetiredDogLicenceAppRenewCommand command = new(changeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            if (changeRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                RetiredDogLicenceAppReplaceCommand command = new(changeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            return response;
        }
        #endregion authenticated

        #region anonymous

        /// <summary>
        /// Submit/new retired dog certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousSubmitRequest">RetiredDogLicenceAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/retired-dog-app/anonymous/submit")]
        [HttpPost]
        public async Task<RetiredDogAppCommandResponse> SubmitRetiredDogAppAnonymous(RetiredDogLicenceAppAnonymousSubmitRequest anonymousSubmitRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousSubmitRequest.DocumentKeyCodes, ct);
            var validateResult = await _retiredDogAppAnonymousSubmitRequestValidator.ValidateAsync(anonymousSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            RetiredDogAppCommandResponse? response = null;
            if (anonymousSubmitRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                RetiredDogLicenceAppAnonymousSubmitCommand command = new(anonymousSubmitRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new RetiredDogAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }

        /// <summary>
        /// Renew, Replace retired dog certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousChangeRequest">RetiredDogLicenceAppChangeRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/retired-dog-app/anonymous/change")]
        [HttpPost]
        public async Task<RetiredDogAppCommandResponse> RenewReplaceRetiredDogAppAnonymous(RetiredDogLicenceAppChangeRequest anonymousChangeRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousChangeRequest.DocumentKeyCodes, ct);
            var validateResult = await _retiredDogAppChangeValidator.ValidateAsync(anonymousChangeRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousChangeRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            RetiredDogAppCommandResponse? response = null;
            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "New GDSD is not supported in this endpoint");
            }

            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                RetiredDogLicenceAppRenewCommand command = new(anonymousChangeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                RetiredDogLicenceAppReplaceCommand command = new(anonymousChangeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new RetiredDogAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }
        #endregion anonymous
    }
}