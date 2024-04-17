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

        public LoginController(ILogger<LoginController> logger, IPrincipal currentUser, IMediator mediator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
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

        /// <summary>
        /// login, for biz licensing portal, bceid login
        /// </summary>
        /// <returns></returns>
        [Route("api/biz/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<BizUserLoginResponse?> BizLicencePortalLogin()
        {
            //var info = _currentUser.GetBcscUserIdentityInfo();
            //var response = await _mediator.Send(new BizLoginCommand(info));
            //return response;
            return null;
        }

        /// <summary>
        /// when user select agree to the Term. Call this endpoint.
        /// </summary>
        /// <returns></returns>
        [Route("api/biz/{bizId}/user/{bizUserId}/term-agree")]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<ActionResult> BizLicencePortalTermAgree([FromRoute] Guid bizId, Guid bizUserId)
        {
            //await _mediator.Send(new ApplicantTermAgreeCommand(applicantId));
            return Ok();
        }
    }



}