﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Licensing.Controllers
{
    public class ConfigurationController : SpdControllerBase
    {
        private readonly IOptions<BCeIDAuthenticationConfiguration> _bceidOption;
        private readonly IOptions<BcscAuthenticationConfiguration> _bcscOption;
        private readonly IOptions<GoogleReCaptchaConfiguration> _captchaOption;

        public ConfigurationController(IOptions<BCeIDAuthenticationConfiguration> bceidConfiguration,
            IOptions<GoogleReCaptchaConfiguration> captchaOption,
            IOptions<BcscAuthenticationConfiguration> bcscConfiguration)
        {
            _bceidOption = bceidConfiguration;
            _captchaOption = captchaOption;
            _bcscOption = bcscConfiguration;
        }


        [Route("api/configuration")]
        [HttpGet]
        public async Task<ConfigurationResponse> Get()
        {
            OidcConfiguration oidcResp = new OidcConfiguration
            {
                Issuer = _bceidOption.Value.Issuer,
                ClientId = _bceidOption.Value.ClientId,
                ResponseType = _bceidOption.Value.ResponseType,
                Scope = _bceidOption.Value.Scope,
                PostLogoutRedirectUri = _bceidOption.Value.PostLogoutRedirectUri
            };

            BcscConfiguration bcscConfig = new BcscConfiguration
            {
                Issuer = _bcscOption.Value.Issuer,
                ClientId = _bcscOption.Value.ClientId,
                ResponseType = _bcscOption.Value.ResponseType,
                Scope = _bcscOption.Value.Scope,
            };
            RecaptchaConfiguration recaptchaResp = new RecaptchaConfiguration(_captchaOption.Value.ClientKey);
            return await Task.FromResult(new ConfigurationResponse()
            {
                OidcConfiguration = oidcResp,
                RecaptchaConfiguration = recaptchaResp,
                BcscConfiguration = bcscConfig,
            });
        }
    }

    public record ConfigurationResponse
    {
        public OidcConfiguration OidcConfiguration { get; set; } = null!;
        public RecaptchaConfiguration RecaptchaConfiguration { get; set; } = null!;
        public BcscConfiguration BcscConfiguration { get; set; } = null!;
    }

    public record OidcConfiguration
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }
    public record BcscConfiguration : OidcConfiguration;
    public record RecaptchaConfiguration(string Key);
}