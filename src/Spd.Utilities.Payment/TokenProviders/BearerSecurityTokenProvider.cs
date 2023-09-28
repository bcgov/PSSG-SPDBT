using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Spd.Utilities.Cache;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment.TokenProviders;
internal class BearerSecurityTokenProvider : SecurityTokenProvider
{
    private const string cacheKey = "paybc_invoice_oauth_token";

    public BearerSecurityTokenProvider(
    IHttpClientFactory httpClientFactory,
    IDistributedCache cache,
    IOptions<PayBCSettings> options,
    ILogger<ISecurityTokenProvider> logger) : base(httpClientFactory, cache, options, logger)
    { }

    public override async Task<string> AcquireToken() =>
        await cache.GetOrSet(cacheKey,
            AcquireInvoiceServiceToken,
            TimeSpan.FromMinutes(options.ARInvoice.AuthenticationSettings.OAuthTokenCachedInMins)) ?? string.Empty;

    protected async Task<string?> AcquireInvoiceServiceToken()
    {
        return await AcquireTokenInternal(options.ARInvoice.AuthenticationSettings, "GetTokenForInvoice", typeof(BearerAccessToken));
    }

    protected override async Task<HttpResponseMessage> GetToken()
    {
        using var httpClient = httpClientFactory.CreateClient("oauth");
        string secret = $"{options.ARInvoice.AuthenticationSettings.ClientId}:{options.ARInvoice.AuthenticationSettings.ClientSecret}";
        string basicToken = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(secret));
        httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + basicToken);
        var content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");
        return await httpClient.PostAsync(options.ARInvoice.AuthenticationSettings.OAuth2TokenEndpointUrl,
            content);
    }
}

internal record BearerAccessToken
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public int expires_in { get; set; }
}
