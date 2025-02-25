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

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class DogTrainerLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public DogTrainerLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
        }

        #region anonymous

        /// <summary>
        /// Submit/new Dog Trainer Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousSubmitRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/dog-trainer-app/anonymous/submit")]
        [HttpPost]
        public async Task<GDSDAppCommandResponse> SubmitDogTrainerAppAnonymous(GDSDTeamLicenceAppAnonymousSubmitRequest anonymousSubmitRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousSubmitRequest.DocumentKeyCodes, ct);
            //var validateResult = await _teamAppAnonymousSubmitRequestValidator.ValidateAsync(anonymousSubmitRequest, ct);
            //if (!validateResult.IsValid)
            //    throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            anonymousSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            GDSDAppCommandResponse? response = null;
            if (anonymousSubmitRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                GDSDTeamLicenceAppAnonymousSubmitCommand command = new(anonymousSubmitRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return new GDSDAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }

        /// <summary>
        /// Submit/new GDSD Team Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousChangeRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/dog-trainer-app/anonymous/change")]
        [HttpPost]
        public async Task<GDSDAppCommandResponse> RenewReplaceDogTrainerAppAnonymous(GDSDTeamLicenceAppChangeRequest anonymousChangeRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(anonymousChangeRequest.DocumentKeyCodes, ct);
            //var validateResult = await _teamAppChangeValidator.ValidateAsync(anonymousChangeRequest, ct);
            //if (!validateResult.IsValid)
            //    throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            //anonymousChangeRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            GDSDAppCommandResponse? response = null;
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
            return new GDSDAppCommandResponse { LicenceAppId = response?.LicenceAppId };
        }
        #endregion anonymous
    }
}