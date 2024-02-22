
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class UserProfileController : SpdControllerBase
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
        /// Security Worker whoami, for security worker portal
        /// return 204 No Content when there is no contact found with this BCSC.
        /// </summary>
        /// <returns></returns>
        [Route("api/permit-security-worker/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SecurityWorkerWhoami()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new GetApplicantProfileQuery(info.Sub));
            return response;
        }

        /// <summary>
        /// Security Worker/Permit login, for security worker and permit portal
        /// if it is first time user login, it will return IsFirstTimeLogin=true
        /// if the user already exist, it will return IsFirstTimeLogin=false 
        /// </summary>
        /// <returns></returns>
        [Route("api/permit-security-worker/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SecurityWorkerLogin()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new ManageApplicantProfileCommand(info));

            response.Sub = info.Sub;
            response.IdentityProviderTypeCode = IdentityProviderTypeCode.BcServicesCard;
            return response;
        }
    }
}