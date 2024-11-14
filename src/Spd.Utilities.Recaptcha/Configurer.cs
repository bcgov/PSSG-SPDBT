using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;
using System.Configuration;

namespace Spd.Utilities.Recaptcha;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        var configuration = configurationServices.Configuration;
        var services = configurationServices.Services;

        var config = configuration.GetSection("GoogleReCaptcha").Get<GoogleReCaptchaConfiguration>();

        if (config == null)
            throw new ConfigurationErrorsException("GoogleReCaptchaConfiguration is not correct.");

        services.Configure<GoogleReCaptchaConfiguration>(opts =>
        {
            configuration.GetSection("GoogleReCaptcha").Bind(opts);
        });

        services.AddHttpClient("recaptcha");
        services.AddTransient<IRecaptchaVerificationService, RecaptchaVerificationService>();
    }
}