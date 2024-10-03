using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Manager.Common.Admin;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Presentation.Licensing.Controllers
{
    public class ConfigurationController : SpdControllerBase
    {
        private readonly IOptions<BCeIDAuthenticationConfiguration> _bceidOption;
        private readonly IOptions<BcscAuthenticationConfiguration> _bcscOption;
        private readonly IConfiguration _configuration;
        private readonly IOptions<GoogleReCaptchaConfiguration> _captchaOption;
        private readonly IMediator _mediator;

        public ConfigurationController(IOptions<BCeIDAuthenticationConfiguration> bceidConfiguration,
            IOptions<GoogleReCaptchaConfiguration> captchaOption,
            IOptions<BcscAuthenticationConfiguration> bcscConfiguration,
            IConfiguration configuration,
            IMediator mediator)
        {
            _bceidOption = bceidConfiguration;
            _captchaOption = captchaOption;
            _bcscOption = bcscConfiguration;
            _configuration = configuration;
            _mediator = mediator;
        }

        [Route("api/configuration")]
        [HttpGet]
        public async Task<ConfigurationResponse> Get()
        {
            OidcConfiguration oidcResp = new()
            {
                Issuer = _bceidOption.Value.Issuer,
                ClientId = _bceidOption.Value.ClientId,
                ResponseType = _bceidOption.Value.ResponseType,
                Scope = _bceidOption.Value.Scope,
                PostLogoutRedirectUri = _bceidOption.Value.PostLogoutRedirectUri,
                IdentityProvider = _bceidOption.Value.IdentityProvider
            };

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

            var invalidCategoryMatrix = _configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
            if (invalidCategoryMatrix == null)
                throw new ApiException(HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");

            var licenceFeesResponse = await _mediator.Send(new GetLicenceFeeListQuery(null));
            var replacementProcessingTime = await _mediator.Send(new GetReplacementProcessingTimeQuery());
            var version = _configuration.GetValue<string>("VERSION");

            return await Task.FromResult(new ConfigurationResponse(
                oidcResp,
                recaptchaResp,
                bcscConfig,
                invalidCategoryMatrix,
                (List<LicenceFeeResponse>)licenceFeesResponse.LicenceFees,
                replacementProcessingTime,
                version));
        }
    }

    public record ConfigurationResponse(
        OidcConfiguration OidcConfiguration,
        RecaptchaConfiguration RecaptchaConfiguration,
        OidcConfiguration BcscConfiguration,
        Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>> InvalidWorkerLicenceCategoryMatrixConfiguration,
        List<LicenceFeeResponse> LicenceFees,
        string? ReplacementProcessingTime,
        string? Version
    );

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