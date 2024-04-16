using Microsoft.Extensions.DependencyInjection;
using Spd.Engines.Transformation.Documents;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Repository;

public class ServiceExtension : IConfigureComponentServices
{
    public void ConfigureServices(ConfigurationServices configurationServices)
    {
        configurationServices.Services.AddScoped<IDocumentTransformationEngine, DocumentTransformationEngine>();
        configurationServices.Services.AddScoped<IDocumentTransformStrategy, FingerPrintLetterTransformStrategy>();
    }
}
