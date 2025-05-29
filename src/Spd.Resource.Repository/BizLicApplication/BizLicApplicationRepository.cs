using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
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

            if (originalApp == null)
                throw new ArgumentException("Original business licence application was not found.");
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
        account? biz = await _context.GetOrgById(applicantId, ct);
        if (biz == null || biz.statecode != DynamicsConstants.StateCode_Active) throw new ApiException(HttpStatusCode.NotFound);

        await SetInfoFromBiz(biz, app, cmd.ApplicantIsBizManager ?? false, ct);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        await SetApplicantSwlLicenceId(app, cmd.ApplicantSwlLicenceId, ct);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
        SharedRepositoryFuncs.LinkSubmittedByPortalUser(_context, cmd.SubmittedByPortalUserId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator) &&
            cmd.PrivateInvestigatorSwlInfo?.ContactId != null &&
            cmd.PrivateInvestigatorSwlInfo?.LicenceId != null)
        {
            spd_businesscontact businessContact = await UpsertPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app, ct);
            _context.SetLink(businessContact, nameof(spd_businesscontact.spd_OrganizationId), biz);
        }
        else
            DeletePrivateInvestigatorLink(app);

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
        // Save changes done to the application, given that these are lost further down the logic (method "DeletePrivateInvestigatorLink")
        // when the business contact table is joined with application
        await _context.SaveChangesAsync(ct);

        account? biz = await _context.GetOrgById(cmd.ApplicantId, ct);
        if (biz == null || biz.statecode != DynamicsConstants.StateCode_Active) throw new ApiException(HttpStatusCode.NotFound);

        await SetInfoFromBiz(biz, app, cmd.ApplicantIsBizManager ?? false, ct);
        SharedRepositoryFuncs.LinkTeam(_context, DynamicsConstants.Licensing_Client_Service_Team_Guid, app);
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.ServiceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
            SharedRepositoryFuncs.LinkLicence(_context, cmd.ExpiredLicenceId, app);
        else
            _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        await SetApplicantSwlLicenceId(app, cmd.ApplicantSwlLicenceId, ct);

        SharedRepositoryFuncs.LinkSubmittedByPortalUser(_context, cmd.SubmittedByPortalUserId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator) &&
            cmd.PrivateInvestigatorSwlInfo?.ContactId != null &&
            cmd.PrivateInvestigatorSwlInfo?.LicenceId != null)
        {
            spd_businesscontact businessContact = await UpsertPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app, ct);
            _context.SetLink(businessContact, nameof(spd_businesscontact.spd_OrganizationId), biz);
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
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
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

        var response = _mapper.Map<BizLicApplicationResp>(app);
        var position = _context.LookupPosition(PositionEnum.PrivateInvestigatorManager.ToString());

        try
        {
            spd_businesscontact? bizContact = _context.spd_businesscontacts
                .Expand(b => b.spd_position_spd_businesscontact)
                .Expand(b => b.spd_businesscontact_spd_application)
                .Expand(b => b.spd_ContactId)
                .Where(b => b.spd_position_spd_businesscontact.Any(p => p.spd_positionid == position.spd_positionid))
                .Where(b => b.spd_businesscontact_spd_application.Any(b => b.spd_applicationid == app.spd_applicationid))
                .Where(b => b.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefault();

            if (bizContact != null)
            {
                response.PrivateInvestigatorSwlInfo = new()
                {
                    ContactId = (Guid)bizContact.spd_ContactId.contactid,
                    BizContactId = bizContact?.spd_businesscontactid,
                    GivenName = bizContact?.spd_firstname,
                    Surname = bizContact?.spd_surname,
                    MiddleName1 = bizContact?.spd_middlename1,
                    MiddleName2 = bizContact?.spd_middlename2,
                    EmailAddress = bizContact?.spd_email,
                    LicenceId = (Guid)bizContact._spd_swlnumber_value
                };
            }

        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                return response;
            else
                throw;
        }

        return response;
    }

    private async Task<spd_businesscontact> UpsertPrivateInvestigator(PrivateInvestigatorSwlContactInfo privateInvestigatorInfo, spd_application app, CancellationToken ct)
    {
        contact? contact = await _context.GetContactById(privateInvestigatorInfo.ContactId.Value, ct);
        if (contact == null)
            throw new ArgumentException($"cannot find the contact with contactId : {privateInvestigatorInfo.ContactId}");

        privateInvestigatorInfo.Surname = contact.lastname;
        privateInvestigatorInfo.GivenName = contact.firstname;
        privateInvestigatorInfo.MiddleName1 = contact.spd_middlename1;
        privateInvestigatorInfo.MiddleName2 = contact.spd_middlename2;

        spd_businesscontact? bizContact = null;
        Guid? bizContactId = privateInvestigatorInfo?.BizContactId;

        if (bizContactId == null)
        {
            DynamicsContextLookupHelpers.PositionDictionary.TryGetValue(PositionEnum.PrivateInvestigatorManager.ToString(), out Guid positionid);
            spd_businesscontact? existingBizContact = _context.spd_businesscontacts
                .Expand(b => b.spd_position_spd_businesscontact)
                .Expand(b => b.spd_businesscontact_spd_application)
                .Expand(b => b.spd_SWLNumber)
                .Where(b => b._spd_organizationid_value == app._spd_organizationid_value && b.statecode == DynamicsConstants.StateCode_Active)
                .Where(b => b.spd_position_spd_businesscontact.Any(p => p.spd_positionid == positionid))
                .Where(b => b.spd_SWLNumber.spd_licenceid == privateInvestigatorInfo.LicenceId)
                .FirstOrDefault();
            if (existingBizContact == null)
            {
                //we probably do not need to make other private investigator inactive. - tbd
                //find other pi bizContact, make them inactive. - not clear in requirement, should be fine to not do that.
                //otherPiBizContact.statecode = DynamicsConstants.StateCode_Inactive;
                //_context.UpdateObject(otherPiBizContact);

                //for same application, that means user changed his pi link during the same application - partial save. then we need to delete the old bizcontact.
                DeletePrivateInvestigatorLink(app);

                //add new one
                bizContact = _mapper.Map<spd_businesscontact>(privateInvestigatorInfo);
                bizContact.spd_businesscontactid = Guid.NewGuid();
                bizContact.spd_role = (int)BizContactRoleOptionSet.Employee;
                _context.AddTospd_businesscontacts(bizContact);
                AddPrivateInvestigatorLink(bizContact, app);
            }
            else
            {
                bizContact = existingBizContact;
                AddPrivateInvestigatorLink(bizContact, app);
            }
        }
        else
        {
            bizContact = _context.spd_businesscontacts.Where(b => b.spd_businesscontactid == bizContactId).FirstOrDefault();

            if (bizContact == null)
                throw new ArgumentException("business contact not found");

            _mapper.Map(privateInvestigatorInfo, bizContact);
            _context.UpdateObject(bizContact);

            // Must save changes before adding link that has navigation relationship, otherwise the transaction fails
            await _context.SaveChangesAsync(ct);
            AddPrivateInvestigatorLink(bizContact, app);
        }
        _context.SetLink(bizContact, nameof(spd_businesscontact.spd_ContactId), contact);
        spd_licence licence = GetLicence(privateInvestigatorInfo.LicenceId.Value);
        _context.AddLink(licence, nameof(spd_licence.spd_licence_spd_businesscontact_SWLNumber), bizContact);
        return bizContact;
    }

    private async Task SetApplicantSwlLicenceId(spd_application app, Guid? applicantSwlLicenceId, CancellationToken ct)
    {
        if (applicantSwlLicenceId != null)
        {
            var licence = await _context.spd_licences.Where(l => l.spd_licenceid == applicantSwlLicenceId).FirstOrDefaultAsync(ct);
            if (licence != null)
            {
                _context.SetLink(app, nameof(spd_application.spd_ApplicantSWLNumberId), licence);
            }
        }
        else
            _context.SetLink(app, nameof(app.spd_ApplicantSWLNumberId), null);
    }

    private void AddPrivateInvestigatorLink(spd_businesscontact bizContact, spd_application app)
    {
        if (!bizContact.spd_businesscontact_spd_application.Contains(app))
            _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);

        var position = _context.LookupPosition(PositionEnum.PrivateInvestigatorManager.ToString());

        if (!bizContact.spd_position_spd_businesscontact.Contains(position))
            _context.AddLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), bizContact);
    }

    private void DeletePrivateInvestigatorLink(spd_application app)
    {
        DynamicsContextLookupHelpers.PositionDictionary.TryGetValue(PositionEnum.PrivateInvestigatorManager.ToString(), out Guid positionid);

        spd_businesscontact? bizContact = _context.spd_businesscontacts
            .Expand(b => b.spd_position_spd_businesscontact)
            .Expand(b => b.spd_businesscontact_spd_application)
            //.Expand(b => b.spd_SWLNumber)
            .Where(b => b._spd_organizationid_value == app._spd_organizationid_value && b.statecode == DynamicsConstants.StateCode_Active)
            .Where(b => b.spd_position_spd_businesscontact.Any(p => p.spd_positionid == positionid))
            .Where(b => b.spd_businesscontact_spd_application.Any(b => b.spd_applicationid == app.spd_applicationid))
            .FirstOrDefault();

        if (bizContact == null)
            return;

        //if no spd_application connected with this bizContact, then set this bizContact inactive.
        if (bizContact.spd_businesscontact_spd_application.ToArray().Count() <= 1)
        {
            bizContact.statecode = DynamicsConstants.StateCode_Inactive;
            bizContact.statuscode = DynamicsConstants.StatusCode_Inactive;
            _context.UpdateObject(bizContact);
        }

        _context.DeleteLink(app, nameof(spd_application.spd_businesscontact_spd_application), bizContact);
        _context.SaveChanges();
    }

    //set biz manager info, applicant info, address and link biz to application
    private async Task SetInfoFromBiz(account biz, spd_application app, bool applicantIsManager, CancellationToken ct)
    {
        //address
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
        //biz manager
        app.spd_businessmanageremail = biz.spd_businessmanageremail;
        app.spd_businessmanagerfirstname = biz.spd_businessmanagerfirstname;
        app.spd_businessmanagermiddlename1 = biz.spd_businessmanagermiddlename1;
        app.spd_businessmanagermiddlename2 = biz.spd_businessmanagermiddlename2;
        app.spd_businessmanagerphone = biz.spd_businessmanagerphone;
        app.spd_businessmanagersurname = biz.spd_businessmanagersurname;
        if (applicantIsManager)
        {
            app.spd_emailaddress1 = biz.spd_businessmanageremail;
            app.spd_firstname = biz.spd_businessmanagerfirstname;
            app.spd_middlename1 = biz.spd_businessmanagermiddlename1;
            app.spd_middlename2 = biz.spd_businessmanagermiddlename2;
            app.spd_phonenumber = biz.spd_businessmanagerphone;
            app.spd_lastname = biz.spd_businessmanagersurname;
        }
        _context.UpdateObject(app);

        _context.SetLink(app, nameof(spd_application.spd_ApplicantId_account), biz);
        _context.SetLink(app, nameof(spd_application.spd_OrganizationId), biz);
        await _context.SaveChangesAsync(ct);
    }

    private spd_licence GetLicence(Guid licenceId)
    {
        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == licenceId)
            .Where(l => l.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();

        if (licence == null) throw new ArgumentException($"cannot find the licence with licenceId : {licenceId}");

        return licence;
    }

    public async Task CancelDraftApplicationAsync(Guid applicationId, CancellationToken ct)
    {
        spd_application? app = _context.spd_applications.Where(a => a.spd_applicationid == applicationId).FirstOrDefault();
        if (app == null)
            throw new ArgumentException("Application not found");
        if (app.spd_licenceapplicationtype == (int)LicenceApplicationTypeOptionSet.New)
            throw new ArgumentException("Canceling application with this type is not allowed.");
        if (app.statuscode != (int)ApplicationStatusOptionSet.Draft && app.statuscode != (int)ApplicationStatusOptionSet.Incomplete)
            throw new ArgumentException("Canceling application with this status is not allowed.");

        app.statecode = DynamicsConstants.StateCode_Inactive;
        app.statuscode = (int)ApplicationStatusOptionSet.Cancelled;
        _context.UpdateObject(app);
        await _context.SaveChangesAsync(ct);
    }
}
