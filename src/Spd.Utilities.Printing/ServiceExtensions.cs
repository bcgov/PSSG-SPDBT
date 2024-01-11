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
        services.Configure<BCMailPlusSettings>(opts => configuration.GetSection("BCMailPlus").Bind(opts));
        services.AddTransient<IBcMailPlusApi, BcMailPlusApi>();
        services.AddTransient<IPrinter, Printer>();
        return services;
    }
}

internal sealed class BCMailPlusSettings
{
    public Uri ServerUrl { get; set; } = null!;
    public string User { get; set; } = null!;
    public string Secret { get; set; } = null!;
}