
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
        /// Security Worker whoami, for security worker portal
        /// return 204 No Content when there is no contact found with this BCSC.
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SecurityWorkerWhoami()
        {
            return null;
        }

        /// <summary>
        /// Security Worker whoami, for security worker portal
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SwlPermitPortalLogin()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new ApplicantLoginCommand(info));
            response.Sub = info.Sub;
            response.IdentityProviderTypeCode = IdentityProviderTypeCode.BcServicesCard;
            return response;
        }

        /// <summary>
        /// Biz bceid login, for biz licence
        /// </summary>
        /// <returns></returns>
        //[Route("api/biz-licence/whoami")]
        //[HttpGet]
        //[Authorize(Policy = "OnlyBceid")]
        //public async Task<OrgUserProfileResponse?> BizLicenceWhoami()
        //{
        //    var info = _currentUser.GetBceidUserIdentityInfo();
        //    return new OrgUserProfileResponse
        //    {
        //        IdentityProviderType = IdentityProviderTypeCode.BusinessBceId,
        //        UserDisplayName = info.DisplayName,
        //        UserGuid = info.UserGuid
        //    };
        //}


    }



}