using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.LicenceFee;

internal class LicenceFeeRepository : ILicenceFeeRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicenceFeeRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<LicenceFeeListResp> QueryAsync(LicenceFeeQry qry, CancellationToken cancellationToken)
    {
        IQueryable<spd_licencefee> feeResult = _context.spd_licencefees.Expand(a => a.spd_ServiceTypeId);

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

        return new LicenceFeeListResp
        {
            LicenceFees = _mapper.Map<IEnumerable<LicenceFeeResp>>(feeResult)
        };
    }
}