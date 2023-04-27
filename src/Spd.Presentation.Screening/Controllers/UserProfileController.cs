using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class UserProfileController : SpdControllerBase
    {
        private readonly ILogger<UserProfileController> _logger;
        private readonly IMediator _mediator;

        public UserProfileController(ILogger<UserProfileController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Route("api/user")]
        [HttpGet]
        public async Task<UserProfileResponse> Whoami()
        {
            return await _mediator.Send(new GetCurrentUserProfileQuery());
        }
    }
}