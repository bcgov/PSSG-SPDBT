using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using Spd.Resource.Repository.PersonLicApplication;
using System.Net;

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

    public async Task<BizLicApplicationCmdResp> CreateBizLicApplicationAsync(CreateBizLicApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? originalApp;
        Guid applicantId;
        spd_application app = _mapper.Map<spd_application>(cmd);
        app.statuscode = (int)ApplicationStatusOptionSet.Incomplete;

        if (cmd.ApplicationTypeCode == ApplicationTypeEnum.New)
            throw new ArgumentException("New application type is not supported for business licence.");

        if (cmd.OriginalApplicationId == null)
            throw new ArgumentException("For replace, renew or update, original licence id cannot be null.");

        try
        {
            originalApp = await _context.spd_applications
                .Expand(a => a.spd_ApplicantId_account)
                .Where(a => a.spd_applicationid == cmd.OriginalApplicationId)
                .FirstOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                throw new ArgumentException("Original business licence application was not found.");
            throw;
        }

        app.spd_businesstype = originalApp.spd_businesstype;
        _context.AddTospd_applications(app);

        if (originalApp?.spd_ApplicantId_account?.accountid == null)
            throw new ArgumentException("There is no account linked to the application found.");

        SharedRepositoryFuncs.LinkLicence(_context, cmd.OriginalLicenceId, app);
        applicantId = (Guid)originalApp.spd_ApplicantId_account.accountid;

        await SetAddresses(applicantId, app, ct);
        await SetOwner(app, Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid), ct);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        LinkOrganization(applicantId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator))
        {
            contact contact = GetContact((Guid)cmd.PrivateInvestigatorSwlInfo.ContactId);
            spd_businesscontact businessContact = UpsertPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app);
            _context.SetLink(businessContact, nameof(spd_businesscontact.spd_ContactId), contact);
        }
        else
            DeletePrivateInvestigatorLink(app);

        await _context.SaveChangesAsync(ct);

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync(ct);
        return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, applicantId);
    }

    public async Task<BizLicApplicationCmdResp> SaveBizLicApplicationAsync(SaveBizLicApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Expand(a => a.spd_businesscontact_spd_application)
                .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId)
                .FirstOrDefault();
            if (app == null)
                throw new ArgumentException("Application Id was not found.");
            _mapper.Map<SaveBizLicApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        await SetAddresses(cmd.ApplicantId, app, ct);
        await SetOwner(app, Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid), ct);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
            SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
        else
            _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        LinkOrganization(cmd.ApplicantId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator) && cmd.PrivateInvestigatorSwlInfo?.ContactId != null)
        {
            contact contact = GetContact((Guid)cmd.PrivateInvestigatorSwlInfo.ContactId);
            spd_businesscontact businessContact = UpsertPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app);
            _context.SetLink(businessContact, nameof(spd_businesscontact.spd_ContactId), contact);
        }
        else
            DeletePrivateInvestigatorLink(app);

        await _context.SaveChangesAsync(ct);

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync(ct);
        return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
    }

    public async Task<BizLicApplicationResp> GetBizLicApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        spd_application? app;
        try
        {
            app = await _context.spd_applications
                .Expand(a => a.spd_ServiceTypeId)
                .Expand(a => a.spd_ApplicantId_account)
                .Expand(a => a.spd_ApplicantId_contact)
                .Expand(a => a.spd_application_spd_licencecategory)
                .Expand(a => a.spd_CurrentExpiredLicenceId)
                .Expand(a => a.spd_businesscontact_spd_application)
                .Where(a => a.spd_applicationid == licenceApplicationId)
                .FirstOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                app = null;
            else
                throw;
        }

        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the application for application id = {licenceApplicationId} ");

        return _mapper.Map<BizLicApplicationResp>(app);
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
            _context.SetLink(app, nameof(spd_application.spd_ApplicantId_account), account);
        }
    }

    private spd_businesscontact UpsertPrivateInvestigator(PrivateInvestigatorSwlContactInfo privateInvestigatorInfo, spd_application app)
    {
        spd_businesscontact? bizContact = null;
        DeletePrivateInvestigatorLink(app);
        Guid? bizContactId = privateInvestigatorInfo?.BizContactId;

        if (bizContactId == null)
        {
            bizContact = _mapper.Map<spd_businesscontact>(privateInvestigatorInfo);
            bizContact.spd_businesscontactid = Guid.NewGuid();
            _context.AddTospd_businesscontacts(bizContact);
            AddPrivateInvestigatorLink(bizContact, app);
        }
        else
        {
            bizContact = _context.spd_businesscontacts.Where(b => b.spd_businesscontactid == bizContactId).FirstOrDefault();

            if (bizContact == null)
                throw new ArgumentException("business contact not found");

            _mapper.Map(privateInvestigatorInfo, bizContact);
            _context.UpdateObject(bizContact);

            // Must save changes before adding link that has navigation relationship, otherwise the transaction fails
            _context.SaveChanges();
            AddPrivateInvestigatorLink(bizContact, app);
        }
        return bizContact;
    }

    private void AddPrivateInvestigatorLink(spd_businesscontact bizContact, spd_application app)
    {
        _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);

        var position = _context.LookupPosition(PositionEnum.PrivateInvestigatorManager.ToString());

        if (position != null)
            _context.AddLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), bizContact);
    }

    private void DeletePrivateInvestigatorLink(spd_application app)
    {
        spd_businesscontact? bizContact = app.spd_businesscontact_spd_application.FirstOrDefault();

        if (bizContact == null)
            return;

        _context.DeleteLink(app, nameof(spd_application.spd_businesscontact_spd_application), bizContact);
        _context.SetLink(bizContact, nameof(spd_businesscontact.spd_ContactId), null);

        var position = _context.LookupPosition(PositionEnum.PrivateInvestigatorManager.ToString());

        if (position == null)
            return;

        _context.DeleteLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), bizContact);
    }

    private async Task SetAddresses(Guid accountId, spd_application app, CancellationToken ct)
    {
        IQueryable<account> accounts = _context.accounts
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == accountId);

        account? biz = await accounts.FirstOrDefaultAsync(ct);

        if (biz == null) throw new ApiException(HttpStatusCode.NotFound);

        app.spd_addressline1 = biz.address1_line1;
        app.spd_addressline2 = biz.address1_line2;
        app.spd_city = biz.address1_city;
        app.spd_province = biz.address1_stateorprovince;
        app.spd_country = biz.address1_country;
        app.spd_postalcode = biz.address1_postalcode;
        app.spd_residentialaddress1 = biz.address2_line1;
        app.spd_residentialaddress2 = biz.address2_line2;
        app.spd_residentialcity = biz.address2_city;
        app.spd_residentialprovince = biz.address2_stateorprovince;
        app.spd_residentialcountry = biz.address2_country;
        app.spd_residentialpostalcode = biz.address2_postalcode;

        _context.UpdateObject(app);
    }

    private async Task SetOwner(spd_application app, Guid ownerId, CancellationToken ct)
    {
        team? serviceTeam = await _context.teams.Where(t => t.teamid == ownerId).FirstOrDefaultAsync(ct);

        if (serviceTeam == null)
            throw new ArgumentException("service team not found");

        _context.SetLink(app, nameof(app.ownerid), serviceTeam);
    }

    private contact GetContact(Guid contactId)
    {
        contact? contact = _context.contacts
            .Where(c => c.contactid == contactId)
            .Where(c => c.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (contact == null) throw new ArgumentException($"cannot find the contact with contactId : {contactId}");

        return contact;
    }
}
