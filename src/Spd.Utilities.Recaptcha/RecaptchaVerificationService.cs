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
        using var content = new FormUrlEncodedContent(new Dictionary<string, string>()
            {
                { "secret", options.SecretKey },
                { "response", clientResponse }
            });
        using var client = httpClientFactory.CreateClient("recaptcha");

        var response = await client.PostAsync(options.Url, content, ct);
        response.EnsureSuccessStatusCode();

        var responseData = await response.Content.ReadFromJsonAsync<CaptchaResponse>(ct);
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