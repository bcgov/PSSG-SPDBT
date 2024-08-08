using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Payment.TokenProviders;

namespace Spd.Utilities.Payment
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddPaymentService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient();
            services.Configure<PayBCSettings>(opts => configuration.GetSection("PayBC").Bind(opts));
            services.AddTransient<IPaymentService, PaymentService>();
            services.AddSingleton<ITokenProviderResolver, TokenProviderResolver>();
            services.AddSingleton<BasicSecurityTokenProvider>();
            services.AddSingleton<BearerSecurityTokenProvider>();
            return services;
        }
    }
}