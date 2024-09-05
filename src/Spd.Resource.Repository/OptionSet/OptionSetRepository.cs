using System.Net;
using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.OptionSet
{
    internal class OptionSetRepository : IOptionSetRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IDistributedCache _cache;

        public OptionSetRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache, ILogger<OptionSetRepository> logger)
        {
            _dynaContext = ctx.Create();
            _cache = cache;
        }

        public async Task<string?> GetLabelAsync<T>(T query, CancellationToken ct)
            where T : struct, Enum
        {
            var optionsets = await _cache.GetAsync(
                "optionsets",
                async ct => (await _dynaContext.GlobalOptionSetDefinitions.GetAllPagesAsync(ct))
                    .Where(os => os is OptionSetMetadata)
                    .Cast<OptionSetMetadata>()
                    .ToDictionary(os => os.Name, os => os.Options.Select(o => new OptionData(o.Value, o.Label.UserLocalizedLabel.Label)).ToList()),
                TimeSpan.FromMinutes(60),
                ct) ?? [];
            (List<OptionData> optionData, int option) = query switch
            {
                Gender q => (GetOptionLabels(optionsets, "spd_sex"), (int)Enum.Parse<GenderOptionSet>(q.ToString())),
                EmployeeInteractionTypeCode q => (GetOptionLabels(optionsets, "spd_organizationclientbase"), (int)Enum.Parse<WorksWithChildrenOptionSet>(q.ToString())),
                HairColour q => (GetOptionLabels(optionsets, "spd_haircolour"), (int)Enum.Parse<HairColorOptionSet>(q.ToString())),

                _ => throw new NotImplementedException($"{nameof(GetLabelAsync)} does not handle {typeof(T).Name}")
            };

            return optionData.Find(s => s.Value == option)?.Label;
        }

        private static List<OptionData> GetOptionLabels(Dictionary<string, List<OptionData>> optionsets, string optionsetName)
            => optionsets.GetValueOrDefault(optionsetName) ?? throw new ApiException(HttpStatusCode.InternalServerError, $"cannot find definition for {optionsetName}");

        public record OptionData(int? Value, string Label);
    }
}