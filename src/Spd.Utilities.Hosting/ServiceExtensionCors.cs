using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.Hosting
{
    public static class ServiceExtensionCors
    {
        private const string policyName = "AllowSpecificOrigins";
        private const string allowedOriginsKey = "AllowedOrigins";
        public static void ConfigureCors(this IServiceCollection services,
            IConfiguration configuration)
        {
            string[] allowedOrigins = configuration[allowedOriginsKey]?.Split(";");

            if (allowedOrigins != null)
            {
                services.AddCors(x =>
                {
                    x.AddPolicy(policyName,
                                builder =>
                                {
                                    builder
                                        .WithOrigins(allowedOrigins)
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                                });
                });
            }
        }
    }
}
