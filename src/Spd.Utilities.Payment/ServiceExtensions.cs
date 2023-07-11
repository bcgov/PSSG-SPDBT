using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.Payment
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddPaymentService(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<PaymentSettings>(opts => configuration.GetSection("payment").Bind(opts));
            services.AddTransient<IPaymentService, PaymentService>();
            return services;
        }
    }
}