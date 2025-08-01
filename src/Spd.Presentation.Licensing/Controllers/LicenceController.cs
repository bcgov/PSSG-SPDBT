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
using System.Text.RegularExpressions;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceController : SpdLicenceControllerBase
    {
        private readonly IMediator _mediator;
        private static List<ServiceTypeCode> PersonalSecurityLicences = new() { ServiceTypeCode.BodyArmourPermit, ServiceTypeCode.ArmouredVehiclePermit, ServiceTypeCode.SecurityWorkerLicence };
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
        /// Get licences for login biz , only return active and Expired ones. 
        /// Example: http://localhost:5114/api/bizs/xxxx/licences 
        /// </summary> 
        /// <param name="bizId"></param> 
        /// <returns></returns> 
        [Route("api/bizs/{bizId}/licences")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<IEnumerable<LicenceBasicResponse>> GetBizLicences([FromRoute][Required] Guid bizId)
        {
            return await _mediator.Send(new LicenceListQuery(null, bizId));
        }

        /// <summary> 
        /// Get personal licences (such as swl, permit) for login user , only return active and Expired ones. 
        /// Example: http://localhost:5114/api/applicants/xxxx/licences 
        /// </summary> 
        /// <param name="applicantId"></param> 
        /// <returns></returns> 
        [Route("api/applicants/{applicantId}/licences")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<LicenceBasicResponse>> GetApplicantLicences([FromRoute][Required] Guid applicantId)
        {
            IEnumerable<LicenceBasicResponse> resps = await _mediator.Send(new LicenceListQuery(applicantId, null));
            return resps.Where(r => r.ServiceTypeCode != null && PersonalSecurityLicences.Contains(r.ServiceTypeCode.Value)).ToList();
        }

        /// <summary>
        /// Get latest licence by licence number.
        /// There should be only one active licence for each licenceNumber.
        /// Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST
        /// </summary>
        /// <param name="licenceNumber"></param>
        /// <param name="accessCode"></param>
        /// <returns></returns>
        [Route("api/licence-lookup/{licenceNumber}")]
        [HttpGet]
        [Authorize(Policy = "BcscBCeID")]
        public async Task<LicenceResponse?> GetLicenceLookup([FromRoute][Required] string licenceNumber, [FromQuery] string? accessCode = null)
        {
            return await _mediator.Send(new LicenceQuery(licenceNumber, accessCode));
        }

        /// <summary>
        /// Get latest licence by licence number with google recaptcha for anonymous
        /// Example: http://localhost:5114/api/licence-lookup/anonymous/TEST-02?accessCode=TEST
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

            LicenceResponse? response = await _mediator.Send(new LicenceQuery(licenceNumber, accessCode));
            if (response == null) return null;

            Guid latestAppId;
            if (response.ServiceTypeCode == ServiceTypeCode.SecurityWorkerLicence)
                latestAppId = await _mediator.Send(new GetLatestWorkerLicenceApplicationIdQuery((Guid)response.LicenceHolderId));
            else if (response.ServiceTypeCode == ServiceTypeCode.SecurityBusinessLicence)
                return response;
            else if (response.ServiceTypeCode == ServiceTypeCode.MDRA)
            {
                latestAppId = await _mediator.Send(new GetMDRARegistrationIdQuery((Guid)response.LicenceHolderId)) ?? Guid.Empty;
            }
            else if (response.ServiceTypeCode == ServiceTypeCode.BodyArmourPermit || response.ServiceTypeCode == ServiceTypeCode.ArmouredVehiclePermit)
                latestAppId = await _mediator.Send(new GetLatestPermitApplicationIdQuery((Guid)response.LicenceHolderId, (ServiceTypeCode)response.ServiceTypeCode));
            else
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid licence type.");
            }

            SetValueToResponseCookie(SessionConstants.AnonymousApplicantContext, response.LicenceHolderId.Value.ToString());
            string str = $"{response.LicenceId}*{latestAppId}";
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, str);

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

        /// <summary>
        /// Get licence info by licenceId.
        /// Example: api/licences/10000000-0000-0000-0000-000000000000
        /// </summary>
        /// <returns></returns>
        [Route("api/licences/{licenceId}")]
        [HttpGet]
        [Authorize(Policy = "BcscBCeID")]
        public async Task<LicenceResponse> GetLicence([FromRoute] Guid licenceId, CancellationToken ct)
        {
            return await _mediator.Send(new LicenceByIdQuery(licenceId), ct);
        }

        /// <summary>
        /// Get latest secure worker licence by licence number or firstname, lastname
        /// Example: http://localhost:5114/api/licences/security-worker-licence?licenceNumber=E123
        /// http://localhost:5114/api/licences/security-worker-licence?firstName=XXX&lastName=yyy
        /// </summary>
        [Route("api/licences/security-worker-licence")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IEnumerable<LicenceBasicResponse>> SearchSecureWorkerLicence(
            [FromBody] GoogleRecaptcha recaptcha,
            [FromQuery] string? licenceNumber,
            [FromQuery] string? firstName,
            [FromQuery] string? lastName,
            CancellationToken ct)
        {
            await VerifyGoogleRecaptchaAsync(recaptcha, ct);
            return await _mediator.Send(new LicenceListSearch(licenceNumber?.Trim(), firstName?.Trim(), lastName?.Trim(), null, ServiceTypeCode.SecurityWorkerLicence));
        }

        /// <summary>
        /// Get latest secure worker licences info by a list of licence numbers
        /// Example: http://localhost:5114/api/licences/security-worker-licence-in-bulk
        /// </summary>
        [Route("api/licences/security-worker-licence-in-bulk")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IEnumerable<LicenceBasicResponse>> SearchSecureWorkerLicenceInBulk([FromBody] LicenceNumbersRequest request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.LicenceNumbers) || string.IsNullOrWhiteSpace(request.Recaptcha?.RecaptchaCode))
                throw new ApiException(HttpStatusCode.BadRequest, "Missing data.");
            await VerifyGoogleRecaptchaAsync(request.Recaptcha, ct);

            var numbers = FindInputSWLNumber(request.LicenceNumbers);
            return await _mediator.Send(new LicenceBulkSearch(numbers, ServiceTypeCode.SecurityWorkerLicence), ct);
        }

        /// <summary>
        /// Get latest secure business licence by licence number or at least the first 3 letters of biz name (for either legal name or trade name)
        /// Example: http://localhost:5114/api/licences/business-licence?licenceNumber=B123
        /// </summary>
        [Route("api/licences/business-licence")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IEnumerable<LicenceBasicResponse>> SearchBizLicence([FromBody] GoogleRecaptcha recaptcha, [FromQuery] string? licenceNumber, [FromQuery] string? businessName, CancellationToken ct)
        {
            await VerifyGoogleRecaptchaAsync(recaptcha, ct);
            return await _mediator.Send(new LicenceListSearch(licenceNumber, null, null, businessName, ServiceTypeCode.SecurityBusinessLicence));
        }

        private static List<string> FindInputSWLNumber(string input)
        {
            // Split by any character that is not a letter or digit
            string[] licNumbers = Regex.Split(input, @"[^a-zA-Z0-9]+", RegexOptions.None, TimeSpan.FromSeconds(10));

            // Optional: Remove empty entries
            List<string> result = new List<string>(licNumbers);
            result.RemoveAll(string.IsNullOrEmpty);
            return result;
        }
    }

    public record LicenceNumbersRequest
    {
        public GoogleRecaptcha Recaptcha { get; set; } = null!;
        public string LicenceNumbers { get; set; } = string.Empty;//contain the licence numbers seperated by comma
    }

}