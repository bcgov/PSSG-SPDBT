using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.FileStorage;

namespace Spd.Tests.Integration;

public class IntegrationTestSetup
{
    public static readonly string DataPrefix = "spd_integration_";
    public static readonly string Folder = "spd_integration_test";

    public IntegrationTestSetup()
    {
        var serviceCollection = new ServiceCollection();

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddUserSecrets<IntegrationTestSetup>()
            .AddEnvironmentVariables()
            .Build();

        serviceCollection.AddSingleton<IConfiguration>(configuration);
        serviceCollection.AddLogging();
        serviceCollection.AddFileStorageProxy(configuration);
        serviceCollection.AddBCeIDService(configuration);
        ServiceProvider = serviceCollection.BuildServiceProvider();
    }

    public IServiceProvider ServiceProvider { get; private set; }
}