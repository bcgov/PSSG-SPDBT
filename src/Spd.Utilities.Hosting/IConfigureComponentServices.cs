using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Spd.Utilities.Hosting;

public record ConfigurationServices(IServiceCollection Services, IConfiguration Configuration, IHostEnvironment Environment);

public interface IConfigureComponentServices
{
    void ConfigureServices(ConfigurationServices configurationServices);
}