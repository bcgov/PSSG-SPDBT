using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Screening;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
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
        private readonly IConfiguration _configuration;

        public OrgRegistrationController(IMediator mediator, IRecaptchaVerificationService verificationService, IConfiguration configuration)
        {
            _mediator = mediator;
            _verificationService = verificationService;
            _configuration = configuration;
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
                throw new ApiException(HttpStatusCode.BadRequest, "The request cannot be null.");

            var isValid = await _verificationService.VerifyAsync(anonymOrgRegRequest.Recaptcha, ct);

            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "The recaptcha is invalid.");
            }
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            if (hostUrl == null)
                throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");
            return await _mediator.Send(new RegisterOrganizationCommand(anonymOrgRegRequest, hostUrl));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="orgRegistrationCreateRequest"></param>
        /// <returns></returns>
        /// <exception cref="ConfigurationErrorsException"></exception>
        [Route("api/org-registrations")]
        [HttpPost]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<OrgRegistrationCreateResponse> Register([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            if (hostUrl == null)
                throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");
            return await _mediator.Send(new RegisterOrganizationCommand(orgRegistrationCreateRequest, hostUrl));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="registrationNumber"></param>
        /// <returns></returns>
        [Route("api/org-registrations/{registrationNumber}/status")]
        [HttpGet]
        public async Task<OrgRegistrationPortalStatusResponse> Status([FromRoute] string registrationNumber)
        {
            return await _mediator.Send(new GetOrgRegistrationStatusQuery(registrationNumber));
        }
    }

}

