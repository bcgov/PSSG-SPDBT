using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Manager.Admin;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
    public class ConfigurationController : SpdControllerBase
    {
        private readonly IOptions<BCeIDAuthenticationConfiguration> _bceidOption;
        private readonly IOptions<GoogleReCaptchaConfiguration> _captchaOption;
        private readonly IMediator _mediator;

        public ConfigurationController(IOptions<BCeIDAuthenticationConfiguration> bceidConfiguration,
            IOptions<GoogleReCaptchaConfiguration> captchaOption, IMediator mediator)
        {
            _bceidOption = bceidConfiguration;
            _captchaOption = captchaOption;
            _mediator = mediator;
        }


        [Route("api/configuration")]
        [HttpGet]
        public async Task<ConfigurationResponse> Get()
        {
            OidcConfiguration bceidResp = new OidcConfiguration
            {
                Issuer = _bceidOption.Value.Issuer,
                ClientId = _bceidOption.Value.ClientId,
                ResponseType = _bceidOption.Value.ResponseType,
                Scope = _bceidOption.Value.Scope,
                PostLogoutRedirectUri = _bceidOption.Value.PostLogoutRedirectUri
            };

            RecaptchaConfiguration recaptchaResp = new RecaptchaConfiguration(_captchaOption.Value.ClientKey);
            var bannerMessage = await _mediator.Send(new GetBannerMsgQuery());

            return await Task.FromResult(new ConfigurationResponse() { OidcConfiguration = bceidResp, RecaptchaConfiguration = recaptchaResp, BannerMessage = bannerMessage });
        }
    }

    public record ConfigurationResponse
    {
        public OidcConfiguration OidcConfiguration { get; set; } = null!;
        public RecaptchaConfiguration RecaptchaConfiguration { get; set; } = null!;
        public string BannerMessage { get; set; }
    }

    public record OidcConfiguration
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }

    public record RecaptchaConfiguration(string Key);
}