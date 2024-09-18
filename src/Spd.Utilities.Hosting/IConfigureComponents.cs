using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Spd.Utilities.Hosting;

public record ConfigurationContext(IServiceCollection Services, IConfiguration Configuration, IWebHostEnvironment Environment, ILogger logger);

public interface IConfigureComponents
{
    void Configure(ConfigurationContext configurationServices);
}