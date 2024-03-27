using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Contact;
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
        string path = Directory.GetCurrentDirectory();
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(
                 path: "appsettings.json",
                 optional: false,
                reloadOnChange: true)
           .Build();
        serviceCollection.AddSingleton<IConfiguration>(configuration);
        serviceCollection.AddDynamicsProxy(configuration);
        serviceCollection.AddAutoMapper(assemblies);
        serviceCollection.AddDistributedMemoryCache();
        serviceCollection.AddTransient<IContactRepository, ContactRepository>();
        ServiceProvider = serviceCollection.BuildServiceProvider();
    }
    public ServiceProvider ServiceProvider { get; private set; }
}
