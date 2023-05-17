using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;

namespace Spd.Resource.Organizations.Config
{
    internal class ConfigRepository : IConfigRepository
    {
        private readonly DynamicsContext _dynaContext;

        public ConfigRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ConfigRepository> logger)
        {
            _dynaContext = ctx.Create();
        }

        public async Task<ConfigResult?> Query(ConfigQuery query, CancellationToken ct)
        {
            var config = await _dynaContext.bcgov_configs.Where(c => c.bcgov_key == SpdConstants.BANNER_MSG_CONFIG_KEY).FirstOrDefaultAsync(ct);
            if (config == null)
            {
                return new ConfigResult(SpdConstants.DEFAULT_BANNER_MSG);
            }
            return new ConfigResult(config.bcgov_value);
        }
    }
}
