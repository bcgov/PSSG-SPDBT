using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spd.Infrastructure.Common
{
    public record AppExecutionContext
    {
        //private readonly Lazy<ILog> log;
        private readonly Lazy<IConfiguration> configuration;

        public AppExecutionContext(string name, IServiceProvider services, CancellationToken ct)
        {
            Name = name;
            Services = services;
            CancellationToken = ct;
            CorrelationId = Guid.NewGuid();

            //log = new Lazy<ILog>(() =>
            //    Services.GetRequiredService<ILogFactory>().Create(new Dictionary<string, object>
            //    {
            //        { "Name", Name },
            //        { "CorrelationId", CorrelationId },
            //    }),
            //    true);
            configuration = new Lazy<IConfiguration>(() => Services.GetRequiredService<IConfiguration>(), true);
        }

        public Guid CorrelationId { get; set; }
        public string Name { get; }
        public IServiceProvider Services { get; }
        public CancellationToken CancellationToken { get; }
        public IConfiguration Configuration => configuration.Value;
        // public ILog Log => log.Value;

        public static AppExecutionContext Current => AppExecutionContextHelper.Current;
    }
}