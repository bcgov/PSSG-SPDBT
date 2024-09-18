using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Licence;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        configurationServices.Services.AddTransient<ISecurityWorkerAppManager, SecurityWorkerAppManager>();
        configurationServices.Services.AddTransient<IFeeManager, FeeManager>();
        configurationServices.Services.AddTransient<ILicenceManager, LicenceManager>();
        configurationServices.Services.AddTransient<IPermitAppManager, PermitAppManager>();
        configurationServices.Services.AddTransient<IBizLicAppManager, BizLicAppManager>();
    }
}