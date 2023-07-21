using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Configuration;

namespace Spd.Utilities.Address
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddAddressAutoComplete(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("addressAutoCompleteClient").Get<AddressAutoCompleteClientConfigurations>();

            if (options == null || string.IsNullOrWhiteSpace(options.Url))
                throw new ConfigurationErrorsException("AddressAutoCompleteConfiguration is not correct.");

            services.Configure<AddressAutoCompleteClientConfigurations>(opts => configuration.GetSection("AddressAutoCompleteClient").Bind(opts));

            services.AddHttpClient<IAddressAutocompleteClient, AddressAutocompleteClient>(client 
                => client.BaseAddress = new Uri(options.Url));

            return services;
        }
    }
}