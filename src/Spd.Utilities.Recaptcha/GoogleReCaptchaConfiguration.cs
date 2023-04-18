namespace Spd.Utilities.Recaptcha;
public class GoogleReCaptchaConfiguration
{
    private const string UriString = "https://www.google.com/recaptcha/api/siteverify";

    public string SecretKey { get; set; } = null!;
    public Uri Url { get; set; } = new Uri(UriString);
    public string ClientKey { get; set; } = null!;
}
