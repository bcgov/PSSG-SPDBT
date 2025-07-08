using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class MDRAController : SpdLicenceControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IValidator<MDRARegistrationRequest> _mdraRequestValidator;

        public MDRAController(IMediator mediator,
            IConfiguration configuration,
            IDataProtectionProvider dataProtector,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IValidator<MDRARegistrationRequest> mdraRequestValidator) : base(cache, dataProtector, recaptchaVerificationService, configuration)
        {
            _mediator = mediator;
            _mdraRequestValidator = mdraRequestValidator;
        }

        #region anonymous

        [Route("api/mdra-registration")]
        [HttpGet]
        public async Task<MDRARegistrationResponse?> GetMDRARegistrationAnonymous()
        {
            string licenceIdsStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationContext);
            string? registrationId;
            try
            {
                registrationId = licenceIdsStr.Split("*")[1];
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "registrationId is incorrect");
            }
            return await _mediator.Send(new GetMDRARegistrationQuery(Guid.Parse(registrationId)));
        }

        /// <summary>
        /// Submit MDRA registration Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="jsonRequest">MDRARegistrationRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/mdra-registrations")]
        [HttpPost]
        public async Task<MDRARegistrationCommandResponse?> SubmitMDRARegistrationAnonymous([FromBody][Required] MDRARegistrationRequest jsonRequest, CancellationToken ct)
        {
            await VerifyKeyCode();

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _mdraRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;

            MDRARegistrationCommandResponse? response = null;
            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                MDRARegistrationNewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                MDRARegistrationRenewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                MDRARegistrationUpdateCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return response;
        }

        #endregion anonymous
    }
}