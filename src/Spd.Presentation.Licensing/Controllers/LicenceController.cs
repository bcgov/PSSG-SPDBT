using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceController : SpdControllerBase
    {
        private readonly ILogger<LicenceController> _logger;
        private readonly IMediator _mediator;
        private readonly IRecaptchaVerificationService _recaptchaVerificationService;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public LicenceController(
            ILogger<LicenceController> logger,
            IMediator mediator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDataProtectionProvider dpProvider)
        {
            _logger = logger;
            _mediator = mediator;
            _recaptchaVerificationService = recaptchaVerificationService;
            _dataProtector = dpProvider.CreateProtector(SessionConstants.AnonymousRequestDataProtectorName).ToTimeLimitedDataProtector();
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
        public async Task<LicenceResponse> GetLicenceLookup([FromRoute][Required] string licenceNumber, [FromQuery] string accessCode = null)
        {
            return await _mediator.Send(new LicenceQuery(licenceNumber, accessCode));
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
        public async Task<LicenceResponse?> GetLicenceLookupAnonymously([FromRoute][Required] string licenceNumber, CancellationToken ct, [FromBody] GoogleRecaptcha recaptcha, [FromQuery] string accessCode = null)
        {
            _logger.LogInformation("do Google recaptcha verification");
            var isValid = await _recaptchaVerificationService.VerifyAsync(recaptcha.RecaptchaCode, ct);
            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha value");
            }

            var response = await _mediator.Send(new LicenceQuery(licenceNumber, accessCode));

            if (response != null)
            {
                string str = $"{response.LicenceId}*{response.LicenceAppId}";
                var encryptedIds = _dataProtector.Protect(str, DateTimeOffset.UtcNow.AddDays(1));

                this.Response.Cookies.Append(SessionConstants.AnonymousApplicationContext,
                    encryptedIds,
                    new CookieOptions { HttpOnly = true, 
                        SameSite = SameSiteMode.Strict, 
                        Secure = true, 
                        Expires = DateTimeOffset.UtcNow.AddDays(1) });
            }
            return response;
        }

        /// <summary>
        /// Get licence photo by licenceId, the licenceId is put into cookie and encoded.
        /// Example: http://localhost:5114/api/licences/image
        /// </summary>
        /// <param name="licenceNumber"></param>
        /// <param name="accessCode"></param>
        /// <returns></returns>
        [Route("api/licences/image")]
        [HttpGet]
        public async Task<FileStreamResult> GetLicencePhoto()
        {
            string? licenceIdsStr;
            Request.Cookies.TryGetValue(SessionConstants.AnonymousApplicationContext, out licenceIdsStr);
            if (string.IsNullOrEmpty(licenceIdsStr))
                throw new ApiException(HttpStatusCode.Unauthorized);
            string? licenceId;
            try
            {
                string ids = _dataProtector.Unprotect(licenceIdsStr);
                licenceId = ids.Split("*")[0];
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "licence id is incorrect");
            }
            FileResponse response =  await _mediator.Send(new LicencePhotoQuery(Guid.Parse(licenceId)));
            var content = new MemoryStream(response?.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
    }
}