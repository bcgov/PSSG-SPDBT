using IdentityModel.Client;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.Dynamics
{
    internal class AdfsSecurityTokenProvider : ISecurityTokenProvider
    {
        private const string cacheKey = "oauth_token";

        private readonly IHttpClientFactory httpClientFactory;
        private readonly IDistributedCache cache;
        private readonly ILogger<ISecurityTokenProvider> logger;
        private readonly DynamicsSettings options;

        public AdfsSecurityTokenProvider(
            IHttpClientFactory httpClientFactory,
            IDistributedCache cache,
            IOptions<DynamicsSettings> options,
            ILogger<AdfsSecurityTokenProvider> logger
        )
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.logger = logger;
            this.options = options.Value;
        }

        public async Task<string> AcquireToken(CancellationToken ct = default) =>
            await cache.GetAsync(
                cacheKey,
                AcquireTokenInternal,
                TimeSpan.FromMinutes(options.AuthenticationSettings.OAuth2TokenCachedInMins),
                ct
            ) ?? string.Empty;

        private async ValueTask<string?> AcquireTokenInternal(CancellationToken ct)
        {
            var response = await DynamicsTokenRequest.RequestAsync(
                options.AuthenticationSettings,
                logger,
                async cancellation =>
                {
                    var httpClient = httpClientFactory.CreateClient("oauth");
                    return await httpClient.RequestPasswordTokenAsync(
                        new PasswordTokenRequest
                        {
                            Address = options.AuthenticationSettings.OAuth2TokenEndpointUrl.AbsoluteUri,
                            ClientId = options.AuthenticationSettings.ClientId,
                            ClientSecret = options.AuthenticationSettings.ClientSecret,
                            Resource = { options.AuthenticationSettings.ResourceName },
                            UserName =
                                $"{options.AuthenticationSettings.ServiceAccountDomain}\\{options.AuthenticationSettings.ServiceAccountName}",
                            Password = options.AuthenticationSettings.ServiceAccountPassword,
                            Scope = "openid",
                        },
                        cancellation
                    );
                },
                ct
            );

            if (response.IsError)
            {
                logger.LogError("Cannot get token");
                throw new InvalidOperationException(response.Error);
            }

            return response.AccessToken;
        }
    }
}
