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

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class GDSDLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest> _teamAppAnonymousSubmitRequestValidator;
        private readonly IValidator<GDSDTeamLicenceAppUpsertRequest> _teamAppUpsertValidator;

        public GDSDLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<GDSDTeamLicenceAppAnonymousSubmitRequest> teamAppAnonymousSubmitRequestValidator,
            IValidator<GDSDTeamLicenceAppUpsertRequest> teamAppUpsertValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _teamAppAnonymousSubmitRequestValidator = teamAppAnonymousSubmitRequestValidator;
            _teamAppUpsertValidator = teamAppUpsertValidator;
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
        public async Task<GDSDAppCommandResponse> SaveGDSDTeamCertApplication([FromBody][Required] GDSDTeamLicenceAppUpsertRequest licenceUpsertRequest)
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
        [Route("api/gdsd-team-app/{certificationAppId}")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<GDSDTeamLicenceAppResponse> GetGDSDTeamApplication([FromRoute][Required] Guid certificationAppId)
        {
            return await _mediator.Send(new GDSDTeamLicenceApplicationQuery(certificationAppId));
        }

        /// <summary>
        /// Submit new gdsd team Application authenticated with bcsc
        /// </summary>
        /// <param name="gdsdSubmitRequest"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<GDSDAppCommandResponse> SubmitGDSDTeamApplication([FromBody][Required] GDSDTeamLicenceAppUpsertRequest gdsdSubmitRequest, CancellationToken ct)
        {
            var validateResult = await _teamAppUpsertValidator.ValidateAsync(gdsdSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            gdsdSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            return await _mediator.Send(new GDSDTeamLicenceAppSubmitCommand(gdsdSubmitRequest));
        }
        #endregion authenticated

        #region anonymous

        /// <summary>
        /// Get anonymous Permit Application, thus the licenceAppId is retrieved from cookies.
        /// </summary>
        /// <returns></returns>
        [Route("api/gdsd-team-app")]
        [HttpGet]
        public async Task<GDSDTeamLicenceAppResponse> GetGDSDTeamAppAnonymous()
        {
            return null;
            //string licenceIdsStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationContext);
            //string? licenceAppId;
            //try
            //{
            //    licenceAppId = licenceIdsStr.Split("*")[1];
            //}
            //catch
            //{
            //    throw new ApiException(HttpStatusCode.Unauthorized, "licence app id is incorrect");
            //}

            //return await _mediator.Send(new GetPermitApplicationQuery(Guid.Parse(licenceAppId)));
        }

        /// <summary>
        /// Submit GDSD Team Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousSubmitRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-app/anonymous/submit")]
        [HttpPost]
        public async Task<GDSDAppCommandResponse> SubmitGDSDTeamAppAnonymous(GDSDTeamLicenceAppAnonymousSubmitRequest anonymousSubmitRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousSubmitRequest.DocumentKeyCodes, ct);
            var validateResult = await _teamAppAnonymousSubmitRequestValidator.ValidateAsync(anonymousSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            GDSDAppCommandResponse? response = null;
            if (anonymousSubmitRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                GDSDTeamLicenceAppAnonymousSubmitCommand command = new(anonymousSubmitRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            //if (anonymousSubmitRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            //{
            //    PermitAppRenewCommand command = new(anonymousSubmitRequest, newDocInfos);
            //    response = await _mediator.Send(command, ct);
            //}

            //if (anonymousSubmitRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            //{
            //    PermitAppUpdateCommand command = new(anonymousSubmitRequest, newDocInfos);
            //    response = await _mediator.Send(command, ct);
            //}
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new GDSDAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }

        #endregion anonymous
    }
}