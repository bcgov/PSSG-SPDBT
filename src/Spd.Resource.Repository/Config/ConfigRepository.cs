using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Config
{
    internal class ConfigRepository : IConfigRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;

        public ConfigRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ConfigRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
        }

        public async Task<ConfigResult> Query(ConfigQuery query, CancellationToken ct)
        {
            IQueryable<bcgov_config> configs = _dynaContext.bcgov_configs.Where(c => c.statecode != DynamicsConstants.StateCode_Inactive);

            if (query.Key != null)
                configs = configs.Where(c => c.bcgov_key == query.Key);
            if (query.Group != null)
                configs = configs.Where(c => c.bcgov_group == query.Group);
            var result = await configs.GetAllPagesAsync(ct);

            return new ConfigResult(_mapper.Map<IEnumerable<ConfigItem>>(result.ToList()));
        }
    }
}
