namespace Spd.Utilities.Recaptcha;

public class GoogleReCaptchaConfiguration
{
#pragma warning disable S1075 // URIs should not be hardcoded
    private const string UriString = "https://www.google.com/recaptcha/api/siteverify";
#pragma warning restore S1075 // URIs should not be hardcoded

    public string SecretKey { get; set; } = null!;
    public Uri Url { get; set; } = new Uri(UriString);
    public string ClientKey { get; set; } = null!;
}