using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Config
{
    internal class ConfigRepository(IDynamicsContextFactory ctx, IMapper _mapper) : IConfigRepository
    {
        private readonly DynamicsContext _dynaContext = ctx.Create();

        public async Task<ConfigResult> Query(ConfigQuery query, CancellationToken ct)
        {
            var bcgov_configs = _dynaContext.bcgov_configs.Where(c => c.statecode != DynamicsConstants.StateCode_Inactive);

            if (query.Key != null) bcgov_configs = bcgov_configs.Where(c => c.bcgov_key == query.Key);
            if (query.Group != null) bcgov_configs = bcgov_configs.Where(c => c.bcgov_group == query.Group);

            return new ConfigResult(_mapper.Map<IEnumerable<ConfigItem>>(await bcgov_configs.GetAllPagesAsync(ct)));
        }
    }
}