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

        /// <summary>
        /// User not login, use this endpoint with googleRecaptcha as security check.
        /// </summary>
        /// <param name="anonymOrgRegRequest"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        /// <exception cref="ApiException"></exception>
        [Route("api/anonymous-org-registrations")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<OrgRegistrationCreateResponse> AnonymousRegister([FromBody][Required] AnonymousOrgRegistrationCreateRequest anonymOrgRegRequest, CancellationToken ct)
        {
            if (anonymOrgRegRequest == null)
                throw new ApiException(HttpStatusCode.BadRequest, "request cannot be null.");

            var isValid = await _verificationService.VerifyAsync(anonymOrgRegRequest.Recaptcha, ct);

            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha");
            }
            return await _mediator.Send(new RegisterOrganizationCommand(anonymOrgRegRequest));
        }

        [Route("api/org-registrations")]
        [HttpPost]
        [Authorize]
        public async Task<OrgRegistrationCreateResponse> Register([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            return await _mediator.Send(new RegisterOrganizationCommand(orgRegistrationCreateRequest));
        }
    }

    /// <summary>
    /// for Anonymous OrgRegistration
    /// </summary>
    public class AnonymousOrgRegistrationCreateRequest : OrgRegistrationCreateRequest
    {
        public string Recaptcha { get; set; } = null!;
    }
}

