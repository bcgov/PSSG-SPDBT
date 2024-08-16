using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Principal;
using System.Text.Json;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class ApplicantProfileController : SpdLicenceControllerBase
    {
        private readonly ILogger<ApplicantProfileController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<ApplicantUpdateRequest> _applicantUpdateRequestValidator;

        public ApplicantProfileController(ILogger<ApplicantProfileController> logger,
        IPrincipal currentUser,
        IMediator mediator,
        IConfiguration configuration,
        IValidator<ApplicantUpdateRequest> applicationUpdateRequestValidator,
        IDistributedCache cache,
        IDataProtectionProvider dpProvider,
        IRecaptchaVerificationService recaptchaVerificationService) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _applicantUpdateRequestValidator = applicationUpdateRequestValidator;
        }

        /// <summary>
        /// Get applicant profile
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/{id}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> ApplicantInfo(Guid id)
        {
            return await _mediator.Send(new GetApplicantProfileQuery(id));
        }

        /// <summary>
        /// Uploading file only save files in cache, the files are not connected to the application yet.
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applicant/files")]
        [HttpPost]
        [Authorize(Policy = "OnlyBcsc")]
        [RequestSizeLimit(26214400)] //25M
        public async Task<Guid> UploadApplicantProfileFilesAnonymous([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, CancellationToken ct)
        {
            VerifyFiles(fileUploadRequest.Documents);

            CreateDocumentInCacheCommand command = new(fileUploadRequest);
            var newFileInfos = await _mediator.Send(command, ct);
            Guid fileKeyCode = Guid.NewGuid();
            await Cache.SetAsync(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(20), ct);
            return fileKeyCode;
        }

        /// <summary>
        /// Submit applicant update
        /// </summary>
        /// <param name="request">ApplicantUpdateRequest request</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applicant/{applicantId}")]
        [HttpPut]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<Guid> UpdateApplicant(string applicantId, ApplicantUpdateRequest request, CancellationToken ct)
        {
            if (!Guid.TryParse(applicantId, out Guid applicantGuidId))
                throw new ApiException(HttpStatusCode.BadRequest, $"{nameof(applicantId)} is not a valid guid.");

            var validateResult = await _applicantUpdateRequestValidator.ValidateAsync(request, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(request.DocumentKeyCodes, ct);

            ApplicantUpdateCommand command = new(applicantGuidId, request, newDocInfos);
            await _mediator.Send(command, ct);

            return applicantGuidId;
        }

        /// <summary>
        /// Get applicants who has the same name and birthday as login person
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/search")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<ApplicantListResponse>> SearchApplicantsSameAsloginUser()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new ApplicantSearchCommand(info, false));
        }

        /// <summary>
        /// Merge the old applicant to the new applicant, old applicant will be marked as inactive. All the entities reference to old applicant will be changed to refer to new applicant.
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/merge/{oldApplicantId}/{newApplicantId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IActionResult> MergeApplicants([FromRoute] Guid oldApplicantId, [FromRoute] Guid newApplicantId)
        {
            await _mediator.Send(new ApplicantMergeCommand(oldApplicantId, newApplicantId));
            return Ok();
        }
    }
}