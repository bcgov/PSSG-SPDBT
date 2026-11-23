using IdentityModel.Client;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.Dynamics
{
    internal class EntraIdSecurityTokenProvider(
        IHttpClientFactory httpClientFactory,
        IDistributedCache cache,
        IOptions<DynamicsSettings> options,
        ILogger<EntraIdSecurityTokenProvider> logger
    ) : ISecurityTokenProvider
    {
        private readonly DynamicsSettings settings = options.Value;

        public async Task<string> AcquireToken(CancellationToken ct = default)
        {
            var entraId = settings.EntraId;
            if (
                string.IsNullOrWhiteSpace(entraId.TenantId)
                || string.IsNullOrWhiteSpace(entraId.ClientId)
                || string.IsNullOrWhiteSpace(entraId.ClientSecret)
                || string.IsNullOrWhiteSpace(entraId.ResourceName)
            )
            {
                throw new InvalidOperationException("Dynamics EntraId requires TenantId, ClientId, ClientSecret and ResourceName.");
            }

            var cacheKey = $"dynamics_entraid_token_{entraId.TenantId}_{entraId.ClientId}_{entraId.ResourceName}";
            return await cache.GetAsync(
                    cacheKey,
                    AcquireTokenInternal,
                    TimeSpan.FromMinutes(settings.AuthenticationSettings.OAuth2TokenCachedInMins),
                    ct
                ) ?? throw new InvalidOperationException("Dynamics Entra ID token response did not contain an access token.");
        }

        private async ValueTask<string> AcquireTokenInternal(CancellationToken ct)
        {
            var entraId = settings.EntraId;
            var endpoint = $"https://login.microsoftonline.com/{Uri.EscapeDataString(entraId.TenantId)}/oauth2/v2.0/token";
            var response = await DynamicsTokenRequest.RequestAsync(
                settings.AuthenticationSettings,
                logger,
                async cancellation =>
                {
                    var httpClient = httpClientFactory.CreateClient("oauth");
                    return await httpClient.RequestClientCredentialsTokenAsync(
                        new ClientCredentialsTokenRequest
                        {
                            Address = endpoint,
                            ClientId = entraId.ClientId,
                            ClientSecret = entraId.ClientSecret,
                            Scope = $"{entraId.ResourceName.TrimEnd('/')}/.default",
                        },
                        cancellation
                    );
                },
                ct
            );

            if (response.IsError)
            {
                logger.LogError("Cannot get Dynamics Entra ID token: {Error}", response.Error);
                throw new InvalidOperationException(
                    $"Dynamics Entra ID token request failed: {response.Error} - {response.ErrorDescription}"
                );
            }

            return response.AccessToken
                ?? throw new InvalidOperationException("Dynamics Entra ID token response did not contain an access token.");
        }
    }
}
