using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LoginController : SpdControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;

        public LoginController(ILogger<LoginController> logger, IPrincipal currentUser, IMediator mediator, IConfiguration configuration)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            this._configuration = configuration;
        }

        /// <summary>
        /// login, for swl/permit portal, bc service card login
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantLoginResponse?> ApplicantPortalLogin()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new ApplicantLoginCommand(info));
            return response;
        }

        /// <summary>
        /// when user select agree to the Term. Call this endpoint.
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/{applicantId}/term-agree")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ActionResult> ApplicantPortalTermAgree([FromRoute] Guid applicantId)
        {
            await _mediator.Send(new ApplicantTermAgreeCommand(applicantId));
            return Ok();
        }
    }
}