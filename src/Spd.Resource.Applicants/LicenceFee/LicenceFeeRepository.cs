using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.LicenceFee;
internal class LicenceFeeRepository : ILicenceFeeRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicenceFeeRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }



    public async Task<LicenceFeeListResp> GetLicenceFeeAsync(WorkerLicenceTypeEnum workerLicenceTypeCode, CancellationToken cancellationToken)
    {
        DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(workerLicenceTypeCode.ToString(), out Guid stGuid);

        IQueryable<spd_licencefee> fees = _context.spd_licencefees.Expand(a => a.spd_ServiceTypeId)
            .Where(d => d._spd_servicetypeid_value == stGuid && d.statecode != DynamicsConstants.StateCode_Inactive);

        var result = fees.ToList();
        var list = _mapper.Map<IEnumerable<LicenceFeeResp>>(result);

        var response = new LicenceFeeListResp();
        response.LicenceFees = list;
        return response;
    }
}
