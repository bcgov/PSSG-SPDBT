using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;
using Spd.Utilities.Payment.TokenProviders;

namespace Spd.Utilities.Payment;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        var configuration = configurationServices.Configuration;
        var services = configurationServices.Services;

        services.AddHttpClient();
        services.Configure<PayBCSettings>(opts => configuration.GetSection("PayBC").Bind(opts));
        services.AddTransient<IPaymentService, PaymentService>();
        services.AddSingleton<ITokenProviderResolver, TokenProviderResolver>();
        services.AddSingleton<BasicSecurityTokenProvider>();
        services.AddSingleton<BearerSecurityTokenProvider>();
    }
}