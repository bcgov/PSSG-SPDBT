using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

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

    //for unauth, set applcation status to submitted.
    public async Task<LicenceApplicationCmdResp> CommitLicenceApplicationAsync(Guid applicationId, ApplicationStatusEnum status, decimal? price, CancellationToken ct, LicenceTermEnum? term = null)
    {
        spd_application? app = await _context.GetApplicationById(applicationId, ct);
        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid ApplicationId");

        app.statuscode = (int)Enum.Parse<ApplicationStatusOptionSet>(status.ToString());

        if (status == ApplicationStatusEnum.Submitted)
            app.statecode = DynamicsConstants.StateCode_Inactive;

        app.spd_submittedon = DateTimeOffset.Now;
        app.spd_portalmodifiedon = DateTimeOffset.Now;

        if (price != null && price >= 0)
            app.spd_licencefee = price;

        if (term != null) //spdbt-3194
        {
            int? bizLicAppTerm = (int?)SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(term);
            if (bizLicAppTerm > app.spd_licenceterm)
                app.spd_licenceterm = bizLicAppTerm;
        }
        _context.UpdateObject(app);
        await _context.SaveChangesAsync(ct);

        // For business application, return organization id, for all others, return applicant id
        if (app._spd_organizationid_value != null)
            return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, null, (Guid)app._spd_organizationid_value);
        else
            return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, (Guid)app._spd_applicantid_value, null);
    }

    public async Task<IEnumerable<LicenceAppListResp>> QueryAsync(LicenceAppQuery qry, CancellationToken cancellationToken)
    {
        IQueryable<spd_application> apps = _context.spd_applications.Expand(a => a.spd_ServiceTypeId);
        if (qry.ApplicantId != null)
        {
            apps = apps.Where(a => a._spd_applicantid_value == qry.ApplicantId);
        }
        if ((qry.BizId != null))
        {
            apps = apps.Where(a => a._spd_applicantid_value == qry.BizId);
        }
        var applist = apps.ToList();

        if (qry.ValidServiceTypeCodes != null && qry.ValidServiceTypeCodes.Any())
        {
            List<Guid?> serviceTypeGuid = qry.ValidServiceTypeCodes
                .Select(c => DynamicsContextLookupHelpers.GetServiceTypeGuid(c.ToString()))
                .ToList();
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
