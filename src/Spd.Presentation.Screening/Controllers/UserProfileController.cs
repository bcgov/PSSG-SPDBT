using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// </summary>
    public class UserProfileController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ClaimsPrincipal _currentUser;

        public UserProfileController(IMediator mediator, IPrincipal currentUser)
        {
            _mediator = mediator;
            _currentUser = (ClaimsPrincipal)currentUser;
        }

        [Route("api/users/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<UserProfileResponse> OrgUserWhoami()
        {
            return await _mediator.Send(new GetCurrentUserProfileQuery());
        }

        [Route("api/applicants/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse> ApplicantWhoami()
        {
            var info = _currentUser.GetApplicantInfo();
            return new ApplicantProfileResponse
            {
                Email = info.Email,
                EmailVerified = info.EmailVerified,
                Age = info.Age,
                BirthDate = info.BirthDate,
                DisplayName = info.DisplayName,
                FirstName = info.FirstName,
                LastName = info.LastName,
                Gender = info.Gender,
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
        public string? Gender { get; set; }
        public string? Age { get; set; }
        public string? Sub { get; set; }
        public string? BirthDate { get; set; }
        public bool? EmailVerified { get; set; }
    }
}