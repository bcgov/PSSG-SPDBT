using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;
using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Utilities.Printing;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        var configuration = configurationServices.Configuration;
        var services = configurationServices.Services;

        services.AddOptions<BCMailPlusSettings>().Bind(configuration.GetSection("BCMailPlus")).ValidateDataAnnotations();
        services.AddTransient<IBcMailPlusApi, BcMailPlusApi>();
        services.AddTransient<IPrinter, Printer>();
    }
}