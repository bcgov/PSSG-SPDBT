using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Licence;
public class ServiceExtension : IConfigureComponentServices
{
    public void ConfigureServices(ConfigurationServices configurationServices)
    {
        configurationServices.Services.AddTransient<IPersonalLicenceAppManager, PersonalLicenceAppManager>();
        configurationServices.Services.AddTransient<IFeeManager, FeeManager>();
        configurationServices.Services.AddTransient<ILicenceManager, LicenceManager>();
    }
}
