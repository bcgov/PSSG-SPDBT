using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PortalUser;
using Spd.Utilities.Dynamics;
using System.Reflection;

namespace Spd.Resource.Repository.IntegrationTest;
public class IntegrationTestSetup
{
    public static readonly string DataPrefix = "spd_integration_";
    public IntegrationTestSetup()
    {
        string assembliesPrefix = "Spd";
        Assembly[] assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
         .Where(assembly =>
         {
             var assemblyName = Path.GetFileName(assembly);
             return !assemblyName.StartsWith("System.") && !assemblyName.StartsWith("Microsoft.") && (string.IsNullOrEmpty(assembliesPrefix) || assemblyName.StartsWith(assembliesPrefix));
         })
         .Select(assembly => Assembly.LoadFrom(assembly))
         .ToArray();

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

        serviceCollection.AddSingleton<IConfiguration>(configuration);
        serviceCollection.AddDynamicsProxy(configuration);
        serviceCollection.AddAutoMapper(assemblies);
        serviceCollection.AddDistributedMemoryCache();
        serviceCollection.AddTransient<IContactRepository, ContactRepository>();
        serviceCollection.AddTransient<IAliasRepository, AliasRepository>();
        serviceCollection.AddTransient<IBizRepository, BizRepository>();
        serviceCollection.AddTransient<IPersonLicApplicationRepository, PersonLicApplicationRepository>();
        serviceCollection.AddTransient<IOrgRepository, OrgRepository>();
        serviceCollection.AddTransient<IPortalUserRepository, PortalUserRepository>();
        serviceCollection.AddTransient<IOptionSetRepository, OptionSetRepository>();
        serviceCollection.AddTransient<IAddressRepository, AddressRepository>();
        serviceCollection.AddTransient<ILicenceRepository, LicenceRepository>();
        serviceCollection.AddTransient<IBizLicApplicationRepository, BizLicApplicationRepository>();
        serviceCollection.AddTransient<IBizContactRepository, BizContactRepository>();
        serviceCollection.AddTransient<IApplicationRepository, ApplicationRepository>();
        ServiceProvider = serviceCollection.BuildServiceProvider().CreateScope().ServiceProvider;
    }
    public IServiceProvider ServiceProvider { get; private set; }
}
