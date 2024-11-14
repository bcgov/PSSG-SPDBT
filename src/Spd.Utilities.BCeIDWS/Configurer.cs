using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ServiceReference;
using Spd.Utilities.Hosting;
using System.ServiceModel;

namespace Spd.Utilities.BCeIDWS;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        var configuration = configurationServices.Configuration;
        var services = configurationServices.Services;

        services.AddOptions<BCeIDSettings>().Bind(configuration.GetSection("BCeIDWebService"));

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
    }
}