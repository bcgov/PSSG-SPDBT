using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Spd.Utilities.Cache;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment.TokenProviders;
internal class BasicSecurityTokenProvider : SecurityTokenProvider
{
    private const string cacheKey = "paybc_refund_oauth_token";
    public BasicSecurityTokenProvider(
        IHttpClientFactory httpClientFactory,
        IDistributedCache cache,
        IOptions<PayBCSettings> options,
        ILogger<ISecurityTokenProvider> logger) : base(httpClientFactory, cache, options, logger)
    { }

    public override async Task<string> AcquireToken() =>
        await cache.GetOrSet(cacheKey, AcquireRefundServiceToken, TimeSpan.FromMinutes(options.DirectRefund.AuthenticationSettings.OAuthTokenCachedInMins)) ?? string.Empty;

    protected async Task<string?> AcquireRefundServiceToken()
    {
        return await AcquireTokenInternal(options.DirectRefund.AuthenticationSettings, "GetTokenForRefund", typeof(BasicAccessToken));
    }

    protected override async Task<HttpResponseMessage> GetToken()
    {
        using var httpClient = httpClientFactory.CreateClient("oauth");
        string secret = $"{options.DirectRefund.AuthenticationSettings.ClientId}:{options.DirectRefund.AuthenticationSettings.ClientSecret}";
        string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
        httpClient.DefaultRequestHeaders.Add("Basic-Token", "Basic " + basicToken);
        return await httpClient.GetAsync(options.DirectRefund.AuthenticationSettings.OAuth2TokenEndpointUrl);
    }
}

internal record BasicAccessToken
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public DateTimeOffset expires_at { get; set; }
}
