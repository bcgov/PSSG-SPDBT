
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.ManagerContract;
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
        /// return 204 No Content when there is no contact found with this BCSC.
        /// </summary>
        /// <returns></returns>
        [Route("api/security-worker/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SecurityWorkerWhoami()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new GetApplicantProfileQuery(info.Sub));
            if (response == null)
            {
                //applicant does not exist.
                return null;
            }
            return response;
        }

        /// <summary>
        /// Biz bceid login, for biz licence
        /// </summary>
        /// <returns></returns>
        [Route("api/biz-licence/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<OrgUserProfileResponse?> BizLicenceWhoami()
        {
            var info = _currentUser.GetBceidUserIdentityInfo();
            return new OrgUserProfileResponse
            {
                IdentityProviderType = IdentityProviderTypeCode.BusinessBceId,
                UserDisplayName = info.DisplayName,
                UserGuid = info.UserGuid
            };
        }
    }
}