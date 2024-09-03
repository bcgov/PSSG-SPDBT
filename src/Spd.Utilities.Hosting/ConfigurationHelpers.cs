using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Reflection;

namespace Spd.Utilities.Hosting
{
    public static class ConfigurationHelpers
    {
        public static void ConfigureComponentServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment, params Assembly[] assemblies)
        {
            var configServices = new ConfigurationServices(services, configuration, environment);

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