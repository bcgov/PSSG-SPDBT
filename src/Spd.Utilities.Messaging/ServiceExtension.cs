using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.Messaging.Contract;
using Spd.Utilities.Messaging.InMemory;

namespace Spd.Utilities.Messaging
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddInMemoryBus(this IServiceCollection services)
        {
            Discovery.RegisterInternalHandlers();
            services.AddTransient<IBus, InMemoryBus>();

            return services;
        }
    }
}
