using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace Spd.Utilities.Recaptcha;

internal class RecaptchaVerificationService : IRecaptchaVerificationService
{
    private readonly IHttpClientFactory httpClientFactory;
    private readonly GoogleReCaptchaConfiguration options;

    public RecaptchaVerificationService(IHttpClientFactory httpClientFactory, IOptions<GoogleReCaptchaConfiguration> options)
    {
        this.httpClientFactory = httpClientFactory;
        this.options = options.Value;
    }

    public async Task<bool> VerifyAsync(string clientResponse, CancellationToken ct)
    {
        var content = new Dictionary<string, string>()
            {
                { "secret", options.SecretKey },
                { "response", clientResponse }
            };
        using var client = httpClientFactory.CreateClient("recaptcha");

        var response = await client.PostAsync(options.Url.AbsoluteUri, new FormUrlEncodedContent(content), ct);
        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<CaptchaResponse>();
        if (responseData != null)
        {
            return responseData.Success;
        }
        return false;
    }
}

internal class CaptchaResponse
{
    public bool Success { get; set; }
}
