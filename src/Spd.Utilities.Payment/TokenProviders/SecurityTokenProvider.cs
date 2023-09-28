using Polly.Timeout;
using Polly;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.Payment.TokenProviders
{
    internal interface ISecurityTokenProvider
    {
        Task<string> AcquireToken();
    }

    internal abstract class SecurityTokenProvider : ISecurityTokenProvider
    {
        protected readonly IHttpClientFactory httpClientFactory;
        protected readonly IDistributedCache cache;
        protected readonly ILogger<ISecurityTokenProvider> logger;
        protected readonly PayBCSettings options;

        public SecurityTokenProvider(
            IHttpClientFactory httpClientFactory,
            IDistributedCache cache,
            IOptions<PayBCSettings> options,
            ILogger<ISecurityTokenProvider> logger)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.options = options.Value;
            this.logger = logger;
        }

        public async Task<string?> AcquireTokenInternal(OAuthSettings oAuthSettings, string contextName, Type t)
        {
            var timeoutInMilliSecs = oAuthSettings.OAuthTokenRequestTimeoutInMilliSeconds; // Time out the request after 2000 ms
            var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromMilliseconds(timeoutInMilliSecs), TimeoutStrategy.Pessimistic);
            var retryPolicy = Policy.Handle<TimeoutRejectedException>() // notice that we are handling a TimeoutRejectedException
                    .WaitAndRetryAsync(
                        oAuthSettings.OAuthTokenRequestMaxRetryTimes,
                        _ => TimeSpan.FromMilliseconds(timeoutInMilliSecs),
                        (result, timespan, retryNo, context) =>
                        {
                            logger.LogInformation($"{context.OperationKey}: Retry number {retryNo} within " +
                                $"{timespan.TotalMilliseconds}ms. Get timeout rejection");
                        }
                    );
            var pollyContext = new Context(contextName);
            var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);

            var response = await wrapper.ExecuteAsync(async ctx =>
            {
                return await GetToken();
            }, pollyContext);

            if (!response.IsSuccessStatusCode) throw new InvalidOperationException(response.ToString());
            if (t == typeof(BearerAccessToken))
            {
                var resp = await response.Content.ReadFromJsonAsync<BearerAccessToken>();
                return resp?.access_token;
            }
            if (t == typeof(BasicAccessToken))
            {
                var resp = await response.Content.ReadFromJsonAsync<BasicAccessToken>();
                return resp?.access_token;
            }
            return null;
        }
        protected abstract Task<HttpResponseMessage> GetToken();
        public abstract Task<string> AcquireToken();
    }
}
