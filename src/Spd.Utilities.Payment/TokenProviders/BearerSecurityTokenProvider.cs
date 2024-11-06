using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Spd.Utilities.Payment.TokenProviders;

internal class BearerSecurityTokenProvider : SecurityTokenProvider
{
    private const string cacheKey = "paybc_invoice_oauth_token";

    public BearerSecurityTokenProvider(
    IHttpClientFactory httpClientFactory,
    IDistributedCache cache,
    ILogger<BearerSecurityTokenProvider> logger) : base(httpClientFactory, cache, logger)
    { }

    public override async Task<string> AcquireToken(OAuthSettings oAuthSettings, CancellationToken ct = default) =>
        await cache.GetAsync(cacheKey,
            async ct => await AcquireInvoiceServiceToken(oAuthSettings, ct),
            TimeSpan.FromMinutes(oAuthSettings.OAuthTokenCachedInMins),
            ct) ?? string.Empty;

    protected async ValueTask<string?> AcquireInvoiceServiceToken(OAuthSettings oauthSettings, CancellationToken ct)
    {
        return await AcquireTokenInternal(oauthSettings, "GetTokenForInvoice", typeof(BearerAccessToken), ct);
    }

    protected override async Task<HttpResponseMessage> GetToken(OAuthSettings oAuthSettings, CancellationToken ct)
    {
        using var httpClient = httpClientFactory.CreateClient("oauth");
        string secret = $"{oAuthSettings.ClientId}:{oAuthSettings.ClientSecret}";
        string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
        httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + basicToken);
        using var content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");
        return await httpClient.PostAsync(oAuthSettings.OAuth2TokenEndpointUrl, content, ct);
    }
}

internal record BearerAccessToken
{
    public string? access_token { get; set; }
    public string? token_type { get; set; }
    public int expires_in { get; set; } = 3000;
}