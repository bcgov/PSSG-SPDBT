using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.LicApp;
internal class LicAppRepository : ILicAppRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicAppRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }


    public async Task<IEnumerable<LicenceAppListResp>> QueryAsync(LicenceAppQuery qry, CancellationToken cancellationToken)
    {
        IQueryable<spd_application> apps = _context.spd_applications.Expand(a => a.spd_ServiceTypeId);
        apps = apps.Where(a => a._spd_applicantid_value == qry.ApplicantId);
        var applist = apps.ToList();

        if (qry.ValidWorkerLicenceTypeCodes != null && qry.ValidWorkerLicenceTypeCodes.Any())
        {
            List<Guid?> serviceTypeGuid = qry.ValidWorkerLicenceTypeCodes.Select(c => _context.LookupServiceType(c.ToString()).spd_servicetypeid).ToList();
            applist = applist.Where(a => serviceTypeGuid.Contains(a._spd_servicetypeid_value)).ToList();
        }

        if (qry.ValidPortalStatus != null && qry.ValidPortalStatus.Any())
        {
            List<int> portalStatusInt = qry.ValidPortalStatus.Select(s => (int)Enum.Parse<ApplicationPortalStatus>(s.ToString())).ToList();
            applist = applist.Where(a => portalStatusInt.Contains((int)a.spd_portalstatus)).ToList();
        }
        return _mapper.Map<IList<LicenceAppListResp>>(applist.OrderByDescending(o => o.createdon));

    }
}
