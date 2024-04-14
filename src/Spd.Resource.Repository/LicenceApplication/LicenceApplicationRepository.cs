using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.LicenceApplication;
internal class LicenceApplicationRepository : ILicenceApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicenceApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    //for unauth, create contact and application
    public async Task<LicenceApplicationCmdResp> CreateLicenceApplicationAsync(CreateLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application app = _mapper.Map<spd_application>(cmd);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;
        _context.AddTospd_applications(app);
        LinkServiceType(cmd.WorkerLicenceTypeCode, app);
        contact? contact = _mapper.Map<contact>(cmd);
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null) LinkExpiredLicence(cmd.ExpiredLicenceId, app);
            //for new, always create a new contact
            contact = await _context.CreateContact(contact, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases), ct);
        }
        else
        {
            if (cmd.OriginalApplicationId != null)
            {
                spd_application originApp = await _context.spd_applications.Where(a => a.spd_applicationid == cmd.OriginalApplicationId).FirstOrDefaultAsync(ct);
                //for replace, renew, update, "contact" is already exists, so, do update.
                contact? existingContact = await _context.GetContactById((Guid)originApp._spd_applicantid_value, ct);
                contact = await _context.UpdateContact(existingContact, contact, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases), ct);
            }
            else
            {
                throw new ArgumentException("for replace, renew or update, original application id cannot be null");
            }

            if (cmd.OriginalLicenceId != null)
            {
                LinkExpiredLicence(cmd.OriginalLicenceId, app);
            }
            else
            {
                throw new ArgumentException("for replace, renew or update, original licence id cannot be null");
            }
        }
        _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);
        await LinkTeam(DynamicsConstants.Licensing_Client_Service_Team_Guid, app, ct);
        await _context.SaveChangesAsync(ct);
        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        if (cmd.WorkerLicenceTypeCode == WorkerLicenceTypeEnum.SecurityWorkerLicence)
        {
            ProcessCategories(cmd.CategoryCodes, app);
        }
        await _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, (Guid)contact.contactid);
    }

    //for unauth, set applcation status to submitted.
    public async Task<LicenceApplicationCmdResp> CommitLicenceApplicationAsync(Guid applicationId, ApplicationStatusEnum status, CancellationToken ct)
    {
        spd_application? app = await _context.GetApplicationById(applicationId, ct);
        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid ApplicationId");

        if (status == ApplicationStatusEnum.Submitted)
        {
            app.statuscode = (int)ApplicationStatusOptionSet.Submitted;
            app.statecode = DynamicsConstants.StateCode_Inactive;
            app.spd_submittedon = DateTimeOffset.Now;
        }
        else
        {
            app.statuscode = (int)Enum.Parse<ApplicationStatusOptionSet>(status.ToString());
        }

        _context.UpdateObject(app);
        await _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, (Guid)app._spd_applicantid_value);
    }

    //for auth, do not need to create contact.
    public async Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveLicenceApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
            var contact = _context.contacts.Where(l => l.contactid == cmd.ApplicantId).FirstOrDefault();
            if (contact != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            }
        }
        LinkServiceType(cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null) LinkExpiredLicence(cmd.ExpiredLicenceId, app);
        await LinkTeam(DynamicsConstants.Licensing_Client_Service_Team_Guid, app, ct);
        await _context.SaveChangesAsync();
        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        ProcessCategories(cmd.CategoryCodes, app);
        await _context.SaveChangesAsync();
        return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
    }
    public async Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        var app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_ApplicantId_contact)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Where(a => a.spd_applicationid == licenceApplicationId).SingleOrDefaultAsync(ct);
        if (app == null)
            throw new ArgumentException("invalid app id");
        if (app.spd_ApplicantId_contact == null || app.spd_ApplicantId_contact.contactid == null)
            throw new ArgumentException("cannot find the applicant for this application");

        var aliases = GetAliases((Guid)app.spd_ApplicantId_contact.contactid);
        LicenceApplicationResp appResp = _mapper.Map<LicenceApplicationResp>(app);
        _mapper.Map<contact, LicenceApplicationResp>(app.spd_ApplicantId_contact, appResp);
        appResp.Aliases = _mapper.Map<AliasResponse[]>(aliases);
        return appResp;
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

    private List<spd_alias>? GetAliases(Guid contactId)
    {
        var matchingAliases = _context.spd_aliases.Where(o =>
           o._spd_contactid_value == contactId &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
       ).ToList();
        return matchingAliases;
    }
}
