using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.BCeIDWS.IntegrationTest;
public class IntegrationTestSetup
{
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
        serviceCollection.AddBCeIDService(configuration);
        ServiceProvider = serviceCollection.BuildServiceProvider();
    }
    public IServiceProvider ServiceProvider { get; private set; }
}
