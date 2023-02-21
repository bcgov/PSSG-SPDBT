using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Spd.Utilities.Hosting
{
    public class ConfigurationServices
    {
        public IServiceCollection Services { get; set; } = null!;
        public IConfiguration Configuration { get; set; } = null!;
        public IHostEnvironment Environment { get; set; } = null!;
    }

    public interface IConfigureComponentServices
    {
        void ConfigureServices(ConfigurationServices configurationServices);
    }
}
