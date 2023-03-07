using IdentityModel.Client;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Spd.Utilities.Cache;

namespace Spd.Utilities.Dynamics
{
    public interface ISecurityTokenProvider
    {
        Task<string> AcquireToken();
    }

    internal class OauthSecurityTokenProvider : ISecurityTokenProvider
    {
        private const string cacheKey = "oauth_token";

        private readonly IHttpClientFactory httpClientFactory;
        private readonly IDistributedCache cache;
        private readonly DynamicsSettings options;

        public OauthSecurityTokenProvider(
            IHttpClientFactory httpClientFactory,
            IDistributedCache cache,
            IOptions<DynamicsSettings> options)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.options = options.Value;
        }

        public async Task<string> AcquireToken() => await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(5)) ?? string.Empty;


        private async Task<string> AcquireTokenInternal()
        {
            using var httpClient = httpClientFactory.CreateClient("oauth");

            var response = await httpClient.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = options.AuthenticationSettings.OAuth2TokenEndpointUrl.AbsoluteUri,
                ClientId = options.AuthenticationSettings.ClientId,
                ClientSecret = options.AuthenticationSettings.ClientSecret,
                Resource = { options.AuthenticationSettings.ResourceName },
                UserName = $"{options.AuthenticationSettings.ServiceAccountDomain}\\{options.AuthenticationSettings.ServiceAccountName}",
                Password = options.AuthenticationSettings.ServiceAccountPassword,
                Scope = "openid",
            });

            if (response.IsError) throw new InvalidOperationException(response.Error);

            return response.AccessToken;
        }
    }
}
