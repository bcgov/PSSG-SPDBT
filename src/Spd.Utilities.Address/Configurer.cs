using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;
using System.Configuration;

namespace Spd.Utilities.Address;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        var configuration = configurationServices.Configuration;
        var services = configurationServices.Services;

        var options = configuration.GetSection("addressAutoCompleteClient").Get<AddressAutoCompleteClientConfigurations>();

        if (options == null || string.IsNullOrWhiteSpace(options.Url))
            throw new ConfigurationErrorsException("AddressAutoCompleteConfiguration is not correct.");

        services.Configure<AddressAutoCompleteClientConfigurations>(opts => configuration.GetSection("AddressAutoCompleteClient").Bind(opts));

        services.AddHttpClient<IAddressAutocompleteClient, AddressAutocompleteClient>(client
            => client.BaseAddress = new Uri(options.Url));
    }
}