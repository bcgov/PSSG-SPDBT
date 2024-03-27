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
    public class LicenceController : SpdApplicantLicenceControllerBase
    {
        private readonly IMediator _mediator;

        public LicenceController(
            IMediator mediator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDataProtectionProvider dpProvider,
            IDistributedCache cache,
            IConfiguration configuration) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _mediator = mediator;
        }

        /// <summary> 
        /// Get licences for login user , only return active and Expired ones. 
        /// Example: http://localhost:5114/api/applicants/xxxx/licences 
        /// </summary> 
        /// <param name="applicantId"></param> 
        /// <returns></returns> 
        [Route("api/applicants/{applicantId}/licences")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<LicenceResponse>> GetLicences([FromRoute][Required] Guid applicantId)
        {
            return await _mediator.Send(new ApplicantLicenceListQuery(applicantId));
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
        public async Task<LicenceResponse?> GetLicenceLookup([FromRoute][Required] string licenceNumber, [FromQuery] string? accessCode = null)
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

            LicenceResponse response = await _mediator.Send(new LicenceQuery(licenceNumber, accessCode));

            if (response != null)
            {
                string str = $"{response.LicenceId}*{response.LicenceAppId}";
                SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, str);
            }
            return response;
        }

        /// <summary>
        /// Get licence photo by licenceId.
        /// Example: api/licences/licence-photo/10000000-0000-0000-0000-000000000000
        /// </summary>
        /// <returns></returns>
        [Route("api/licences/licence-photo/{licenceId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<FileStreamResult> GetLicencePhoto([FromRoute] Guid licenceId)
        {
            FileResponse? response = await _mediator.Send(new LicencePhotoQuery(licenceId));
            MemoryStream content;
            string contentType;
            if (response == null)
            {
                content = new MemoryStream(Array.Empty<byte>());
                contentType = string.Empty;
            }
            else
            {
                content = new MemoryStream(response.Content);
                contentType = response.ContentType ?? "application/octet-stream";
            }

            return File(content, contentType, response?.FileName);
        }

        /// <summary>
        /// Get licence photo by licenceId, the licenceId is put into cookie and encoded.
        /// Example: http://localhost:5114/api/licences/image
        /// </summary>
        /// <returns></returns>
        [Route("api/licences/licence-photo")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<FileStreamResult> GetLicencePhotoAnonymously()
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
            FileResponse? response = await _mediator.Send(new LicencePhotoQuery(Guid.Parse(licenceId)));
            MemoryStream content;
            string contentType;
            if (response == null)
            {
                content = new MemoryStream(Array.Empty<byte>());
                contentType = string.Empty;
            }
            else
            {
                content = new MemoryStream(response.Content);
                contentType = response.ContentType ?? "application/octet-stream";
            }

            return File(content, contentType, response?.FileName);
        }
    }
}