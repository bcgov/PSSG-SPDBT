using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.ViewModels;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class BCeIdOauthConfigurationController : ControllerBase
    {
        private readonly ILogger<BCeIdOauthConfigurationController> _logger;
        private readonly IMediator _mediator;

        public BCeIdOauthConfigurationController(ILogger<BCeIdOauthConfigurationController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }


        [Route("api/bceid-configuration")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<ActionResult<BCeIdConfigurationResponse>> Get()
        {
            BCeIdConfigurationResponse resp = new BCeIdConfigurationResponse
            {
                Issuer = "https://dev.loginproxy.gov.bc.ca/auth/realms/standard",
                ClientId = "spd-4592",
                ResponseType = "code",
                Scope = "openid profile email offline_access",
                PostLogoutRedirectUri = "https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi"
            };

            return await Task.FromResult(resp);
        }
    }
}