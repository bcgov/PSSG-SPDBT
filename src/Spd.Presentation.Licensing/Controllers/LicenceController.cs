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

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceController : SpdLicenceAnonymousControllerBase
    {
        private readonly ILogger<LicenceController> _logger;
        private readonly IMediator _mediator;

        public LicenceController(
            ILogger<LicenceController> logger,
            IMediator mediator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDataProtectionProvider dpProvider,
            IDistributedCache cache) : base(cache, dpProvider, recaptchaVerificationService)
        {
            _logger = logger;
            _mediator = mediator;
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
        /// <param name="recaptcha"></param>
        /// <param name="accessCode"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/licence-lookup/anonymous/{licenceNumber}")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<LicenceResponse?> GetLicenceLookupAnonymously([FromRoute][Required] string licenceNumber, [FromBody] GoogleRecaptcha recaptcha, CancellationToken ct, [FromQuery] string? accessCode = null)
        {
            await VerifyGoogleRecaptchaAsync(recaptcha, ct);

            var response = await _mediator.Send(new LicenceQuery(licenceNumber, accessCode));

            if (response != null)
            {
                string str = $"{response.LicenceId}*{response.LicenceAppId}";
                SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, str);
            }
            return response;
        }

        /// <summary>
        /// Get licence photo by licenceId, the licenceId is put into cookie and encoded.
        /// Example: http://localhost:5114/api/licences/image
        /// </summary>
        /// <returns></returns>
        [Route("api/licences/licence-photo")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<FileStreamResult> GetLicencePhoto()
        {
            string? licenceIdsStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationContext);

            string? licenceId;
            try
            {
                licenceId = licenceIdsStr.Split("*")[0];
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "licence id is incorrect");
            }
            FileResponse response = await _mediator.Send(new LicencePhotoQuery(Guid.Parse(licenceId)));
            var content = new MemoryStream(response?.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
    }
}