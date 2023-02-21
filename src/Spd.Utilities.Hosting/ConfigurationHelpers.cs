using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;

namespace Spd.Utilities.Hosting
{
    public static class ConfigurationHelpers
    {
        public static void ConfigureComponentServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment, params Assembly[] assemblies)
        {
            var configServices = new ConfigurationServices
            {
                Services = services,
                Configuration = configuration,
                Environment = environment
            };

            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IConfigureComponentServices>();
                foreach (var config in configurations)
                {
                    config.ConfigureServices(configServices);
                }
            }
        }

        public static void ConfigureComponentPipeline(this IApplicationBuilder app, IConfiguration configuration, IHostEnvironment environment, params Assembly[] assemblies)
        {
            var pipelineServices = new PipelineServices
            {
                Application = app,
                Configuration = configuration,
                Environment = environment,
            };
            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IConfigureComponentPipeline>();
                foreach (var config in configurations)
                {
                    config.ConfigurePipeline(pipelineServices);
                }
            }
        }

    }
}