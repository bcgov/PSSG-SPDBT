using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Filters;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class PermitController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<PermitAppSubmitRequest> _permitAppAnonymousSubmitRequestValidator;
        private readonly IValidator<PermitAppUpsertRequest> _permitAppUpsertValidator;

        public PermitController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<PermitAppSubmitRequest> permitAppAnonymousSubmitRequestValidator,
            IValidator<PermitAppUpsertRequest> permitAppUpsertValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _permitAppAnonymousSubmitRequestValidator = permitAppAnonymousSubmitRequestValidator;
            _permitAppUpsertValidator = permitAppUpsertValidator;
        }

        #region authenticated

        /// <summary>
        /// Create/partial save permit application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/permit-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<PermitAppCommandResponse> SavePermitLicenceApplication([FromBody][Required] PermitAppUpsertRequest licenceCreateRequest)
        {
            if (licenceCreateRequest.ApplicantId == Guid.Empty)
                throw new ApiException(HttpStatusCode.BadRequest, "must have applicant");
            licenceCreateRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            return await _mediator.Send(new PermitUpsertCommand(licenceCreateRequest));
        }

        /// <summary>
        /// Get Security Worker Licence Application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/permit-applications/{licenceAppId}")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<PermitLicenceAppResponse> GetPermitLicenceApplication([FromRoute][Required] Guid licenceAppId)
        {
            return await _mediator.Send(new GetPermitApplicationQuery(licenceAppId));
        }

        /// <summary>
        /// Get Lastest Permit Application
        /// Example: api/applicants/{applicantId}/permit-latest?typeCode=BodyArmourPermit
        /// </summary>
        /// <param name="applicantId"></param>
        /// <returns></returns>
        [Route("api/applicants/{applicantId}/permit-latest")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<PermitLicenceAppResponse> GetLatestPermitApplication([FromRoute][Required] Guid applicantId, [FromQuery][Required] ServiceTypeCode typeCode)
        {
            Guid licenceAppId = await _mediator.Send(new GetLatestPermitApplicationIdQuery(applicantId, typeCode));
            return await _mediator.Send(new GetPermitApplicationQuery(licenceAppId));
        }

        /// <summary>
        /// Submit new permit Application authenticated with bcsc
        /// </summary>
        /// <param name="permitSubmitRequest"></param>
        /// <returns></returns>
        [Route("api/permit-applications/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<PermitAppCommandResponse> SubmitPermitApplication([FromBody][Required] PermitAppUpsertRequest permitSubmitRequest, CancellationToken ct)
        {
            var validateResult = await _permitAppUpsertValidator.ValidateAsync(permitSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            permitSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            return await _mediator.Send(new PermitSubmitCommand(permitSubmitRequest));
        }

        /// <summary>
        /// Submit Permit Application Json part for authenticated users, supports only: renewal, update and replace
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="jsonRequest">WorkerLicenceAppAnonymousSubmitRequestJson data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/permit-applications/change")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<PermitAppCommandResponse?> ChangePermitApplicationJsonAuthenticated(PermitAppSubmitRequest jsonRequest, CancellationToken ct)
        {
            PermitAppCommandResponse? response = null;

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _permitAppAnonymousSubmitRequestValidator.ValidateAsync(jsonRequest, ct);

            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "New application type is not supported");
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                PermitAppReplaceCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                PermitAppRenewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                PermitAppUpdateCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            return response;
        }

        #endregion authenticated

        #region anonymous

        /// <summary>
        /// Get anonymous Permit Application, thus the licenceAppId is retrieved from cookies.
        /// </summary>
        /// <returns></returns>
        [Route("api/permit-application")]
        [HttpGet]
        [FeaturesEnabled("EnableAnonymousPermitFeatures", true)]
        public async Task<PermitLicenceAppResponse> GetPermitApplicationAnonymous()
        {
            if (!_configuration.GetValue<bool>("EnableAnonymousPermitFeatures"))
                throw new NotSupportedException();

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

            return await _mediator.Send(new GetPermitApplicationQuery(Guid.Parse(licenceAppId)));
        }

        /// <summary>
        /// Submit Body Armour or Armour Vehicle permit application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="jsonRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [FeaturesEnabled("EnableAnonymousPermitFeatures", true)]
        [Route("api/permit-applications/anonymous/submit-change")]
        [HttpPost]
        public async Task<PermitAppCommandResponse?> SubmitPermitApplicationAnonymous(PermitAppSubmitRequest jsonRequest, CancellationToken ct)
        {
            if (!_configuration.GetValue<bool>("EnableAnonymousPermitFeatures"))
                throw new NotSupportedException();

            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _permitAppAnonymousSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            PermitAppCommandResponse? response = null;
            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                PermitAppNewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                PermitAppRenewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                PermitAppUpdateCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return response;
        }

        #endregion anonymous
    }
}