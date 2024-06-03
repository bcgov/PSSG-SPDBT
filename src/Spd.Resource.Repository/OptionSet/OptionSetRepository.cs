using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.PersonLicApplication;
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
        private IEnumerable<OptionData>? hairColorOptionData;

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
            else if (query is HairColourEnum)
            {
                optionData = hairColorOptionData;
                if (optionData == null) return null;
                o = Enum.Parse<HairColorOptionSet>(query.ToString());
            }
            else
                return null;

            return optionData.FirstOrDefault(s => s.Value == (int)o).Label;
        }

        private async Task InitCacheAsync()
        {
            sexOptionData = await _cache.Get<IEnumerable<OptionData>>("spd_sexOptionData");
            worksWithOptionData = await _cache.Get<IEnumerable<OptionData>>("spd_worksWithOptionData");
            hairColorOptionData = await _cache.Get<IEnumerable<OptionData>>("spd_hairColorOptionData");

            if (sexOptionData == null || worksWithOptionData == null || hairColorOptionData == null)
            {
                var optionsets = _dynaContext.GlobalOptionSetDefinitions.ToList();

                sexOptionData = GetOptionLabels(optionsets, "spd_sex");
                worksWithOptionData = GetOptionLabels(optionsets, "spd_organizationclientbase");
                hairColorOptionData = GetOptionLabels(optionsets, "spd_haircolour");
                await _cache.Set<IEnumerable<OptionData>>("spd_sexOptionData", sexOptionData, new TimeSpan(10, 0, 0));
                await _cache.Set<IEnumerable<OptionData>>("spd_worksWithOptionData", worksWithOptionData, new TimeSpan(10, 0, 0));
                await _cache.Set<IEnumerable<OptionData>>("spd_hairColorOptionData", hairColorOptionData, new TimeSpan(10, 0, 0));
            }
        }

        private IEnumerable<OptionData> GetOptionLabels(IEnumerable<OptionSetMetadataBase> optionsets, string optionsetName)
        {
            OptionSetMetadata? metadata = (OptionSetMetadata?)optionsets.FirstOrDefault(o => o.Name == optionsetName);
            if (metadata == null)
                throw new ApiException(HttpStatusCode.InternalServerError, $"cannot find definition for {optionsetName}");
            return metadata.Options
                .Select(o => new OptionData(o.Value, o.Label.UserLocalizedLabel.Label))
                .ToList();
        }

        public record OptionData(int? Value, string Label);
    }
}
