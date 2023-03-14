using Microsoft.Extensions.DependencyInjection;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Manager.Membership.OrgUser;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Membership
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IOrgRegistrationManager, OrgRegistrationManager>();
            configurationServices.Services.AddTransient<IOrgUserManager, OrgUserManager>();
        }
    }
}
