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
using System.Net;
using System.Security.Principal;
using System.Text.Json;

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

            ApplicantUpdateCommand command = new(applicantGuidId, request);
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

        /// <summary>
        /// Get applicant profile anonymously, the applicantId is retrieved from cookies.
        /// For controlling member, The cookie is set when the user click the update cm email link, verify the invitation.
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant")]
        [HttpGet]
        public async Task<ApplicantProfileResponse?> GetApplicantInfoAnonymous()
        {
            string applicantIdStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicantContext);
            return await _mediator.Send(new GetApplicantProfileQuery(Guid.Parse(applicantIdStr)));
        }

        /// <summary>
        /// Get List of draft or InProgress Security Worker Licence Application or Permit Application
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants-anonymous/licence-applications")]
        [HttpGet]
        public async Task<IEnumerable<LicenceAppListResponse>> GetApplicantLicenceApplicationsAnonymous(CancellationToken ct)
        {
            string applicantIdStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicantContext);
            return await _mediator.Send(new GetLicenceAppListQuery(Guid.Parse(applicantIdStr)), ct);
        }

        /// <summary>
        /// Get List of draft or InProgress GDSD Team, trainer and retired dog Applications
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants-anonymous/dog-certification-applications")]
        [HttpGet]
        public async Task<IEnumerable<LicenceAppListResponse>> GetGDSDApplicationsAnonymous(CancellationToken ct)
        {
            string applicantIdStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicantContext);
            return await _mediator.Send(new GetLicenceAppListQuery(Guid.Parse(applicantIdStr), AppScopeCode.DogCertificationApp), ct);
        }
    }
}