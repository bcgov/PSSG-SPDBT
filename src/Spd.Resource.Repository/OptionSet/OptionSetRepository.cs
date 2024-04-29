using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Cache;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.OptionSet
{
    internal class OptionSetRepository : IOptionSetRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IDistributedCache _cache;
        private IEnumerable<OptionData>? sexOptionData;
        private IEnumerable<OptionData>? worksWithOptionData;

        public OptionSetRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache, ILogger<OptionSetRepository> logger)
        {
            _dynaContext = ctx.Create();
            _cache = cache;
        }

        public async Task<string?> GetLabelAsync<T>(T query, CancellationToken ct)
            where T : struct, Enum
        {
            await InitCacheAsync();
            IEnumerable<OptionData>? optionData = null;
            object o;
            if (query is GenderEnum)
            {
                optionData = sexOptionData;
                if (optionData == null) return null;
                o = Enum.Parse<GenderOptionSet>(query.ToString());
            }
            else if (query is EmployeeInteractionTypeCode)
            {
                optionData = worksWithOptionData;
                if (optionData == null) return null;
                o = Enum.Parse<WorksWithChildrenOptionSet>(query.ToString());
            }
            else
                return null;

            return optionData.FirstOrDefault(s => s.Value == (int)o).Label;
        }

        private async Task InitCacheAsync()
        {
            sexOptionData = await _cache.Get<IEnumerable<OptionData>>("spd_sexOptionData");

            worksWithOptionData = await _cache.Get<IEnumerable<OptionData>>("spd_worksWithOptionData");

            if (sexOptionData == null || worksWithOptionData == null)
            {
                var optionsets = _dynaContext.GlobalOptionSetDefinitions.ToList();
                OptionSetMetadata? sexOptionSet = (OptionSetMetadata?)optionsets.FirstOrDefault(o => o.Name == "spd_sex");
                if (sexOptionSet == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "cannot find definition for spd_sex");
                sexOptionData = sexOptionSet.Options
                    .Select(o => new OptionData(o.Value, o.Label.UserLocalizedLabel.Label))
                    .ToList();

                OptionSetMetadata? worksWithOptionSet = (OptionSetMetadata?)optionsets.FirstOrDefault(o => o.Name == "spd_organizationclientbase");
                if (worksWithOptionSet == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "cannot find definition for spd_organizationclientbase");
                worksWithOptionData = worksWithOptionSet.Options
                    .Select(o => new OptionData(o.Value, o.Label.UserLocalizedLabel.Label))
                    .ToList();

                await _cache.Set<IEnumerable<OptionData>>("spd_sexOptionData", sexOptionData, new TimeSpan(10, 0, 0));
                await _cache.Set<IEnumerable<OptionData>>("spd_worksWithOptionData", worksWithOptionData, new TimeSpan(10, 0, 0));
            }
        }

        public record OptionData(int? Value, string Label);
    }
}
