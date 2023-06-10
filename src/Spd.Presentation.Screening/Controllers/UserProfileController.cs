using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.Globalization;
using System.Security.Claims;
using System.Security.Principal;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

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
        /// 
        /// </summary>
        /// <returns></returns>
        [Route("api/users/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<UserProfileResponse> OrgUserWhoami()
        {
            PortalUserIdentityInfo userIdentity = _currentUser.GetPortalUserIdentityInfo();
            return await _mediator.Send(new GetCurrentUserProfileQuery(_mapper.Map<PortalUserIdentity>(userIdentity)));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse> ApplicantWhoami()
        {
            var info = _currentUser.GetApplicantIdentityInfo();
            string? str = info.Gender?.ToLower();
            GenderCode? gender = str switch
            {
                "female" => GenderCode.F,
                "male" => GenderCode.M,
                "diverse" => GenderCode.X,
                _ => null,
            };
            return new ApplicantProfileResponse
            {
                Email = info.Email,
                EmailVerified = info.EmailVerified,
                Age = info.Age,
                BirthDate = info.BirthDate == null ? null : DateTimeOffset.ParseExact(info.BirthDate, "yyyy-MM-dd", CultureInfo.InvariantCulture),
                DisplayName = info.DisplayName,
                FirstName = info.FirstName,
                LastName = info.LastName,
                Gender = gender,
                Sub = info.Sub,
            };
        }
    }

    public class ApplicantProfileResponse
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public GenderCode? Gender { get; set; }
        public string? Age { get; set; }
        public string? Sub { get; set; }
        public DateTimeOffset? BirthDate { get; set; }
        public bool? EmailVerified { get; set; }
    }
}