using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.Hosting
{
    public static class ServiceExtensionDataProtection
    {
        public static void ConfigureDataProtection(this IServiceCollection services,
            IConfiguration configuration, string appName)
        {
            var dataProtectionPath = configuration.GetValue("KEY_RING_PATH", string.Empty);
            var dpBuilder = services.AddDataProtection()
                    .SetApplicationName(appName);

            if (!string.IsNullOrEmpty(dataProtectionPath)) dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath));
        }
    }
}
