using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Manager.Common.Admin;
using Spd.Resource.Repository.Config;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;

namespace Spd.Presentation.GuideDogServiceDog.Controllers
{
    public class ConfigurationController : SpdControllerBase
    {
        private readonly IOptions<BcscAuthenticationConfiguration> _bcscOption;
        private readonly IConfiguration _configuration;
        private readonly IOptions<GoogleReCaptchaConfiguration> _captchaOption;
        private readonly IMediator _mediator;

        public ConfigurationController(
            IOptions<BCeIDAuthenticationConfiguration> bceidConfiguration,
            IOptions<BcscAuthenticationConfiguration> bcscConfiguration,
            IOptions<IdirAuthenticationConfiguration> idirConfiguration,
            IOptions<GoogleReCaptchaConfiguration> captchaOption,
            IMediator mediator,
            IConfiguration configuration)
        {
            _captchaOption = captchaOption;
            _bcscOption = bcscConfiguration;
            _configuration = configuration;
            _mediator = mediator;
        }

        /// <summary>
        /// Return the configuration FE needs.
        /// The environment value could be: Development, Production, Staging,Test, Training
        /// </summary>
        /// <returns></returns>
        [Route("api/configuration")]
        [HttpGet]
        public async Task<ConfigurationResponse> Get()
        {
            OidcConfiguration bcscConfig = new()
            {
                Issuer = _bcscOption.Value.Issuer,
                ClientId = _bcscOption.Value.ClientId,
                ResponseType = _bcscOption.Value.ResponseType,
                Scope = _bcscOption.Value.Scope,
                PostLogoutRedirectUri = _bcscOption.Value.PostLogoutRedirectUri,
                IdentityProvider = _bcscOption.Value.IdentityProvider
            };

            RecaptchaConfiguration recaptchaResp = new(_captchaOption.Value.ClientKey);
            var bannerMessage = await _mediator.Send(new GetBannerMsgQuery(IConfigRepository.BANNER_MSG_GDSD_CONFIG_KEY));
            var version = _configuration.GetValue<string>("VERSION");

            return await Task.FromResult(new ConfigurationResponse()
            {
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Undefined",
                BcscConfiguration = bcscConfig,
                RecaptchaConfiguration = recaptchaResp,
                BannerMessage = bannerMessage ?? string.Empty,
                Version = version
            });
        }
    }

    public record ConfigurationResponse
    {
        public string Environment { get; set; }
        public OidcConfiguration BcscConfiguration { get; set; } = null!;
        public RecaptchaConfiguration RecaptchaConfiguration { get; set; } = null!;
        public string BannerMessage { get; set; } = null!;
        public string? Version { get; set; }
    }

    public record OidcConfiguration
    {
        public string? Issuer { get; set; }
        public string? ClientId { get; set; }
        public string? ResponseType { get; set; }
        public string? Scope { get; set; }
        public Uri? PostLogoutRedirectUri { get; set; }
        public string? IdentityProvider { get; set; }
    }
    public record RecaptchaConfiguration(string Key);
}