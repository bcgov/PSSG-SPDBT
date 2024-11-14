using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Payment
{
    public class Configurer : IConfigureComponents
    {
        public void Configure(ConfigurationContext configurationServices)
        {
            configurationServices.Services.AddTransient<IPaymentManager, PaymentManager>();
        }
    }
}