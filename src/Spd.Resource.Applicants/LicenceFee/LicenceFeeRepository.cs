using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.LicenceFee;
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
        IQueryable<spd_licencefee> fees = _context.spd_licencefees.Expand(a => a.spd_ServiceTypeId);

        if (!qry.IncludeInactive)
            fees = fees.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.WorkerLicenceTypeEnum != null)
        {
            DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(qry.WorkerLicenceTypeEnum.ToString(), out Guid stGuid);
            fees = fees.Where(f => f._spd_servicetypeid_value == stGuid);
        }

        if (qry.LicenceTermEnum != null)
        {
            int term = (int)Enum.Parse<LicenceTermOptionSet>(qry.LicenceTermEnum.ToString());
            fees = fees.Where(f => f.spd_term == term);
        }

        if (qry.ApplicationTypeEnum != null)
        {
            int type = (int)Enum.Parse<LicenceApplicationTypeOptionSet>(qry.ApplicationTypeEnum.ToString());
            fees = fees.Where(f => f.spd_type == type);
        }
        var list = _mapper.Map<IEnumerable<LicenceFeeResp>>(fees);
        var response = new LicenceFeeListResp();
        response.LicenceFees = list;
        return response;
    }
}
