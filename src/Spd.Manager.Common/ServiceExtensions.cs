using Microsoft.Extensions.DependencyInjection;
using Spd.Manager.Common.Admin;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Common
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            //configurationServices.Services.AddTransient<IAdminManager, AdminManager>();
        }
    }
}
