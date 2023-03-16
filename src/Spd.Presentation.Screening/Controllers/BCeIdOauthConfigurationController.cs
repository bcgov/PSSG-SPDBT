using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Utilities.LogonUser.Configurations;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class BCeIDConfigurationController : ControllerBase
    {
        private readonly ILogger<BCeIDConfigurationController> logger;
        private readonly IOptions<BCeIDAuthenticationConfiguration> configuration;

        public BCeIDConfigurationController(ILogger<BCeIDConfigurationController> logger, IOptions<BCeIDAuthenticationConfiguration> configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }


        [Route("api/bceid-configuration")]
        [HttpGet]
        public async Task<BCeIdConfigurationResponse> Get()
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

    public class BCeIdConfigurationResponse
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }
}