using IdentityModel.Client;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Timeout;

namespace Spd.Utilities.Dynamics
{
    public interface ISecurityTokenProvider
    {
        Task<string> AcquireToken(CancellationToken ct = default);
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
            ILogger<OauthSecurityTokenProvider> logger)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.logger = logger;
            this.options = options.Value;
        }

        public async Task<string> AcquireToken(CancellationToken ct = default) =>
            await cache.GetAsync(cacheKey,
                AcquireTokenInternal,
                TimeSpan.FromMinutes(options.AuthenticationSettings.OAuth2TokenCachedInMins),
                ct) ?? string.Empty;

        private async ValueTask<string?> AcquireTokenInternal(CancellationToken ct)
        {
            var timeoutInMilliSecs = this.options.AuthenticationSettings.OAuth2TokenRequestTimeoutInMilliSeconds; // Time out the request after 200 ms
            var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromMilliseconds(timeoutInMilliSecs), TimeoutStrategy.Pessimistic);
            var retryPolicy = Policy.Handle<TimeoutRejectedException>() // notice that we are handling a TimeoutRejectedException
                    .WaitAndRetryAsync(
                        this.options.AuthenticationSettings.OAuth2TokenRequestMaxRetryTimes,
                        _ => TimeSpan.FromMilliseconds(timeoutInMilliSecs),
                        (result, timespan, retryNo, context) =>
                        {
                            logger.LogInformation("{OperationKey}: Retry number {RetryNo} within {TotalMilliseconds}ms. Get timeout rejection",
                                context.OperationKey, retryNo, timespan.TotalMilliseconds);
                        }
                    );
            var pollyContext = new Context("GetDynamicsToken");
            var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);

            var response = await wrapper.ExecuteAsync(async ctx =>
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
                }, ct);
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