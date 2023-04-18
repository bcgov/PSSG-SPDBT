using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Configuration;

namespace Spd.Utilities.Recaptcha;
public static class ServiceExtensions
{
    public static IServiceCollection AddGoogleRecaptcha(this IServiceCollection services, IConfiguration configuration)
    {
        var config = configuration.GetSection("GoogleReCaptcha").Get<GoogleReCaptchaConfiguration>();

        if (config == null)
            throw new ConfigurationErrorsException("GoogleReCaptchaConfiguration is not correct.");

        services.Configure<GoogleReCaptchaConfiguration>(opts =>
        {
            configuration.GetSection("GoogleReCaptcha").Bind(opts);
        });

        services.AddHttpClient("recaptcha");
        services.AddTransient<IRecaptchaVerificationService, RecaptchaVerificationService>();
        return services;
    }
}
