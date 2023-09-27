using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Timeout;
using Spd.Utilities.Cache;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment.TokenProviders;
internal class BasicSecurityTokenProvider : ISecurityTokenProvider
{
    private const string cacheKey = "paybc_refund_oauth_token";

    private readonly IHttpClientFactory httpClientFactory;
    private readonly IDistributedCache cache;
    private readonly ILogger<ISecurityTokenProvider> logger;
    private readonly PayBCSettings options;

    public BasicSecurityTokenProvider(
        IHttpClientFactory httpClientFactory,
        IDistributedCache cache,
        IOptions<PayBCSettings> options,
        ILogger<ISecurityTokenProvider> logger)
    {
        this.httpClientFactory = httpClientFactory;
        this.cache = cache;
        this.logger = logger;
        this.options = options.Value;
    }

    public async Task<string> AcquireToken() => 
        await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(this.options.DirectRefund.AuthenticationSettings.OAuthTokenCachedInMins)) ?? string.Empty;

    private async Task<string> AcquireTokenInternal()
    {
        var timeoutInMilliSecs = this.options.DirectRefund.AuthenticationSettings.OAuthTokenRequestTimeoutInMilliSeconds; // Time out the request after 200 ms
        var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromMilliseconds(timeoutInMilliSecs), TimeoutStrategy.Pessimistic);
        var retryPolicy = Policy.Handle<TimeoutRejectedException>() // notice that we are handling a TimeoutRejectedException
                .WaitAndRetryAsync(
                    this.options.DirectRefund.AuthenticationSettings.OAuthTokenRequestMaxRetryTimes,
                    _ => TimeSpan.FromMilliseconds(timeoutInMilliSecs),
                    (result, timespan, retryNo, context) =>
                    {
                        logger.LogInformation($"{context.OperationKey}: Retry number {retryNo} within " +
                            $"{timespan.TotalMilliseconds}ms. Get timeout rejection");
                    }
                );
        var pollyContext = new Context("GetTokenForRefund");
        var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);

        var response = await wrapper.ExecuteAsync(async ctx =>
            {
                using var httpClient = httpClientFactory.CreateClient("oauth");
                string secret = $"{options.DirectRefund.AuthenticationSettings.ClientId}:{options.DirectRefund.AuthenticationSettings.ClientSecret}";
                string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
                httpClient.DefaultRequestHeaders.Add("Basic-Token", "Basic " + basicToken);
                return await httpClient.GetAsync(options.DirectRefund.AuthenticationSettings.OAuth2TokenEndpointUrl);
            }, pollyContext);

        if (!response.IsSuccessStatusCode) throw new InvalidOperationException(response.ToString());
        var resp = await response.Content.ReadFromJsonAsync<BasicAccessToken>();
        return resp.access_token;
    }
}

internal record BasicAccessToken
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public DateTimeOffset expires_at { get; set; }
}
