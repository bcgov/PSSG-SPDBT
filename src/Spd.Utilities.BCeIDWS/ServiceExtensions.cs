using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ServiceReference;
using System.ServiceModel;

namespace Spd.Utilities.BCeIDWS
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddBCeIDService(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("BCeIDWebService").Get<BCeIDSettings>()!;

            services.Configure<BCeIDSettings>(opts => configuration.GetSection("BCeIDWebService").Bind(opts));

            services.AddSingleton<BCeIDServiceSoap>(sp =>
            {
                var options = sp.GetRequiredService<IOptions<BCeIDSettings>>().Value;
                var client = new BCeIDServiceSoapClient(new BasicHttpBinding()
                {
                    Security = new BasicHttpSecurity
                    {
                        Transport = new HttpTransportSecurity { ClientCredentialType = HttpClientCredentialType.Basic },
                        Mode = BasicHttpSecurityMode.Transport
                    }
                },
                new EndpointAddress(options.Url));

                client.ClientCredentials.UserName.UserName = options.ServiceAccountUser;
                client.ClientCredentials.UserName.Password = options.ServiceAccountPassword;

                return client;
            });
            services.AddTransient<IBCeIDService, BCeIDService>();
            return services;
        }
    }
}