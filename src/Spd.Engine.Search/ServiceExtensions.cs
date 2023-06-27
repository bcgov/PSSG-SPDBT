using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Engine.Search;
public class ServiceExtension : IConfigureComponentServices
{
    public void ConfigureServices(ConfigurationServices configurationServices)
    {
        configurationServices.Services.AddTransient<ISearchEngine, SearchEngine>();
    }
}
