
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly ILogger<UserProfileController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public UserProfileController(ILogger<UserProfileController> logger, IPrincipal currentUser, IMediator mediator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// Security Worker login, for security worker portal
        /// </summary>
        /// <returns></returns>
        [Route("api/security-worker/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse> SecurityWorkerLogin()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            return null;
        }
    }
}