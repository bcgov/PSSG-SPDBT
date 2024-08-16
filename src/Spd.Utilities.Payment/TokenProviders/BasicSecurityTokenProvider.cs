using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Spd.Utilities.Payment.TokenProviders;

internal class BasicSecurityTokenProvider : SecurityTokenProvider
{
    private const string cacheKey = "paybc_refund_oauth_token";

    public BasicSecurityTokenProvider(
        IHttpClientFactory httpClientFactory,
        IDistributedCache cache,
        IOptions<PayBCSettings> options,
        ILogger<BasicSecurityTokenProvider> logger) : base(httpClientFactory, cache, options, logger)
    { }

    public override async Task<string> AcquireToken(CancellationToken ct) =>
        await cache.GetAsync(cacheKey, AcquireRefundServiceToken,
            TimeSpan.FromMinutes(options.DirectRefund.AuthenticationSettings.OAuthTokenCachedInMins)) ?? string.Empty;

    protected async ValueTask<string?> AcquireRefundServiceToken(CancellationToken ct)
    {
        return await AcquireTokenInternal(options.DirectRefund.AuthenticationSettings, "GetTokenForRefund", typeof(BasicAccessToken), ct);
    }

    protected override async Task<HttpResponseMessage> GetToken(CancellationToken ct)
    {
        using var httpClient = httpClientFactory.CreateClient("oauth");
        string secret = $"{options.DirectRefund.AuthenticationSettings.ClientId}:{options.DirectRefund.AuthenticationSettings.ClientSecret}";
        string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
        httpClient.DefaultRequestHeaders.Add("Basic-Token", "Basic " + basicToken);
        return await httpClient.GetAsync(options.DirectRefund.AuthenticationSettings.OAuth2TokenEndpointUrl, ct);
    }
}

internal record BasicAccessToken
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public DateTimeOffset expires_at { get; set; }
}