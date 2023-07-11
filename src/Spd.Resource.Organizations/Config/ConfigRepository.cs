using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Config
{
    internal class ConfigRepository : IConfigRepository
    {
        private readonly DynamicsContext _dynaContext;

        public ConfigRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ConfigRepository> logger)
        {
            _dynaContext = ctx.Create();
        }

        public async Task<ConfigResult> Query(ConfigQuery query, CancellationToken ct)
        {
            IQueryable<bcgov_config> configs = _dynaContext.bcgov_configs.Where(c => c.bcgov_key == query.Key);

            if (query.Group != null)
                configs = configs.Where(c => c.bcgov_group == query.Group);

            var config = await configs.FirstOrDefaultAsync(ct);
            if (config == null)
            {
                throw new ArgumentException("the Key does not have value in system config");
            }
            return new ConfigResult(config.bcgov_value);
        }
    }
}
