using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class MDRAController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<PermitAppSubmitRequest> _permitAppAnonymousSubmitRequestValidator;
        private readonly IValidator<PermitAppUpsertRequest> _permitAppUpsertValidator;

        public MDRAController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<PermitAppSubmitRequest> permitAppAnonymousSubmitRequestValidator,
            IValidator<PermitAppUpsertRequest> permitAppUpsertValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache) : base(cache, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _permitAppAnonymousSubmitRequestValidator = permitAppAnonymousSubmitRequestValidator;
            _permitAppUpsertValidator = permitAppUpsertValidator;
        }

        #region anonymous

        /// <summary>
        /// Submit Body Armour or Armour Vehicle permit application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="jsonRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/mdra-registrations")]
        [HttpPost]
        public async Task<PermitAppCommandResponse?> SubmitMDRARegistrationAnonymous(MDRARegistrationRequest jsonRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            //IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            //var validateResult = await _permitAppAnonymousSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            //if (!validateResult.IsValid)
            //    throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            //jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

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
            //SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            //SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return null;
        }

        #endregion anonymous
    }
}