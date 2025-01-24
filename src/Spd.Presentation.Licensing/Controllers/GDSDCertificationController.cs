using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class GDSDCertificationController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;

        public GDSDCertificationController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
        }

        #region authenticated

        /// <summary>
        /// Create/partial save gdsd team certification application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-certification-app")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<PermitAppCommandResponse> SaveGDSDTeamCertApplication([FromBody][Required] PermitAppUpsertRequest licenceCreateRequest)
        {
            //if (licenceCreateRequest.ApplicantId == Guid.Empty)
            //    throw new ApiException(HttpStatusCode.BadRequest, "must have applicant");
            //licenceCreateRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            //return await _mediator.Send(new PermitUpsertCommand(licenceCreateRequest));
            return null;
        }

        /// <summary>
        /// Get gdsd team certification application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-certification-app/{certificationAppId}")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<PermitLicenceAppResponse> GetGDSDTeamApplication([FromRoute][Required] Guid certificationAppId)
        {
            // return await _mediator.Send(new GetPermitApplicationQuery(certificationAppId));
            return null;
        }
        #endregion authenticated

        #region anonymous

        /// <summary>
        /// Get anonymous Permit Application, thus the licenceAppId is retrieved from cookies.
        /// </summary>
        /// <returns></returns>
        [Route("api/gdsd-team-certification-app")]
        [HttpGet]
        public async Task<PermitLicenceAppResponse> GetGDSDTeamCertAppAnonymous()
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
        /// <param name="jsonRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/gdsd-team-certification-app/anonymous/submit-change")]
        [HttpPost]
        public async Task<PermitAppCommandResponse?> SubmitPermitApplicationAnonymous(PermitAppSubmitRequest jsonRequest, CancellationToken ct)
        {
            //await VerifyKeyCode();

            //IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            //var validateResult = await _permitAppAnonymousSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            //if (!validateResult.IsValid)
            //    throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            //jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            //PermitAppCommandResponse? response = null;
            //if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            //{
            //    PermitAppNewCommand command = new(jsonRequest, newDocInfos);
            //    response = await _mediator.Send(command, ct);
            //}

            //if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            //{
            //    PermitAppRenewCommand command = new(jsonRequest, newDocInfos);
            //    response = await _mediator.Send(command, ct);
            //}

            //if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            //{
            //    PermitAppUpdateCommand command = new(jsonRequest, newDocInfos);
            //    response = await _mediator.Send(command, ct);
            //}
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return null;
        }

        #endregion anonymous
    }
}