using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace Spd.Infrastructure.Common
{
    public record ApplicationConfigurationContext
    {
        public ApplicationConfigurationContext(IServiceProvider services, IConfiguration configuration, IApplicationBuilder application)
        {
            Services = services;
            Configuration = configuration;
            Application = application;
        }
        public IServiceProvider Services { get; set; }

        public IConfiguration Configuration { get; set; }
        public IApplicationBuilder Application { get; set; }
    }

    public interface IConfigureApplication
    {
        void Configure(ApplicationConfigurationContext context);
    }
}
