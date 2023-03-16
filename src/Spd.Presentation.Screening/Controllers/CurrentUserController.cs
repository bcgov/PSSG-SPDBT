using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Utilities.LogonUser;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class CurrentUserController : ControllerBase
    {
        private readonly ILogger<CurrentUserController> _logger;
        private readonly IMediator _mediator;
        private readonly IPrincipal _currentUser;

        public CurrentUserController(ILogger<CurrentUserController> logger, IMediator mediator, IPrincipal currentUser)
        {
            _logger = logger;
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [Route("api/whoami")]
        [HttpGet]
        public async Task<CurrentUserInfo> Whoami()
        {
            CurrentUserInfo userInfo = new CurrentUserInfo
            {
                IsAuthenticated = _currentUser.IfUserAuthenticated(),
                AuthenticatedType = _currentUser.GetIdentityProvider(),
                Email = _currentUser.GetUserEmail(),
                FirstName= _currentUser.GetUserFirstName(),
                LastName= _currentUser.GetUserLastName(),
                IdentificationGuid = _currentUser.GetUserGuid(),
                UserName=_currentUser.GetUserName(),
            };
            return userInfo;
        }
    }

    public class CurrentUserInfo
    {
        public bool IsAuthenticated { get; set; }
        public string AuthenticatedType { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public Guid IdentificationGuid { get; set; }
    }
}