using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class BCeIDConfigurationController : ControllerBase
    {
        private readonly ILogger<BCeIDConfigurationController> logger;
        private readonly IOptions<BCeIDConfiguration> configuration;

        public BCeIDConfigurationController(ILogger<BCeIDConfigurationController> logger, IOptions<BCeIDConfiguration> configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }


        [Route("api/bceid-configuration")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<ActionResult<BCeIdConfigurationResponse>> Get()
        {
            BCeIdConfigurationResponse resp = new BCeIdConfigurationResponse
            {
                Issuer = configuration.Value.Issuer,
                ClientId = configuration.Value.ClientId,
                ResponseType = configuration.Value.ResponseType,
                Scope = configuration.Value.Scope,
                PostLogoutRedirectUri = configuration.Value.PostLogoutRedirectUri
            };

            return await Task.FromResult(resp);
        }
    }

    public class BCeIDConfiguration
    {
        public string Issuer { get; set; } = null!;
        public string ClientId { get; set; } = null!;
        public string PostLogoutRedirectUri { get; set; } = null;
        public string ResponseType { get; set; } = "code";
        public string Scope { get; set; } = "openid profile email offline_access";
    }

    public class BCeIdConfigurationResponse
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }
}