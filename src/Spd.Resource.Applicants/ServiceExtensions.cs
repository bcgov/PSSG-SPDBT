using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Applicants
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IApplicationRepository, ApplicationRepository>();
            configurationServices.Services.AddTransient<IApplicationInviteRepository, ApplicationInviteRepository>();
        }
    }
}
