using Microsoft.Extensions.DependencyInjection;
using Spd.Manager.Cases.Screening;
using Spd.Manager.Cases.Payment;
using Spd.Utilities.Hosting;
using Spd.Manager.Cases.Licence;

namespace Spd.Manager.Cases
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IApplicationManager, ApplicationManager>();
            configurationServices.Services.AddTransient<IPaymentManager, PaymentManager>();
            configurationServices.Services.AddTransient<ILicenceManager, LicenceManager>();
        }
    }
}
