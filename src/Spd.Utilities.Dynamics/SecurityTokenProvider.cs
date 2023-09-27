using IdentityModel.Client;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Timeout;
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
        private readonly ILogger<ISecurityTokenProvider> logger;
        private readonly DynamicsSettings options;

        public OauthSecurityTokenProvider(
            IHttpClientFactory httpClientFactory,
            IDistributedCache cache,
            IOptions<DynamicsSettings> options,
            ILogger<ISecurityTokenProvider> logger)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.logger = logger;
            this.options = options.Value;
        }

        public async Task<string> AcquireToken() => await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(30)) ?? string.Empty;


        private async Task<string> AcquireTokenInternal()
        {
            var timeoutInMilliSecs = 2000; // Time out the request after 200 ms
            var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromMilliseconds(timeoutInMilliSecs), TimeoutStrategy.Pessimistic);
            var retryPolicy = Policy.Handle<TimeoutRejectedException>() // notice that we are handling a TimeoutRejectedException
                    .WaitAndRetryAsync(
                        5,
                        _ => TimeSpan.FromMilliseconds(2000),
                        (result, timespan, retryNo, context) =>
                        {
                            logger.LogInformation($"{context.OperationKey}: Retry number {retryNo} within " +
                                $"{timespan.TotalMilliseconds}ms. Get timeout rejection");
                        }
                    );
            var pollyContext = new Context("test");
            var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);

            var response = await wrapper.ExecuteAsync( async ctx => 
            {
                var httpClient = httpClientFactory.CreateClient("oauth");
                return await httpClient.RequestPasswordTokenAsync(new PasswordTokenRequest
                {
                    Address = options.AuthenticationSettings.OAuth2TokenEndpointUrl.AbsoluteUri,
                    ClientId = options.AuthenticationSettings.ClientId,
                    ClientSecret = options.AuthenticationSettings.ClientSecret,
                    Resource = { options.AuthenticationSettings.ResourceName },
                    UserName = $"{options.AuthenticationSettings.ServiceAccountDomain}\\{options.AuthenticationSettings.ServiceAccountName}",
                    Password = options.AuthenticationSettings.ServiceAccountPassword,
                    Scope = "openid",
                });
             }, pollyContext);

            if (response.IsError)
            {
                logger.LogError("Cannot get token");
                throw new InvalidOperationException(response.Error);
            }

            return response.AccessToken;
        }
    }
}
