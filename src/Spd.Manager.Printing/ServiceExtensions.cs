using Spd.Utilities.Hosting;

namespace Spd.Manager.Printing
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            //configurationServices.Services.AddTransient<IAdminManager, AdminManager>();
        }
    }
}
