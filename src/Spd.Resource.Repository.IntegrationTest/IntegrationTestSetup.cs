using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Repository.IntegrationTest;

public class IntegrationTestSetup
{
    public static readonly string DataPrefix = "spd_integration_";

    public IntegrationTestSetup()
    {
        string assembliesPrefix = "Spd";
        var assemblies = ReflectionExtensions.DiscoverLocalAessemblies(prefix: "Spd.");
        var serviceCollection = new ServiceCollection();

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(
                 path: "appsettings.json",
                 optional: false,
                reloadOnChange: true)
            .AddUserSecrets<IntegrationTestSetup>()
            .AddEnvironmentVariables()
            .Build();

        var loggerFactory = LoggerFactory.Create(builder => { });

        serviceCollection.AddSingleton<IConfiguration>(configuration);
        serviceCollection.AddAutoMapper(assemblies);
        serviceCollection.AddDistributedMemoryCache();
        serviceCollection.AddDataProtection();
        serviceCollection.AddTransient<IContactRepository, ContactRepository>();
        serviceCollection.AddTransient<IAliasRepository, AliasRepository>();
        serviceCollection.AddTransient<IBizRepository, BizRepository>();
        serviceCollection.AddTransient<IPersonLicApplicationRepository, PersonLicApplicationRepository>();
        serviceCollection.AddTransient<ILicAppRepository, LicAppRepository>();
        serviceCollection.AddTransient<IOrgRepository, OrgRepository>();
        serviceCollection.AddTransient<IPortalUserRepository, PortalUserRepository>();
        serviceCollection.AddTransient<IOptionSetRepository, OptionSetRepository>();
        serviceCollection.AddTransient<IAddressRepository, AddressRepository>();
        serviceCollection.AddTransient<ILicenceRepository, LicenceRepository>();
        serviceCollection.AddTransient<IBizLicApplicationRepository, BizLicApplicationRepository>();
        serviceCollection.AddTransient<IBizContactRepository, BizContactRepository>();
        serviceCollection.AddTransient<IApplicationRepository, ApplicationRepository>();
        serviceCollection.AddTransient<ITaskRepository, TaskRepository>();
        serviceCollection.AddTransient<IControllingMemberCrcRepository, ControllingMemberCrcRepository>();
        serviceCollection.ConfigureComponents(configuration, null, assemblies, loggerFactory);
        ServiceProvider = serviceCollection.BuildServiceProvider().CreateScope().ServiceProvider;
    }

    public IServiceProvider ServiceProvider { get; private set; }
}