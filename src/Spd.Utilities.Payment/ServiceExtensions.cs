using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.Payment
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddPaymentService(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<PayBCSettings>(opts => configuration.GetSection("PayBC").Bind(opts));
            services.AddTransient<IPaymentService, PaymentService>();
            return services;
        }
    }
}