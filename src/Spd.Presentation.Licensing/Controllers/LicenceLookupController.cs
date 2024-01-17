using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceLookupController : SpdControllerBase
    {
        private readonly ILogger<LicenceLookupController> _logger;
        private readonly IMediator _mediator;
        private readonly IRecaptchaVerificationService _recaptchaVerificationService;

        public LicenceLookupController(
            ILogger<LicenceLookupController> logger,
            IMediator mediator,
            IRecaptchaVerificationService recaptchaVerificationService)
        {
            _logger = logger;
            _mediator = mediator;
            _recaptchaVerificationService = recaptchaVerificationService;
        }

        /// <summary>
        /// Get licence by licence number
        /// Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST
        /// </summary>
        /// <param name="licenceNumber"></param>
        /// <param name="accessCode"></param>
        /// <returns></returns>
        [Route("api/licence-lookup/{licenceNumber}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<LicenceLookupResponse> GetLicenceLookup([FromRoute][Required] string licenceNumber, [FromQuery] string accessCode = null)
        {
            return await _mediator.Send(new LicenceLookupQuery(licenceNumber, accessCode));
        }

        /// <summary>
        /// Get licence by licence number with google recaptcha for anonymous
        /// Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST
        /// </summary>
        /// <param name="licenceNumber"></param>
        /// <param name="accessCode"></param>
        /// <returns></returns>
        [Route("api/licence-lookup/anonymous/{licenceNumber}")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<LicenceLookupResponse> GetLicenceLookupAnonymously([FromRoute][Required] string licenceNumber, CancellationToken ct, [FromBody] GoogleRecaptcha recaptcha, [FromQuery] string accessCode = null)
        {
            _logger.LogInformation("do Google recaptcha verification");
            var isValid = await _recaptchaVerificationService.VerifyAsync(recaptcha.RecaptchaCode, ct);
            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha value");
            }

            return await _mediator.Send(new LicenceLookupQuery(licenceNumber, accessCode));
        }
    }
}