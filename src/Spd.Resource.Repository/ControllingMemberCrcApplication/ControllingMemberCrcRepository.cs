using AutoMapper;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Polly;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using System.Collections.Generic;

namespace Spd.Resource.Repository.ControllingMemberCrcApplication;
public class ControllingMemberCrcRepository : IControllingMemberCrcRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;


    public ControllingMemberCrcRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    #region anonymous new
    public async Task<ControllingMemberCrcApplicationCmdResp> CreateControllingMemberCrcApplicationAsync(SaveControllingMemberCrcAppCmd cmd, CancellationToken ct)
    {
        // get parent business license application
        spd_application? bizLicApplication = await _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_ApplicantId_account)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId)
                .SingleOrDefaultAsync(ct);


        if (bizLicApplication == null)
            throw new ArgumentException("Parent business licence application was not found.");

        var bizContact = _context.spd_businesscontacts.Where(x => x.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();
        //check contact duplicate
        contact? contact = SharedRepositoryFuncs.GetDuplicateContact(_context, _mapper.Map<contact>(cmd), ct);
        //create or update contact
        contact? contactToCreate = _mapper.Map<contact>(cmd);
        contactToCreate.contactid = Guid.NewGuid();
        contact = contact == null ? 
            await _context.CreateContact(contactToCreate, null, _mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases), ct) : 
            await UpdatePersonalInformationAsync(cmd, contact, ct);


        spd_application? app = _mapper.Map<spd_application>(cmd);
        _context.AddTospd_applications(app);

        //set applicant lookup
        _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
        _context.AddLink(contact, nameof(contact.spd_contact_spd_application_ApplicantId), app);

        //link bizContact with contact
        _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), contact);

        //link to biz
        var account = _context.accounts
            .Where(a => a.accountid == bizLicApplication._spd_applicantid_value)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (account != null)
        {
            //set organization lookup
            _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
            _context.AddLink(account, nameof(account.spd_account_spd_application_OrganizationId), app);
        }
        // add link to parent business application
        _context.AddLink(bizLicApplication, nameof(bizLicApplication.spd_businessapplication_spd_workerapplication), app);

        SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);

        //link to bizContact
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), app);
        await _context.SaveChangesAsync();
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid, contact.contactid);
    }
    #endregion
    public async Task<ControllingMemberCrcApplicationResp> GetCrcApplicationAsync(Guid controllingMemberApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_contact)
                .Where(a => a.spd_applicationid == controllingMemberApplicationId)
                .SingleOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                throw new ArgumentException("invalid app id");
            else
                throw;
        }
        ControllingMemberCrcApplicationResp appResp = _mapper.Map<ControllingMemberCrcApplicationResp>(app);

        if (app.spd_ApplicantId_contact?.contactid != null)
        {
            var aliases = SharedRepositoryFuncs.GetAliases((Guid)app.spd_ApplicantId_contact.contactid, _context);
            appResp.Aliases = _mapper.Map<AliasResp[]>(aliases);
            _mapper.Map<spd_application, ControllingMemberCrcApplicationResp>(app, appResp);
        }

        return appResp;
    }

    public async Task<ControllingMemberCrcApplicationCmdResp> SaveControllingMemberCrcApplicationAsync(SaveControllingMemberCrcAppCmd cmd, CancellationToken ct)
    {
        // get parent business license application
        spd_application? bizLicApplication = await _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_ApplicantId_account)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId)
                .SingleOrDefaultAsync(ct);

        if (bizLicApplication == null)
            throw new ArgumentException("Parent business licence application was not found.");

        var bizContact = _context.spd_businesscontacts.Where(x => x.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();
        contact? contact = await _context.contacts
            .Expand(c => c.spd_Contact_Alias)
            .Where(c => c.contactid == cmd.ContactId).SingleOrDefaultAsync(ct);
        if (contact == null)
        {
            throw new ArgumentException("applicant not found");
        }
        //update contact and aliases
        contact = await UpdatePersonalInformationAsync(cmd, contact, ct);

        spd_application? app;
        if (cmd.ControllingMemberAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.ControllingMemberAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveControllingMemberCrcAppCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.ControllingMemberAppId);
            _context.UpdateObject(app);


        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);

            //set applicant lookup
            _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
            _context.AddLink(contact, nameof(contact.spd_contact_spd_application_ApplicantId), app);

            //link bizContact with contact
            _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), contact);

            //link to biz
            var account = _context.accounts
                .Where(a => a.accountid == bizLicApplication._spd_applicantid_value)
                .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefault();
            if (account != null)
            {
                //set organization lookup
                _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
                _context.AddLink(account, nameof(account.spd_account_spd_application_OrganizationId), app);
            }
            // add link to parent business application
            _context.AddLink(bizLicApplication, nameof(bizLicApplication.spd_businessapplication_spd_workerapplication), app);

            SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
            SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);

            //link to bizContact
            _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), app);
        }

        await _context.SaveChangesAsync();
        return new ControllingMemberCrcApplicationCmdResp((Guid)app.spd_applicationid, cmd.ContactId);
    }

    //update contact, aliases and addreses, support partial save (to not add spd_address and spd_alias histroy record)
    private async Task<contact?> UpdatePersonalInformationAsync(SaveControllingMemberCrcAppCmd cmd, contact? contact, CancellationToken ct)
    {
        List<AliasResp> aliases = _mapper.Map<List<AliasResp>>(contact?.spd_Contact_Alias.Where(a => a.statecode == DynamicsConstants.StateCode_Active &&
                a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered));
        contact newContact = _mapper.Map<contact>(cmd);
        List<spd_alias> aliasesToAdd = (List<spd_alias>)_mapper.Map<IEnumerable<spd_alias>>(cmd.Aliases.Where(a => a.Id == null || a.Id == Guid.Empty)); // Only aliases with Id null or empty are considered as new
        var modifiedAliases = cmd.Aliases.Where(a => a.Id != Guid.Empty && a.Id != null).ToList();
        List<Guid?> aliasesToRemove = aliases.Where(a => modifiedAliases.All(ap => ap.Id != a.Id)).Select(a => a.Id).ToList();

        contact = await _context.UpdateContact(contact, newContact, null, aliasesToAdd, ct, cmd.IsPartialSaving);
        foreach (var aliasId in aliasesToRemove)
        {
            spd_alias? alias = _context.spd_aliases.Where(a =>
                a.spd_aliasid == aliasId &&
                a.statecode == DynamicsConstants.StateCode_Active &&
                a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
            ).FirstOrDefault();

            if (alias != null)
            {
                alias.statecode = DynamicsConstants.StateCode_Inactive;
                alias.statuscode = DynamicsConstants.StatusCode_Inactive;
                _context.UpdateObject(alias);
            }
        }
        foreach (AliasResp alias in modifiedAliases)
        {
            spd_alias? existingAlias = _context.spd_aliases.Where(a =>
                a.spd_aliasid == alias.Id &&
                a.statecode == DynamicsConstants.StateCode_Active &&
                a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
            ).FirstOrDefault();

            if (existingAlias != null)
            {
                existingAlias.spd_firstname = alias.GivenName;
                existingAlias.spd_surname = alias.Surname;
                existingAlias.spd_middlename1 = alias.MiddleName1;
                existingAlias.spd_middlename2 = alias.MiddleName2;
            }
            _context.UpdateObject(existingAlias);
        }
        await _context.SaveChangesAsync(ct);
        return contact;
    }
}
