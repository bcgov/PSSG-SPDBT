namespace SPD.Api.ServiceExtensions
{
    public static class ServiceCorsExtension
    {
        public static void ConfigureCors(this IServiceCollection services,
            IConfiguration configuration,
            string allowedOriginsKey,
            string policyName)
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
