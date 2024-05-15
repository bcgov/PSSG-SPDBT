using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Cache;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.LicenceFee;
internal class LicenceFeeRepository : ILicenceFeeRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;

    public LicenceFeeRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _cache = cache;
    }

    public async Task<LicenceFeeListResp> QueryAsync(LicenceFeeQry qry, CancellationToken cancellationToken)
    {
        IEnumerable<spd_licencefee>? feeResult = await _cache.Get<IEnumerable<spd_licencefee>>("spd_licencefee");
        if (feeResult == null)
        {
            feeResult = _context.spd_licencefees.Expand(a => a.spd_ServiceTypeId).ToList();
            await _cache.Set<IEnumerable<spd_licencefee>>("spd_licencefee", feeResult, new TimeSpan(1, 0, 0));
        }

        if (!qry.IncludeInactive)
            feeResult = feeResult.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.WorkerLicenceTypeEnum != null)
        {
            DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(qry.WorkerLicenceTypeEnum.ToString(), out Guid stGuid);
            feeResult = feeResult.Where(f => f._spd_servicetypeid_value == stGuid);
        }

        if (qry.LicenceTermEnum != null)
        {
            int term = (int)Enum.Parse<LicenceTermOptionSet>(qry.LicenceTermEnum.ToString());
            feeResult = feeResult.Where(f => f.spd_term == term);
        }

        if (qry.ApplicationTypeEnum != null)
        {
            int type = (int)Enum.Parse<LicenceApplicationTypeOptionSet>(qry.ApplicationTypeEnum.ToString());
            feeResult = feeResult.Where(f => f.spd_type == type);
        }

        if (qry.BizTypeEnum != null)
        {
            int bizType = (int)Enum.Parse<BizTypeOptionSet>(qry.BizTypeEnum.ToString());
            feeResult = feeResult.Where(f => f.spd_businesstype == bizType);
        }

        if (qry.HasValidSwl90DayLicence != null)
        {
            int hasValidSwl90Day = (int)SharedMappingFuncs.GetYesNo(qry.HasValidSwl90DayLicence);
            feeResult = feeResult.Where(f => f.spd_hasvalidswl90daylicence == hasValidSwl90Day);
        }
        var list = _mapper.Map<IEnumerable<LicenceFeeResp>>(feeResult);
        var response = new LicenceFeeListResp();
        response.LicenceFees = list;
        return response;
    }
}
