using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using nClam;
using Spd.Utilities.Hosting;

namespace Spd.Utilities.FileScanning;

public class Configurer : IConfigureComponents
{
    public void Configure(ConfigurationContext configurationServices)
    {
        var settings = configurationServices.Configuration.GetSection("FileScanning").Get<FileScanningSettings>();

        if (settings?.ClamAvUrl != null)
        {
            configurationServices.logger.LogInformation("File scanning is configured to use ClamAv at {Url}", settings.ClamAvUrl);
            configurationServices.Services.AddSingleton<IClamClient>(_ =>
            {
                return new ClamClient(settings.ClamAvUrl.Host, settings.ClamAvUrl.Port)
                {
                    MaxStreamSize = settings.MaxFileSize
                };
            });
            configurationServices.Services.AddTransient<IFileScanProvider, ClamAvScanner>();
        }
        else
        {
            configurationServices.logger.LogWarning("File scanning is not configured");
            configurationServices.Services.AddTransient<IFileScanProvider, NoOpScanner>();
        }
    }
}

public record FileScanningSettings
{
    public Uri? ClamAvUrl { get; set; }
    public long MaxFileSize { get; set; } = 100_000_000;
}