﻿using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Timeout;
using System.Net.Http.Json;

namespace Spd.Utilities.Payment.TokenProviders
{
    internal interface ISecurityTokenProvider
    {
        Task<string> AcquireToken(OAuthSettings oAuthSettings, CancellationToken ct = default);
    }

    internal abstract class SecurityTokenProvider : ISecurityTokenProvider
    {
        protected readonly IHttpClientFactory httpClientFactory;
        protected readonly IDistributedCache cache;
        protected readonly ILogger<ISecurityTokenProvider> logger;

        protected SecurityTokenProvider(
            IHttpClientFactory httpClientFactory,
            IDistributedCache cache,
            ILogger<SecurityTokenProvider> logger)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.logger = logger;
        }

        protected async Task<string?> AcquireTokenInternal(OAuthSettings oAuthSettings, string contextName, Type t, CancellationToken ct)
        {
            var timeoutInMilliSecs = oAuthSettings.OAuthTokenRequestTimeoutInMilliSeconds; // Time out the request after 2000 ms
            var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromMilliseconds(timeoutInMilliSecs), TimeoutStrategy.Pessimistic);
            var retryPolicy = Policy.Handle<TimeoutRejectedException>() // notice that we are handling a TimeoutRejectedException
                    .WaitAndRetryAsync(
                        oAuthSettings.OAuthTokenRequestMaxRetryTimes,
                        _ => TimeSpan.FromMilliseconds(timeoutInMilliSecs),
                        (result, timespan, retryNo, context) =>
                        {
                            logger.LogInformation("{OperationKey}: Retry number {RetryNo} within {TotalMilliseconds}ms. Get timeout rejection",
                                context.OperationKey, retryNo, timespan.TotalMilliseconds);
                        }
                    );
            var pollyContext = new Context(contextName);
            var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);

            var response = await wrapper.ExecuteAsync(async ctx =>
            {
                return await GetToken(oAuthSettings, ct);
            }, pollyContext);

            if (!response.IsSuccessStatusCode) throw new InvalidOperationException(response.ToString());
            if (t == typeof(BearerAccessToken))
            {
                var resp = await response.Content.ReadFromJsonAsync<BearerAccessToken>(ct);
                return resp?.access_token;
            }
            if (t == typeof(BasicAccessToken))
            {
                var resp = await response.Content.ReadFromJsonAsync<BasicAccessToken>(ct);
                return resp?.access_token;
            }
            return null;
        }

        protected abstract Task<HttpResponseMessage> GetToken(OAuthSettings oAuthSettings, CancellationToken ct);

        public abstract Task<string> AcquireToken(OAuthSettings oAuthSettings, CancellationToken ct = default);
    }
}