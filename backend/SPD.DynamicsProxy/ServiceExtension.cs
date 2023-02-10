using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OData.Extensions.Client;

namespace SPD.DynamicsProxy
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddDynamicsProxy(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("Dynamics").Get<DynamicsSettings>()!;

            services.Configure<DynamicsSettings>(opts => configuration.GetSection("Dynamics").Bind(opts));

            services
                .AddHttpClient("oauth")
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
               ;

            services.AddSingleton<ISecurityTokenProvider, OauthSecurityTokenProvider>();

            services
                .AddODataClient("dynamics")
                .AddODataClientHandler<ODataClientHandler>()
                .AddHttpClient()
                .ConfigureHttpClient(c => c.Timeout = options.HttpClientTimeout)
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
                ;

            services.AddSingleton<IDynamicsContextFactory, DynamicsContextFactory>();

            return services;
        }
    }
}