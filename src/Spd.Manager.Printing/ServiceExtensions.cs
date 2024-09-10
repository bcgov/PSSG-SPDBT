using Microsoft.Extensions.DependencyInjection;
using Spd.Manager.Printing.Documents;
using Spd.Manager.Printing.Documents.TransformationStrategies;
using Spd.Utilities.Hosting;

namespace Spd.Manager.Printing
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IPrintingManager, PrintingManager>();
            configurationServices.Services.AddScoped<IDocumentTransformationEngine, DocumentTransformationEngine>();
            configurationServices.Services.AddScoped<IDocumentTransformStrategy, FingerprintLetterTransformStrategy>();
            configurationServices.Services.AddScoped<IDocumentTransformStrategy, PersonalLicencePreviewTransformStrategy>();
            configurationServices.Services.AddScoped<IDocumentTransformStrategy, PersonalLicencePrintingTransformStrategy>();
        }
    }
}
