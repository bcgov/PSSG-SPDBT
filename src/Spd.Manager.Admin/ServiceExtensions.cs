using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Admin
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(Spd.Manager.Admin.MediatREntrypoint).Assembly));
            configurationServices.Services.AddTransient<IAdminManager, AdminManager>();
        }
    }
}
