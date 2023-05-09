using Microsoft.Extensions.DependencyInjection;

namespace Spd.Utilities.TempFileStorage
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddTempFileStorageService(this IServiceCollection services)
        {
            services.AddTransient<ITempFileStorageService, TempFileStorageService>();
            return services;
        }
    }
}