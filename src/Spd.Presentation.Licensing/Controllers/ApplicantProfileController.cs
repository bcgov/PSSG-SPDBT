using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class ApplicantProfileController : SpdLicenceAnonymousControllerBase
    {
        private readonly ILogger<ApplicantProfileController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<ApplicantUpdateRequest> _applicationUpdateRequestValidator;

        public ApplicantProfileController(ILogger<ApplicantProfileController> logger,
        IPrincipal currentUser,
        IMediator mediator,
        IConfiguration configuration,
        IValidator<ApplicantUpdateRequest> applicationUpdateRequestValidator,
        IDistributedCache cache,
        IDataProtectionProvider dpProvider,
        IRecaptchaVerificationService recaptchaVerificationService) : base(cache, dpProvider, recaptchaVerificationService)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _applicationUpdateRequestValidator = applicationUpdateRequestValidator;
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

        //todo: add update endpoint here.

        /// <summary>
        /// Submit applicant update
        /// </summary>
        /// <param name="request">ApplicantUpdateRequest request</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applicant/{applicantId}")]
        [HttpPut]
        public async Task<ApplicantUpdateRequestResponse> UpdateApplicant(string applicantId, ApplicantUpdateRequest request, CancellationToken ct)
        {
            if (!Guid.TryParse(applicantId, out Guid applicantGuidId))
                throw new ApiException(HttpStatusCode.BadRequest, $"{nameof(applicantId)} is not a valid guid.");

            var validateResult = await _applicationUpdateRequestValidator.ValidateAsync(request, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            // TODO, get files...
            // 
            IEnumerable<LicAppFileInfo> newDocInfos = [];

            ApplicantUpdateCommand command = new(applicantGuidId, request, newDocInfos);
            ApplicantUpdateRequestResponse response = await _mediator.Send(command, ct);

            return response;
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
    }



}