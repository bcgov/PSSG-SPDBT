using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly.Timeout;
using Polly;
using Spd.Utilities.Cache;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment.TokenProviders;
internal class BearerSecurityTokenProvider : ISecurityTokenProvider
{
    private const string cacheKey = "paybc_invoice_oauth_token";

    private readonly IHttpClientFactory httpClientFactory;
    private readonly IDistributedCache cache;
    private readonly ILogger<ISecurityTokenProvider> logger;
    private readonly PayBCSettings options;

    public BearerSecurityTokenProvider(
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
        await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(this.options.ARInvoice.AuthenticationSettings.OAuthTokenCachedInMins)) ?? string.Empty;


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
        var pollyContext = new Context("GetTokenForInvoice");
        var wrapper = Policy.WrapAsync(retryPolicy, timeoutPolicy);

        var response = await wrapper.ExecuteAsync(async ctx =>
        {
            using var httpClient = httpClientFactory.CreateClient("oauth");
            string secret = $"{options.ARInvoice.AuthenticationSettings.ClientId}:{options.ARInvoice.AuthenticationSettings.ClientSecret}";
            string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
            httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + basicToken);
            var content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");
            return await httpClient.PostAsync(options.ARInvoice.AuthenticationSettings.OAuth2TokenEndpointUrl,
                content);
        }, pollyContext);

        if (!response.IsSuccessStatusCode) throw new InvalidOperationException(response.ToString());

        var resp = await response.Content.ReadFromJsonAsync<BearerAccessToken>();
        return resp.access_token;
    }
}

internal record BearerAccessToken
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public int expires_in { get; set; }
}
