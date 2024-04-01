using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Spd.Utilities.FileStorage.IntegrationTest;
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

        //serviceCollection.AddDistributedMemoryCache();
        serviceCollection.AddFileStorageProxy(configuration);
        ServiceProvider = serviceCollection.BuildServiceProvider();
    }
    public IServiceProvider ServiceProvider { get; private set; }
}
