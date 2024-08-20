using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.LicApp;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.PersonLicApplication;
internal class PersonLicApplicationRepository : IPersonLicApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public PersonLicApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
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
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        contact? contact = _mapper.Map<contact>(cmd);
        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
        {
            if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
                SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
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
                SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);
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
            SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        }
        await _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, (Guid)contact.contactid, null);
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
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
            SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
        else
            _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        await LinkTeam(DynamicsConstants.Licensing_Client_Service_Team_Guid, app, ct);
        await _context.SaveChangesAsync();
        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync();
        return new LicenceApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId, null);
    }
    public async Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_application_spd_licencecategory)
                .Expand(a => a.spd_CurrentExpiredLicenceId)
                .Where(a => a.spd_applicationid == licenceApplicationId)
                .SingleOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                throw new ArgumentException("invalid app id");
            else
                throw;
        }

        LicenceApplicationResp appResp = _mapper.Map<LicenceApplicationResp>(app);

        if (app.spd_ApplicantId_contact?.contactid != null)
        {
            var aliases = GetAliases((Guid)app.spd_ApplicantId_contact.contactid);
            appResp.Aliases = _mapper.Map<AliasResp[]>(aliases);
            _mapper.Map<contact, LicenceApplicationResp>(app.spd_ApplicantId_contact, appResp);
        }

        return appResp;
    }

    public async Task<LicenceApplicationCmdResp> UpdateSwlSoleProprietorApplicationAsync(Guid swlAppId, Guid bizLicAppId, CancellationToken ct)
    {
        var swlApp = await _context.spd_applications.Where(a => a.spd_applicationid == swlAppId).SingleOrDefaultAsync(ct);
        var bizLicApp = await _context.spd_applications.Where(a => a.spd_applicationid == bizLicAppId).SingleOrDefaultAsync(ct);
        _context.SetLink(swlApp, nameof(swlApp.spd_BusinessLicenseId), bizLicApp);
        _context.SaveChangesAsync(ct);
        return new LicenceApplicationCmdResp((Guid)swlApp.spd_applicationid, swlApp._spd_applicantid_value, swlApp._spd_organizationid_value);
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
