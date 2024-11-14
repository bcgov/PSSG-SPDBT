using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Hosting;

namespace Spd.Engine.Validation;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        configurationServices.Services.AddTransient<IDuplicateCheckEngine, DuplicateCheckEngine>();
    }
}