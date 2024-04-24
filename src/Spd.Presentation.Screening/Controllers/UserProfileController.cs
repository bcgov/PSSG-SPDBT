using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Screening;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// </summary>
    public class UserProfileController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly ClaimsPrincipal _currentUser;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mediator"></param>
        /// <param name="currentUser"></param>
        public UserProfileController(IMediator mediator, IPrincipal currentUser, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
            _currentUser = (ClaimsPrincipal)currentUser;
        }

        /// <summary>
        /// Org user whoami, for orgPortal
        /// </summary>
        /// <returns></returns>
        [Route("api/users/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<OrgUserProfileResponse> OrgUserWhoami()
        {
            BceidIdentityInfo userIdentity = _currentUser.GetBceidUserIdentityInfo();
            return await _mediator.Send(new GetCurrentUserProfileQuery(_mapper.Map<PortalUserIdentity>(userIdentity)));
        }

        /// <summary>
        /// Applicant whoami, for applicantPortal
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc", Roles = "Applicant")]
        public async Task<ApplicantProfileResponse> ApplicantWhoami()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new GetApplicantProfileQuery(info.Sub));
            if (response == null)
            {
                throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "Applicant is not found");
            }
            return response;
        }

        /// <summary>
        /// Idir user whoami, for PSSO portal
        /// </summary>
        /// <returns></returns>
        [Route("api/idir-users/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyIdir")]
        public async Task<IdirUserProfileResponse> IdirUserWhoami()
        {

            string? identityProvider = _currentUser.GetIdentityProvider();
            if (identityProvider != null && identityProvider.Equals("idir", StringComparison.InvariantCultureIgnoreCase))
            {
                IdirUserIdentityInfo userIdentity = _currentUser.GetIdirUserIdentityInfo();
                return await _mediator.Send(new ManageIdirUserCommand(_mapper.Map<IdirUserIdentity>(userIdentity)));
            }
            throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "Cannot get idir info from token.");
        }
    }
}