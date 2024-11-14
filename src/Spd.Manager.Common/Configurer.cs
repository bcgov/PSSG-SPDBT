using Microsoft.Extensions.DependencyInjection;
using Spd.Manager.Common.Admin;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Common
{
    public class Configurer : IConfigureComponents
    {
        public void Configure(ConfigurationContext configurationServices)
        {
            configurationServices.Services.AddTransient<IAdminManager, AdminManager>();
        }
    }
}