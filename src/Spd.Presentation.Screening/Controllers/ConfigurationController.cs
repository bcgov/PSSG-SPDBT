using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
    public class ConfigurationController : SpdControllerBase
    {
        private readonly IOptions<BCeIDAuthenticationConfiguration> _bceidOption;
        private readonly IOptions<GoogleReCaptchaConfiguration> _captchaOption;

        public ConfigurationController(IOptions<BCeIDAuthenticationConfiguration> bceidConfiguration,
            IOptions<GoogleReCaptchaConfiguration> captchaOption)
        {
            _bceidOption = bceidConfiguration;
            _captchaOption = captchaOption;
        }


        [Route("api/bceid-configuration")]
        [HttpGet]
        public async Task<BCeIdConfigurationResponse> Get()
        {
            BCeIdConfigurationResponse resp = new BCeIdConfigurationResponse
            {
                Issuer = _bceidOption.Value.Issuer,
                ClientId = _bceidOption.Value.ClientId,
                ResponseType = _bceidOption.Value.ResponseType,
                Scope = _bceidOption.Value.Scope,
                PostLogoutRedirectUri = _bceidOption.Value.PostLogoutRedirectUri
            };

            return await Task.FromResult(resp);
        }

        [Route("api/recaptcha-configuration")]
        [HttpGet]
        public async Task<RecaptchaConfigurationResponse> GetRecaptchaConfiguration()
        {
            RecaptchaConfigurationResponse resp = new RecaptchaConfigurationResponse(_captchaOption.Value.ClientKey);
            return await Task.FromResult(resp);
        }
    }

    public record BCeIdConfigurationResponse
    {
        public string Issuer { get; set; } 
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }

    public record RecaptchaConfigurationResponse(string Key);
}