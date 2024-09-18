using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Screening;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        configurationServices.Services.AddTransient<IApplicationManager, ApplicationManager>();
        configurationServices.Services.AddTransient<IOrgRegistrationManager, OrgRegistrationManager>();
        configurationServices.Services.AddTransient<IOrgUserManager, OrgUserManager>();
        configurationServices.Services.AddTransient<IOrgManager, OrgManager>();
        configurationServices.Services.AddTransient<IUserProfileManager, UserProfileManager>();
    }
}
