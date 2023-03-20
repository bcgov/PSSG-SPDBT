using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Organizations.User
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IOrgUserRepository, OrgUserRepository>();
        }
    }
}
