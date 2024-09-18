using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using System.Reflection;

namespace Spd.Utilities.Hosting;

public static class ConfigurationHelpers
{
    public static void ConfigureComponents(this WebApplicationBuilder webApplicationBuilder, IEnumerable<Assembly> discoveryAssemblies, Serilog.ILogger logger)
    {
#pragma warning disable CA2000 // Dispose objects before losing scope
        using var loggerFactory = new LoggerFactory().AddSerilog(logger);
#pragma warning restore CA2000 // Dispose objects before losing scope
        ConfigureComponents(webApplicationBuilder, discoveryAssemblies, loggerFactory);
    }

    public static void ConfigureComponents(this WebApplicationBuilder webApplicationBuilder, IEnumerable<Assembly> discoveryAssemblies, ILoggerFactory loggerFactory)
    {
        ConfigureComponents(webApplicationBuilder.Services, webApplicationBuilder.Configuration, webApplicationBuilder.Environment, discoveryAssemblies, loggerFactory);
    }

    public static void ConfigureComponents(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment, IEnumerable<Assembly> discoveryAssemblies, ILoggerFactory loggerFactory)
    {
        foreach (var config in discoveryAssemblies.SelectMany(a => a.CreateInstancesOf<IConfigureComponents>()))
        {
            var configurationContext = new ConfigurationContext(services, configuration, environment, loggerFactory.CreateLogger(config.GetType()));
            config.Configure(configurationContext);
        }
    }
}