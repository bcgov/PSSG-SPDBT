using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.BizLicApplication;
internal class BizLicApplicationRepository : IBizLicApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public BizLicApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<BizLicApplicationCmdResp> SaveBizLicApplicationAsync(SaveBizLicApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId)
                .FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveBizLicApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        LinkServiceType(cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null) 
            LinkExpiredLicence(cmd.ExpiredLicenceId, app);
        LinkOrganization(cmd.ApplicantId, app);
        await _context.SaveChangesAsync();

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        ProcessCategories(cmd.CategoryCodes, app);
        await _context.SaveChangesAsync();
        return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
    }

    private void ProcessCategories(IEnumerable<WorkerCategoryTypeEnum> categories, spd_application app)
    {
        foreach (var c in categories)
        {
            var cat = _context.LookupLicenceCategory(c.ToString());
            if (cat != null && !app.spd_application_spd_licencecategory.Any(c => c.spd_licencecategoryid == cat.spd_licencecategoryid))
            {
                _context.AddLink(app, nameof(spd_application.spd_application_spd_licencecategory), cat);
            }
        }
        foreach (var appCategory in app.spd_application_spd_licencecategory)
        {
            var code = DynamicsContextLookupHelpers.LookupLicenceCategoryKey(appCategory.spd_licencecategoryid);
            //if categories do not contain cat
            if (!categories.Any(c => c.ToString() == code))
            {
                _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
            }
        }
    }

    private void LinkServiceType(WorkerLicenceTypeEnum? licenceType, spd_application app)
    {
        if (licenceType == null) throw new ArgumentException("invalid LicenceApplication type");
        spd_servicetype? servicetype = _context.LookupServiceType(licenceType.ToString());
        if (servicetype != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), servicetype);
        }
    }

    private void LinkExpiredLicence(Guid? expiredLicenceId, spd_application app)
    {
        if (expiredLicenceId == null) return;
        var licence = _context.spd_licences.Where(l => l.spd_licenceid == expiredLicenceId).FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicenceId), licence);
        }
    }

    private async Task LinkTeam(string teamGuidStr, spd_application app, CancellationToken ct)
    {
        Guid teamGuid = Guid.Parse(teamGuidStr);
        team? serviceTeam = await _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefaultAsync(ct);
        _context.SetLink(app, nameof(spd_application.ownerid), serviceTeam);
    }

    private void LinkOrganization(Guid? accountId, spd_application app)
    {
        if (accountId == null) return;
        var account = _context.accounts
            .Where(a => a.accountid == accountId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (account != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
        }
    }
}
