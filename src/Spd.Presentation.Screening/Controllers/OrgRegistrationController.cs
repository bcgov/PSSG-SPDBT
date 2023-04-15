using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// Organization Registration
    /// </summary>
    public class OrgRegistrationController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IRecaptchaVerificationService _verificationService;

        public OrgRegistrationController(IMediator mediator, IRecaptchaVerificationService verificationService)
        {
            _mediator = mediator;
            _verificationService = verificationService;
        }

        [Route("api/anonymous-org-registrations")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> AnonymousRegister([FromBody][Required]AnonymousOrgRegistrationCreateRequest anonymOrgRegRequest, CancellationToken ct)
        {
            if (anonymOrgRegRequest == null) return BadRequest();

            var isValid = await _verificationService.VerifyAsync(anonymOrgRegRequest.Recaptcha, ct);

            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha");
            }
            await _mediator.Send(new OrgRegistrationCreateCommand(anonymOrgRegRequest));
            return Ok();
        }

        [Route("api/org-registrations")]
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Register([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            await _mediator.Send(new RegisterOrganizationCommand(orgRegistrationCreateRequest));
            return Ok();
        }

        [Route("api/org-registrations/detect-duplicate")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<CheckDuplicateResponse> DetectDuplicate([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            return await _mediator.Send(new CheckOrgRegistrationDuplicateQuery(orgRegistrationCreateRequest));
        }
    }
}