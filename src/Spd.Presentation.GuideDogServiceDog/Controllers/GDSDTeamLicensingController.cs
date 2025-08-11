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
    public class GDSDTeamLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest> _teamAppAnonymousSubmitRequestValidator;
        private readonly IValidator<GDSDTeamLicenceAppUpsertRequest> _teamAppUpsertValidator;
        private readonly IValidator<GDSDTeamLicenceAppChangeRequest> _teamAppChangeValidator;

        public GDSDTeamLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest> teamAppAnonymousSubmitRequestValidator,
            IValidator<GDSDTeamLicenceAppUpsertRequest> teamAppUpsertValidator,
            IValidator<GDSDTeamLicenceAppChangeRequest> teamAppChangeValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _teamAppAnonymousSubmitRequestValidator = teamAppAnonymousSubmitRequestValidator;
            _teamAppUpsertValidator = teamAppUpsertValidator;
            _teamAppChangeValidator = teamAppChangeValidator;
        }

        #region authenticated

        /// <summary>
        /// Create/partial save gdsd team certification application
        /// </summary>
        /// <param name="licenceUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<GDSDTeamAppCommandResponse> SaveGDSDTeamCertApplication([FromBody][Required] GDSDTeamLicenceAppUpsertRequest licenceUpsertRequest)
        {
            if (licenceUpsertRequest.ApplicantId == Guid.Empty)
                throw new ApiException(HttpStatusCode.BadRequest, "must have applicant");
            licenceUpsertRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            return await _mediator.Send(new GDSDTeamLicenceAppUpsertCommand(licenceUpsertRequest));
        }

        /// <summary>
        /// Get gdsd team certification application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/{licenceAppId}")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<GDSDTeamLicenceAppResponse> GetGDSDTeamApplication([FromRoute][Required] Guid licenceAppId)
        {
            return await _mediator.Send(new GDSDTeamLicenceApplicationQuery(licenceAppId));
        }

        /// <summary>
        /// Submit new gdsd team Application authenticated with bcsc
        /// </summary>
        /// <param name="gdsdSubmitRequest"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<GDSDTeamAppCommandResponse> SubmitGDSDTeamApplication([FromBody][Required] GDSDTeamLicenceAppUpsertRequest gdsdSubmitRequest, CancellationToken ct)
        {
            var validateResult = await _teamAppUpsertValidator.ValidateAsync(gdsdSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            gdsdSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            return await _mediator.Send(new GDSDTeamLicenceAppSubmitCommand(gdsdSubmitRequest));
        }

        /// <summary>
        /// Renew, Replace GDSD Team application
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.        
        /// </summary>
        /// <param name="changeRequest">GDSDTeamLicenceAppChangeRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/change")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<GDSDTeamAppCommandResponse?> RenewReplaceGDSDApplicationAuthenticated(GDSDTeamLicenceAppChangeRequest changeRequest, CancellationToken ct)
        {
            GDSDTeamAppCommandResponse? response = null;

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(changeRequest.DocumentKeyCodes, ct);
            var validateResult = await _teamAppChangeValidator.ValidateAsync(changeRequest, ct);

            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            changeRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            if (changeRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                GDSDTeamLicenceAppRenewCommand command = new(changeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            if (changeRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                GDSDTeamLicenceAppReplaceCommand command = new(changeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            return response;
        }
        #endregion authenticated

        #region anonymous

        /// <summary>
        /// Submit/new GDSD Team Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousSubmitRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/anonymous/submit")]
        [HttpPost]
        public async Task<GDSDTeamAppCommandResponse> SubmitGDSDTeamAppAnonymous(GDSDTeamLicenceAppAnonymousSubmitRequest anonymousSubmitRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousSubmitRequest.DocumentKeyCodes, ct);
            var validateResult = await _teamAppAnonymousSubmitRequestValidator.ValidateAsync(anonymousSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            GDSDTeamAppCommandResponse? response = null;
            if (anonymousSubmitRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                GDSDTeamLicenceAppAnonymousSubmitCommand command = new(anonymousSubmitRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new GDSDTeamAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }

        /// <summary>
        /// Renew, Replace GDSD Team application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousChangeRequest">GDSDTeamLicenceAppChangeRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/anonymous/change")]
        [HttpPost]
        public async Task<GDSDTeamAppCommandResponse> RenewReplaceGDSDTeamAppAnonymous(GDSDTeamLicenceAppChangeRequest anonymousChangeRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousChangeRequest.DocumentKeyCodes, ct);
            var validateResult = await _teamAppChangeValidator.ValidateAsync(anonymousChangeRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousChangeRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            GDSDTeamAppCommandResponse? response = null;
            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "New GDSD is not supported in this endpoint");
            }

            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                GDSDTeamLicenceAppRenewCommand command = new(anonymousChangeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (anonymousChangeRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                GDSDTeamLicenceAppReplaceCommand command = new(anonymousChangeRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new GDSDTeamAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }
        #endregion anonymous
    }
}