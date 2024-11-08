using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Spd.Utilities.Payment.TokenProviders;

internal class BasicSecurityTokenProvider(
    IHttpClientFactory httpClientFactory,
    IDistributedCache cache,
    ILogger<BasicSecurityTokenProvider> logger) : SecurityTokenProvider(httpClientFactory, cache, logger)
{
    public override async Task<string> AcquireToken(OAuthSettings oAuthSettings, CancellationToken ct = default) =>
        await AcquireRefundServiceToken(oAuthSettings, ct) ?? string.Empty;

    protected async ValueTask<string?> AcquireRefundServiceToken(OAuthSettings oAuthSettings, CancellationToken ct)
    {
        return await AcquireTokenInternal(oAuthSettings, "GetTokenForRefund", typeof(BasicAccessToken), ct);
    }

    protected override async Task<HttpResponseMessage> GetToken(OAuthSettings oAuthSettings, CancellationToken ct)
    {
        using var httpClient = httpClientFactory.CreateClient("oauth");
        string secret = $"{oAuthSettings.ClientId}:{oAuthSettings.ClientSecret}";
        string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
        httpClient.DefaultRequestHeaders.Add("Basic-Token", "Basic " + basicToken);
        return await httpClient.GetAsync(oAuthSettings.OAuth2TokenEndpointUrl, ct);
    }
}

internal record BasicAccessToken
{
    public string? access_token { get; set; }
    public string? token_type { get; set; }
    public DateTimeOffset expires_at { get; set; }
}