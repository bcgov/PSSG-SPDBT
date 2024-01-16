using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Screening;

public class ServiceExtension : IConfigureComponentServices
{
    public void ConfigureServices(ConfigurationServices configurationServices)
    {
        configurationServices.Services.AddTransient<IApplicationManager, ApplicationManager>();
    }
}
