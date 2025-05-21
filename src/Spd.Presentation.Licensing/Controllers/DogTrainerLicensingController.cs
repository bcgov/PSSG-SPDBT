using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class DogTrainerLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IValidator<DogTrainerRequest> _dogTrainerNewValidator;
        private readonly IValidator<DogTrainerChangeRequest> _dogTrainerAppChangeValidator;

        public DogTrainerLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider,
            IValidator<DogTrainerRequest> dogTrainerNewValidator,
            IValidator<DogTrainerChangeRequest> dogTrainerAppChangeValidator) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _dogTrainerNewValidator = dogTrainerNewValidator;
            this._dogTrainerAppChangeValidator = dogTrainerAppChangeValidator;
        }

        #region anonymous

        /// <summary>
        /// Submit/new Dog Trainer Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="newRequest">DogTrainerRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/dog-trainer-app/anonymous/submit")]
        [HttpPost]
        public async Task<DogTrainerAppCommandResponse> SubmitDogTrainerAppAnonymous(DogTrainerRequest newRequest, CancellationToken ct)
        {
            await VerifyKeyCode();
            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(newRequest.DocumentKeyCodes, ct);

            var validateResult = await _dogTrainerNewValidator.ValidateAsync(newRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            newRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            DogTrainerAppCommandResponse response = await _mediator.Send(new DogTrainerLicenceAppAnonymousSubmitCommand(newRequest, newDocInfos), ct);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new DogTrainerAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }

        /// <summary>
        /// Renew, Replace Dog Trainer application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousChangeRequest">DogTrainerChangeRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/dog-trainer-app/anonymous/change")]
        [HttpPost]
        public async Task<DogTrainerAppCommandResponse> RenewReplaceDogTrainerAppAnonymous(DogTrainerChangeRequest anonymousChangeRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousChangeRequest.DocumentKeyCodes, ct);
            var validateResult = await _dogTrainerAppChangeValidator.ValidateAsync(anonymousChangeRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousChangeRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            DogTrainerAppCommandResponse? response = null;
            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "New Dog Trainer is not supported in this endpoint");
            }

            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                DogTrainerLicenceAppRenewCommand command = new(anonymousChangeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                DogTrainerLicenceAppReplaceCommand command = new(anonymousChangeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new DogTrainerAppCommandResponse { LicenceAppId = response?.LicenceAppId };

        }

        /// <summary>
        /// Get Security Worker Licence Application, anonymous one, so, we get the licenceAppId from cookies.
        /// </summary>
        /// <returns></returns>
        [Route("api/dog-trainer-app")]
        [HttpGet]
        public async Task<DogTrainerAppResponse> GetSecurityWorkerLicenceApplicationAnonymous()
        {
            string licenceIdsStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationContext);
            string? licenceAppId;
            try
            {
                licenceAppId = licenceIdsStr.Split("*")[1];
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "licence app id is incorrect");
            }
            return await _mediator.Send(new GetDogTrainerAppQuery(Guid.Parse(licenceAppId)));
        }
        #endregion anonymous
    }
}