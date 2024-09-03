using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Utilities.Printing;

/// <summary>
/// Configuration helper for printing utilities
/// </summary>
public static class ServiceExtensions
{
    /// <summary>
    /// Adds printing services to DI
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <param name="configuration">The service configuration</param>
    /// <returns></returns>
    public static IServiceCollection AddPrinting(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<BCMailPlusSettings>().Bind(configuration.GetSection("BCMailPlus")).ValidateDataAnnotations();
        services.AddTransient<IBcMailPlusApi, BcMailPlusApi>();
        services.AddTransient<IPrinter, Printer>();
        return services;
    }
}