using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Infrastructure.Common
{
    public record ServicesConfigurationContext
    {
        public ServicesConfigurationContext(IServiceCollection services, IConfiguration configuration)
        {
            Services = services;
            Configuration = configuration;
        }
        public IServiceCollection Services { get; set; }

        public IConfiguration Configuration { get; set; }
    }

    public interface IConfigureServices
    {
        void Configure(ServicesConfigurationContext context);
    }
}
