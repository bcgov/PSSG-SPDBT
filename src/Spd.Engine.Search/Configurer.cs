using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Engine.Search;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        configurationServices.Services.AddTransient<ISearchEngine, SearchEngine>();
    }
}