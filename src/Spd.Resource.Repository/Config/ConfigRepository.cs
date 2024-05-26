using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Cache;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Config
{
    internal class ConfigRepository : IConfigRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;

        public ConfigRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ConfigRepository> logger, IDistributedCache cache)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ConfigResult> Query(ConfigQuery query, CancellationToken ct)
        {
            IEnumerable<bcgov_config>? bcgov_configs = await _cache.Get<IEnumerable<bcgov_config>>("bcgov_config");
            if (bcgov_configs == null)
            {
                bcgov_configs = _dynaContext.bcgov_configs.Where(c => c.statecode != DynamicsConstants.StateCode_Inactive).ToList();
                await _cache.Set<IEnumerable<bcgov_config>>("bcgov_config", bcgov_configs, new TimeSpan(1, 0, 0));
            }
            if (query.Key != null)
                bcgov_configs = bcgov_configs.Where(c => c.bcgov_key == query.Key);
            if (query.Group != null)
                bcgov_configs = bcgov_configs.Where(c => c.bcgov_group == query.Group);
            return new ConfigResult(_mapper.Map<IEnumerable<ConfigItem>>(bcgov_configs.ToList()));
        }
    }
}
