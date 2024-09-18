using MartinCostello.Logging.XUnit;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Hosting;
using Xunit.Abstractions;

namespace Spd.Tests.Integration;

public class IntegrationTestFixture : IAsyncLifetime, ITestOutputHelperAccessor
{
    public static readonly string DataPrefix = "spd_integration_";
    public static readonly string Folder = "spd_integration_test";

    private WebApplication? webApp;
    private IServiceScope? serviceScope;
    private ILoggerFactory? loggerFactory;

    public IServiceProvider ServiceProvider => serviceScope!.ServiceProvider;

    public ITestOutputHelper? OutputHelper { get; set; }

    public async Task DisposeAsync()
    {
        if (serviceScope != null) serviceScope.Dispose();
        if (loggerFactory != null) loggerFactory.Dispose();
        if (webApp != null) await webApp.DisposeAsync();
    }

    public async Task InitializeAsync()
    {
        await Task.CompletedTask;

        var builder = WebApplication.CreateBuilder();
        var assemblies = ReflectionExtensions.DiscoverLocalAessemblies(prefix: "Spd.");
#pragma warning disable CA2000 // Dispose objects before losing scope
        loggerFactory = LoggerFactory.Create(builder => builder.AddXUnit(this));
#pragma warning restore CA2000 // Dispose objects before losing scope

        builder.Configuration
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddUserSecrets<IntegrationTestFixture>()
            .AddEnvironmentVariables();

        builder.Logging.AddXUnit(this);
#pragma warning disable ASP0012 // Suggest using builder.Services over Host.ConfigureServices or WebHost.ConfigureServices
        builder.WebHost.ConfigureServices((ctx, services) =>
        {
            services.AddDistributedMemoryCache();

            services.ConfigureComponents(ctx.Configuration, ctx.HostingEnvironment, assemblies, loggerFactory);
        });
#pragma warning restore ASP0012 // Suggest using builder.Services over Host.ConfigureServices or WebHost.ConfigureServices

        webApp = builder.Build();

        serviceScope = webApp.Services.CreateScope();
    }
}