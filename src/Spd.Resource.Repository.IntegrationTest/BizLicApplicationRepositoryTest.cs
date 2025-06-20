﻿using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.IntegrationTest;
public class BizLicApplicationRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IBizLicApplicationRepository _bizLicAppRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public BizLicApplicationRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

        _bizLicAppRepository = testSetup.ServiceProvider.GetRequiredService<IBizLicApplicationRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task GetBizLicApplicationAsync_Run_Correctly()
    {
        // Arrange
        Guid expiredLicenceId = Guid.NewGuid();
        DateTimeOffset expireDate = DateTimeOffset.UtcNow;
        spd_licence expiredLicence = new();
        expiredLicence.spd_licenceid = expiredLicenceId;
        expiredLicence.spd_expirydate = expireDate;
        _context.AddTospd_licences(expiredLicence);

        Guid bizId = Guid.NewGuid();
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = bizId;
        _context.AddToaccounts(biz);

        Guid licenceApplicationId = Guid.NewGuid();
        spd_application app = new();
        app.spd_firstname = "firstName";
        app.spd_lastname = "lastName";
        app.spd_middlename1 = "middleName1";
        app.spd_middlename2 = "middleName2";
        app.spd_applicationid = licenceApplicationId;
        app.spd_licenceterm = 100000000;

        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(app.spd_ApplicantId_account), biz);
        _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), expiredLicence);
        await _context.SaveChangesAsync();

        // Act
        var result = await _bizLicAppRepository.GetBizLicApplicationAsync(licenceApplicationId, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<BizLicApplicationResp>(result);
        Assert.Equal(bizId, result.BizId);
        Assert.Equal(app.spd_firstname, result.GivenName);
        Assert.Equal(app.spd_lastname, result.Surname);
        Assert.Equal(app.spd_middlename1, result.MiddleName1);
        Assert.Equal(app.spd_middlename2, result.MiddleName2);
        Assert.Equal(app.spd_applicationid, result.LicenceAppId);
        Assert.Equal(expiredLicenceId, result.ExpiredLicenceId);
        Assert.Equal(LicenceTermEnum.NinetyDays, result.LicenceTermCode);

        // Annihilate
        _context.DeleteObject(expiredLicence);
        _context.DeleteObject(biz);
        _context.DeleteObject(app);
        await _context.SaveChangesAsync();
    } */

    //** TODO: Adjust verification according to ticket SPDBT-2796
    [Fact]
    public async Task GetBizLicApplicationAsync_WithPrivateInvestigator_Run_Correctly()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = bizId;
        _context.AddToaccounts(biz);

        Guid licenceApplicationId = Guid.NewGuid();
        spd_application app = new();
        app.spd_firstname = "firstName";
        app.spd_lastname = "lastName";
        app.spd_middlename1 = "middleName1";
        app.spd_middlename2 = "middleName2";
        app.spd_applicationid = licenceApplicationId;
        app.spd_licenceterm = 100000000;

        _context.AddTospd_applications(app);
        _context.SetLink(app, nameof(app.spd_ApplicantId_account), biz);

        Guid bizContactId = Guid.NewGuid();
        spd_businesscontact bizContact = new()
        {
            spd_businesscontactid = bizContactId,
            spd_firstname = "InvestigatorGivenName",
            spd_surname = "InvestigatorSurname"
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);

        spd_position position = _context.LookupPosition(PositionEnum.PrivateInvestigatorManager.ToString());
        _context.AddLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), bizContact);
        await _context.SaveChangesAsync();

        // Act
        var result = await _bizLicAppRepository.GetBizLicApplicationAsync(licenceApplicationId, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<BizLicApplicationResp>(result);
        Assert.Equal(bizId, result.BizId);
        Assert.Equal(app.spd_applicationid, result.LicenceAppId);
        Assert.Equal(bizContactId, result.PrivateInvestigatorSwlInfo?.BizContactId);
        Assert.Equal(bizContact.spd_firstname, result.PrivateInvestigatorSwlInfo?.GivenName);
        Assert.Equal(bizContact.spd_surname, result.PrivateInvestigatorSwlInfo?.Surname);

        // Annihilate
        _context.DeleteObject(biz);
        _context.DeleteObject(app);
        _context.DeleteObject(bizContact);
        await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task GetBizLicApplicationAsync_BizNotFound_Throw_Exception()
    {
        // Act and Assert
        await Assert.ThrowsAsync<ApiException>(async () => await _bizLicAppRepository.GetBizLicApplicationAsync(Guid.NewGuid(), CancellationToken.None));
    }

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task SaveBizLicApplicationAsync_WithoutLicenceAppId_Run_Correctly()
    {
        // Arrange
        Guid pInvestigatorLicenceId = Guid.NewGuid();

        SaveBizLicApplicationCmd cmd = fixture.Build<SaveBizLicApplicationCmd>()
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.StudyPermit, UploadedDocumentEnum.Fingerprint })
            .With(a => a.HasExpiredLicence, true)
            .With(a => a.BizTypeCode, BizTypeEnum.Corporation)
            .With(a => a.NoBranding, false)
            .With(a => a.UseDogs, false)
            .With(a => a.PrivateInvestigatorSwlInfo, new SwlContactInfo() { LicenceId = pInvestigatorLicenceId })
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.PrivateInvestigator })
            .With(a => a.AgreeToCompleteAndAccurate, false)
            .Without(a => a.LicenceAppId)
            .Create();

        spd_licence expiredLicence = new() { spd_licenceid = cmd.ExpiredLicenceId };
        _context.AddTospd_licences(expiredLicence);
        account account = new() 
        {
            accountid = cmd.ApplicantId,
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active 
        };
        _context.AddToaccounts(account);
        spd_licence pInvestigatorLicence = new() { spd_licenceid = pInvestigatorLicenceId };
        _context.AddTospd_licences(pInvestigatorLicence);
        await _context.SaveChangesAsync();

        // Action
        BizLicApplicationCmdResp? resp = await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? app = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_application_spd_licence_manager)
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(resp);
        Assert.Equal(cmd.GivenName, app.spd_firstname);
        Assert.Equal(cmd.Surname, app.spd_lastname);
        Assert.Equal(cmd.MiddleName1, app.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, app.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, app.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, app.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, app.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, app.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, app.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, app.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, app.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, app.spd_businessmanagerphone);
        Assert.Equal("100000000,100000001", app.spd_uploadeddocuments);
        Assert.Equal(100000004, app.spd_businesstype);
        Assert.Equal(100000000, app.spd_nologoorbranding);
        Assert.Equal(100000000, app.spd_requestdogs);
        Assert.Equal(cmd.AgreeToCompleteAndAccurate, app.spd_declaration);
        Assert.Equal(account.address1_line1, app.spd_addressline1);
        Assert.Equal(account.address1_line2, app.spd_addressline2);
        Assert.Equal(account.address1_city, app.spd_city);
        Assert.Equal(account.address1_stateorprovince, app.spd_province);
        Assert.Equal(account.address1_country, app.spd_country);
        Assert.Equal(account.address1_postalcode, app.spd_postalcode);
        Assert.Equal(account.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(account.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(account.address2_city, app.spd_residentialcity);
        Assert.Equal(account.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(account.address2_country, app.spd_residentialcountry);
        Assert.Equal(account.address2_postalcode, app.spd_residentialpostalcode);
        Assert.Null(app.spd_declarationdate);
        Assert.NotNull(app.spd_origin);
        Assert.NotNull(app.spd_payer);
        Assert.NotNull(app.spd_portalmodifiedon);
        Assert.NotNull(app.spd_ServiceTypeId);
        Assert.NotNull(app.spd_CurrentExpiredLicenceId);
        Assert.NotEmpty(app.spd_application_spd_licencecategory);
        Assert.NotEmpty(app.spd_application_spd_licence_manager);

        //Innihilate
        _context.DeleteObject(expiredLicence);
        _context.DeleteObject(account);
        _context.DeleteObject(pInvestigatorLicence);

        // Remove all links to the application before removing it
        _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == pInvestigatorLicenceId)
            .FirstOrDefault();
        _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licence_manager), licence);

        foreach (var appCategory in app.spd_application_spd_licencecategory)
            _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        await _context.SaveChangesAsync();

        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .FirstOrDefault();

        _context.DeleteObject(appToRemove);
        await _context.SaveChangesAsync();
    } */

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task SaveBizLicApplicationAsync_WithLicenceAppId_Run_Correctly()
    {
        // Arrange
        Guid pInvestigatorLicenceId = Guid.NewGuid();

        SaveBizLicApplicationCmd cmd = fixture.Build<SaveBizLicApplicationCmd>()
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.StudyPermit, UploadedDocumentEnum.Fingerprint })
            .With(a => a.HasExpiredLicence, true)
            .With(a => a.BizTypeCode, BizTypeEnum.Corporation)
            .With(a => a.NoBranding, false)
            .With(a => a.UseDogs, false)
            .With(a => a.PrivateInvestigatorSwlInfo, new SwlContactInfo() { LicenceId = pInvestigatorLicenceId })
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.PrivateInvestigator })
            .With(a => a.AgreeToCompleteAndAccurate, true)
            .Create();

        spd_application? app = new() { spd_applicationid = cmd.LicenceAppId, statecode = DynamicsConstants.StateCode_Active };
        _context.AddTospd_applications(app);
        spd_licence expiredLicence = new() { spd_licenceid = cmd.ExpiredLicenceId };
        _context.AddTospd_licences(expiredLicence);
        account account = new() 
        { 
            accountid = cmd.ApplicantId,
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active 
        };
        _context.AddToaccounts(account);
        spd_licence pInvestigatorLicence = new() { spd_licenceid = pInvestigatorLicenceId };
        _context.AddTospd_licences(pInvestigatorLicence);
        await _context.SaveChangesAsync();

        // Action
        BizLicApplicationCmdResp? resp = await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? updatedApp = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_application_spd_licence_manager)
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(resp);
        Assert.Equal(cmd.GivenName, updatedApp.spd_firstname);
        Assert.Equal(cmd.Surname, updatedApp.spd_lastname);
        Assert.Equal(cmd.MiddleName1, updatedApp.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, updatedApp.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, updatedApp.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, updatedApp.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, updatedApp.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, updatedApp.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, updatedApp.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, updatedApp.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, updatedApp.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, updatedApp.spd_businessmanagerphone);
        Assert.Equal("100000000,100000001", updatedApp.spd_uploadeddocuments);
        Assert.Equal(100000004, updatedApp.spd_businesstype);
        Assert.Equal(100000000, updatedApp.spd_nologoorbranding);
        Assert.Equal(100000000, updatedApp.spd_requestdogs);
        Assert.Equal(cmd.AgreeToCompleteAndAccurate, updatedApp.spd_declaration);
        Assert.Equal(account.address1_line1, app.spd_addressline1);
        Assert.Equal(account.address1_line2, app.spd_addressline2);
        Assert.Equal(account.address1_city, app.spd_city);
        Assert.Equal(account.address1_stateorprovince, app.spd_province);
        Assert.Equal(account.address1_country, app.spd_country);
        Assert.Equal(account.address1_postalcode, app.spd_postalcode);
        Assert.Equal(account.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(account.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(account.address2_city, app.spd_residentialcity);
        Assert.Equal(account.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(account.address2_country, app.spd_residentialcountry);
        Assert.Equal(account.address2_postalcode, app.spd_residentialpostalcode);
        Assert.NotNull(updatedApp.spd_declarationdate);
        Assert.NotNull(updatedApp.spd_origin);
        Assert.NotNull(updatedApp.spd_payer);
        Assert.NotNull(updatedApp.spd_portalmodifiedon);
        Assert.NotNull(updatedApp.spd_ServiceTypeId);
        Assert.NotNull(updatedApp.spd_CurrentExpiredLicenceId);
        Assert.NotEmpty(updatedApp.spd_application_spd_licencecategory);
        Assert.NotEmpty(updatedApp.spd_application_spd_licence_manager);

        //Innihilate
        _context.DeleteObject(expiredLicence);
        _context.DeleteObject(account);
        _context.DeleteObject(pInvestigatorLicence);

        // Remove all links to the application before removing it
        _context.SetLink(updatedApp, nameof(updatedApp.spd_CurrentExpiredLicenceId), null);

        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == pInvestigatorLicenceId)
            .FirstOrDefault();
        _context.DeleteLink(updatedApp, nameof(spd_application.spd_application_spd_licence_manager), licence);

        foreach (var appCategory in updatedApp.spd_application_spd_licencecategory)
            _context.DeleteLink(updatedApp, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        await _context.SaveChangesAsync();

        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .FirstOrDefault();

        _context.DeleteObject(appToRemove);
        await _context.SaveChangesAsync();
    } */

    //** TODO: Adjust verification according to ticket SPDBT-2796
    [Fact]
    public async Task SaveBizLicApplicationAsync_AddNewPrivateInvestigator_Run_Correctly()
    {
        // Arrange
        PrivateInvestigatorSwlContactInfo privateInvestigator = new()
        {
            GivenName = "InvestigatorGivenName",
            Surname = "InvestigatorSurname"
        };

        SaveBizLicApplicationCmd cmd = fixture.Build<SaveBizLicApplicationCmd>()
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.StudyPermit, UploadedDocumentEnum.Fingerprint })
            .With(a => a.HasExpiredLicence, false)
            .With(a => a.BizTypeCode, BizTypeEnum.Corporation)
            .With(a => a.NoBranding, false)
            .With(a => a.UseDogs, false)
            .With(a => a.PrivateInvestigatorSwlInfo, privateInvestigator)
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.PrivateInvestigator })
            .With(a => a.AgreeToCompleteAndAccurate, false)
            .Without(a => a.LicenceAppId)
            .Create();

        account account = new()
        {
            accountid = cmd.ApplicantId,
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddToaccounts(account);
        await _context.SaveChangesAsync();

        // Action
        BizLicApplicationCmdResp? resp = await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? app = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_businesscontact_spd_application)
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
        .FirstOrDefault();

        spd_businesscontact newBizContact = await CreateBizContactAsync(account, app, "firstName1", BizContactRoleOptionSet.ControllingMember);
        var position = _context.spd_positions.FirstOrDefault();
        //_context.AddLink(bizContact2, nameof(spd_application.spd_businesscontact_spd_application), app);
        _context.AddLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), newBizContact);
        await _context.SaveChangesAsync();


        spd_businesscontact? bizContact = _context.spd_businesscontacts
            .Expand(b => b.spd_position_spd_businesscontact)
            .OrderByDescending(b => b.createdon)
            .FirstOrDefault();

        app = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_businesscontact_spd_application)
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
        .FirstOrDefault();

        // Assert
        Assert.NotNull(resp);
        Assert.NotNull(bizContact);
        Assert.Equal(cmd.GivenName, app.spd_firstname);
        Assert.Equal(cmd.Surname, app.spd_lastname);
        Assert.Equal(cmd.MiddleName1, app.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, app.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, app.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, app.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, app.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, app.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, app.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, app.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, app.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, app.spd_businessmanagerphone);
        Assert.Equal("100000000,100000001", app.spd_uploadeddocuments);
        Assert.Equal(100000004, app.spd_businesstype);
        Assert.Equal(100000000, app.spd_nologoorbranding);
        Assert.Equal(100000000, app.spd_requestdogs);
        Assert.Equal(cmd.AgreeToCompleteAndAccurate, app.spd_declaration);
        Assert.Equal(account.address1_line1, app.spd_addressline1);
        Assert.Equal(account.address1_line2, app.spd_addressline2);
        Assert.Equal(account.address1_city, app.spd_city);
        Assert.Equal(account.address1_stateorprovince, app.spd_province);
        Assert.Equal(account.address1_country, app.spd_country);
        Assert.Equal(account.address1_postalcode, app.spd_postalcode);
        Assert.Equal(account.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(account.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(account.address2_city, app.spd_residentialcity);
        Assert.Equal(account.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(account.address2_country, app.spd_residentialcountry);
        Assert.Equal(account.address2_postalcode, app.spd_residentialpostalcode);
        Assert.Null(app.spd_declarationdate);
        Assert.Null(app.spd_CurrentExpiredLicenceId);
        Assert.NotNull(app.spd_origin);
        Assert.NotNull(app.spd_payer);
        Assert.NotNull(app.spd_portalmodifiedon);
        Assert.NotNull(app.spd_ServiceTypeId);
        Assert.NotEmpty(app.spd_application_spd_licencecategory);
        Assert.NotEmpty(app.spd_businesscontact_spd_application);
        Assert.NotEmpty(bizContact.spd_position_spd_businesscontact);

        //Innihilate

        _context.SetLink(newBizContact, nameof(newBizContact.spd_OrganizationId), null);
        _context.DeleteLink(newBizContact, nameof(newBizContact.spd_businesscontact_spd_application), app);
        _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);
        _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), null);
        _context.DeleteLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), newBizContact);
        foreach (var appCategory in app.spd_application_spd_licencecategory)
            _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        await _context.SaveChangesAsync();

        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .FirstOrDefault();

        spd_businesscontact? bizContactToRemove = _context.spd_businesscontacts
            .Where(b => b.spd_businesscontactid == bizContact.spd_businesscontactid)
          .OrderByDescending(b => b.createdon)
          .FirstOrDefault();

        _context.DeleteObject(appToRemove);
        _context.DeleteObject(account);
        _context.DeleteObject(bizContactToRemove);
        await _context.SaveChangesAsync();
    }

    //** TODO: Adjust verification according to ticket SPDBT-2796
    [Fact]
    public async Task SaveBizLicApplicationAsync_AddNewPrivateInvestigatorWithExistingPrivateInvestigator_Run_Correctly()
    {
        // Arrange
        PrivateInvestigatorSwlContactInfo privateInvestigator = new()
        {
            GivenName = "InvestigatorGivenName",
            Surname = "InvestigatorSurname"
        };

        SaveBizLicApplicationCmd cmd = fixture.Build<SaveBizLicApplicationCmd>()
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.StudyPermit, UploadedDocumentEnum.Fingerprint })
            .With(a => a.HasExpiredLicence, false)
            .With(a => a.BizTypeCode, BizTypeEnum.Corporation)
            .With(a => a.NoBranding, false)
            .With(a => a.UseDogs, false)
            .With(a => a.PrivateInvestigatorSwlInfo, privateInvestigator)
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.PrivateInvestigator })
            .With(a => a.AgreeToCompleteAndAccurate, true)
            .Create();

        spd_application? app = new() { spd_applicationid = cmd.LicenceAppId, statecode = DynamicsConstants.StateCode_Active };
        _context.AddTospd_applications(app);
        spd_businesscontact bizContact = new()
        {
            spd_businesscontactid = Guid.NewGuid()
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);

        account account = new()
        {
            accountid = cmd.ApplicantId,
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddToaccounts(account);
        await _context.SaveChangesAsync();

        // Action
        BizLicApplicationCmdResp? resp = await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? updatedApp = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_businesscontact_spd_application)
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        var position = _context.spd_positions.FirstOrDefault();
        _context.AddLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), bizContact);
        await _context.SaveChangesAsync();

        spd_businesscontact? newBizContact = _context.spd_businesscontacts
            .Expand(b => b.spd_position_spd_businesscontact)
            .OrderByDescending(b => b.createdon)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(resp);
        Assert.NotNull(newBizContact);
        Assert.Equal(cmd.GivenName, updatedApp.spd_firstname);
        Assert.Equal(cmd.Surname, updatedApp.spd_lastname);
        Assert.Equal(cmd.MiddleName1, updatedApp.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, updatedApp.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, updatedApp.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, updatedApp.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, updatedApp.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, updatedApp.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, updatedApp.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, updatedApp.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, updatedApp.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, updatedApp.spd_businessmanagerphone);
        Assert.Equal("100000000,100000001", updatedApp.spd_uploadeddocuments);
        Assert.Equal(100000004, updatedApp.spd_businesstype);
        Assert.Equal(100000000, updatedApp.spd_nologoorbranding);
        Assert.Equal(100000000, updatedApp.spd_requestdogs);
        Assert.Equal(cmd.AgreeToCompleteAndAccurate, updatedApp.spd_declaration);
        Assert.Equal(account.address1_line1, app.spd_addressline1);
        Assert.Equal(account.address1_line2, app.spd_addressline2);
        Assert.Equal(account.address1_city, app.spd_city);
        Assert.Equal(account.address1_stateorprovince, app.spd_province);
        Assert.Equal(account.address1_country, app.spd_country);
        Assert.Equal(account.address1_postalcode, app.spd_postalcode);
        Assert.Equal(account.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(account.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(account.address2_city, app.spd_residentialcity);
        Assert.Equal(account.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(account.address2_country, app.spd_residentialcountry);
        Assert.Equal(account.address2_postalcode, app.spd_residentialpostalcode);
        Assert.NotNull(updatedApp.spd_declarationdate);
        Assert.NotNull(updatedApp.spd_origin);
        Assert.NotNull(updatedApp.spd_payer);
        Assert.NotNull(updatedApp.spd_portalmodifiedon);
        Assert.NotNull(updatedApp.spd_ServiceTypeId);
        Assert.NotEmpty(updatedApp.spd_application_spd_licencecategory);
        Assert.NotEmpty(app.spd_businesscontact_spd_application);
        Assert.NotEmpty(newBizContact.spd_position_spd_businesscontact);

        //Innihilate
        _context.DeleteLink(position, nameof(spd_businesscontact.spd_position_spd_businesscontact), bizContact);
        _context.DeleteObject(account);
        _context.DeleteObject(bizContact);
        _context.DeleteObject(newBizContact);

        // Remove all links to the application before removing it
        foreach (var appCategory in updatedApp.spd_application_spd_licencecategory)
            _context.DeleteLink(updatedApp, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        await _context.SaveChangesAsync();

        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .FirstOrDefault();

        _context.DeleteObject(appToRemove);
        await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task SaveBizLicApplicationAsync_UpdateExistingPrivateInvestigator_Run_Correctly()
    {
        // Arrange
        PrivateInvestigatorSwlContactInfo privateInvestigator = new()
        {
            BizContactId = Guid.NewGuid(),
            GivenName = "InvestigatorGivenName",
            Surname = "InvestigatorSurname"
        };

        SaveBizLicApplicationCmd cmd = fixture.Build<SaveBizLicApplicationCmd>()
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.StudyPermit, UploadedDocumentEnum.Fingerprint })
            .With(a => a.HasExpiredLicence, false)
            .With(a => a.BizTypeCode, BizTypeEnum.Corporation)
            .With(a => a.NoBranding, false)
            .With(a => a.UseDogs, false)
            .With(a => a.PrivateInvestigatorSwlInfo, privateInvestigator)
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.PrivateInvestigator })
            .With(a => a.AgreeToCompleteAndAccurate, true)
            .Create();

        spd_application? app = new() { spd_applicationid = cmd.LicenceAppId, statecode = DynamicsConstants.StateCode_Active };
        _context.AddTospd_applications(app);
        spd_businesscontact bizContact = new()
        {
            spd_businesscontactid = privateInvestigator.BizContactId,
            spd_firstname = "test",
            spd_surname = "test",
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), app);
        account account = new()
        {
            accountid = cmd.ApplicantId,
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddToaccounts(account);
        await _context.SaveChangesAsync();

        // Action
        BizLicApplicationCmdResp? resp = await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? updatedApp = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_businesscontact_spd_application)
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();

        spd_businesscontact? newBizContact = _context.spd_businesscontacts
            .Expand(b => b.spd_position_spd_businesscontact)
            .OrderByDescending(b => b.createdon)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(resp);
        Assert.NotNull(newBizContact);
        Assert.Equal(cmd.GivenName, updatedApp.spd_firstname);
        Assert.Equal(cmd.Surname, updatedApp.spd_lastname);
        Assert.Equal(cmd.MiddleName1, updatedApp.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, updatedApp.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, updatedApp.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, updatedApp.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, updatedApp.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, updatedApp.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, updatedApp.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, updatedApp.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, updatedApp.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, updatedApp.spd_businessmanagerphone);
        Assert.Equal("100000000,100000001", updatedApp.spd_uploadeddocuments);
        Assert.Equal(100000004, updatedApp.spd_businesstype);
        Assert.Equal(100000000, updatedApp.spd_nologoorbranding);
        Assert.Equal(100000000, updatedApp.spd_requestdogs);
        Assert.Equal(cmd.AgreeToCompleteAndAccurate, updatedApp.spd_declaration);
        Assert.Equal(account.address1_line1, app.spd_addressline1);
        Assert.Equal(account.address1_line2, app.spd_addressline2);
        Assert.Equal(account.address1_city, app.spd_city);
        Assert.Equal(account.address1_stateorprovince, app.spd_province);
        Assert.Equal(account.address1_country, app.spd_country);
        Assert.Equal(account.address1_postalcode, app.spd_postalcode);
        Assert.Equal(account.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(account.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(account.address2_city, app.spd_residentialcity);
        Assert.Equal(account.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(account.address2_country, app.spd_residentialcountry);
        Assert.Equal(account.address2_postalcode, app.spd_residentialpostalcode);
        Assert.NotNull(updatedApp.spd_declarationdate);
        Assert.NotNull(updatedApp.spd_origin);
        Assert.NotNull(updatedApp.spd_payer);
        Assert.NotNull(updatedApp.spd_portalmodifiedon);
        Assert.NotNull(updatedApp.spd_ServiceTypeId);
        Assert.NotEmpty(updatedApp.spd_application_spd_licencecategory);
        Assert.NotEmpty(app.spd_businesscontact_spd_application);

        //Innihilate


        // Remove all links to the application before removing it
        _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), null);

        foreach (var appCategory in updatedApp.spd_application_spd_licencecategory)
            _context.DeleteLink(updatedApp, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        _context.DeleteLink(bizContact, nameof(spd_application.spd_businesscontact_spd_application), updatedApp);
        _context.SetLink(updatedApp, nameof(updatedApp.spd_OrganizationId), null);

        await _context.SaveChangesAsync();
        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == resp.LicenceAppId)
            .FirstOrDefault();
        spd_businesscontact? bizContactToRemove = _context.spd_businesscontacts
           .Where(b => b.spd_businesscontactid == newBizContact.spd_businesscontactid)
         .OrderByDescending(b => b.createdon)
         .FirstOrDefault();
        account accountToRemove = _context.accounts.Where(a => a.accountid == account.accountid).FirstOrDefault();
        _context.DeleteObject(bizContactToRemove);
        _context.DeleteObject(appToRemove);
        await _context.SaveChangesAsync();
        _context.DeleteObject(accountToRemove);
        await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task SaveBizLicApplicationAsync_ApplicationNotFound_Throw_Exception()
    {
        // Arrange
        SaveBizLicApplicationCmd cmd = new() { LicenceAppId = Guid.NewGuid() };

        // Act and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None));
    }

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task CreateBizLicApplicationAsync_Run_Correctly()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        account biz = new()
        {
            accountid = bizId,
            name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}",
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddToaccounts(biz);

        Guid originalLicenceId = Guid.NewGuid();
        spd_licence originalLicence = new();
        originalLicence.spd_licenceid = originalLicenceId;
        _context.AddTospd_licences(originalLicence);

        Guid latestApplicationId = Guid.NewGuid();
        spd_application originalApp = new();
        originalApp.spd_applicationid = latestApplicationId;
        originalApp.spd_businesstype = (int?)BizTypeOptionSet.Corporation;

        _context.AddTospd_applications(originalApp);
        _context.SetLink(originalApp, nameof(originalApp.spd_ApplicantId_account), biz);
        await _context.SaveChangesAsync();

        CreateBizLicApplicationCmd cmd = fixture.Build<CreateBizLicApplicationCmd>()
            .With(a => a.ApplicationTypeCode, ApplicationTypeEnum.Renewal)
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.WorkPermit })
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.SecurityAlarmSales })
            .With(a => a.OriginalApplicationId, latestApplicationId)
            .With(a => a.OriginalLicenceId, originalLicenceId)
            .Create();

        // Action
        var result = await _bizLicAppRepository.CreateBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? app = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Where(a => a.spd_applicationid == result.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(cmd.GivenName, app.spd_firstname);
        Assert.Equal(cmd.Surname, app.spd_lastname);
        Assert.Equal(cmd.MiddleName1, app.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, app.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, app.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, app.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, app.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, app.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, app.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, app.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, app.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, app.spd_businessmanagerphone);
        Assert.Equal("100000002", app.spd_uploadeddocuments);
        Assert.Equal(biz.address1_line1, app.spd_addressline1);
        Assert.Equal(biz.address1_line2, app.spd_addressline2);
        Assert.Equal(biz.address1_city, app.spd_city);
        Assert.Equal(biz.address1_stateorprovince, app.spd_province);
        Assert.Equal(biz.address1_country, app.spd_country);
        Assert.Equal(biz.address1_postalcode, app.spd_postalcode);
        Assert.Equal(biz.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(biz.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(biz.address2_city, app.spd_residentialcity);
        Assert.Equal(biz.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(biz.address2_country, app.spd_residentialcountry);
        Assert.Equal(biz.address2_postalcode, app.spd_residentialpostalcode);
        Assert.Equal(originalApp.spd_businesstype, app.spd_businesstype);
        Assert.NotNull(app.spd_CurrentExpiredLicenceId);
        Assert.NotEmpty(app.spd_application_spd_licencecategory);

        // Annihilate
        _context.DeleteObject(originalLicence);
        _context.DeleteObject(biz);

        // Remove all links to the application before removing it
        _context.SetLink(originalApp, nameof(originalApp.spd_ApplicantId_account), null);
        _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        foreach (var appCategory in app.spd_application_spd_licencecategory)
            _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        await _context.SaveChangesAsync();

        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == result.LicenceAppId)
            .FirstOrDefault();
        _context.DeleteObject(appToRemove);

        spd_application? originalAppToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == latestApplicationId)
            .FirstOrDefault();
        _context.DeleteObject(originalAppToRemove);

        await _context.SaveChangesAsync();
    } */

    /*** TODO: Adjust verification according to ticket SPDBT-2796
    [Fact]
    public async Task CreateBizLicApplicationAsync_WithNewPrivateInvestigator_Run_Correctly()
    {
    // it can't be done now, as it is not possible to create an incident and assign it to the license directly.
        // Arrange
        Guid bizId = Guid.NewGuid();
        account biz = new()
        {
            accountid = bizId,
            name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}",
            address1_line1 = "MailingAddressLine1",
            address1_line2 = "MailingAddressLine2",
            address1_city = "MailingAddressCity",
            address1_stateorprovince = "MailingAddressProvince",
            address1_country = "MailingAddressCountry",
            address1_postalcode = "abc123",
            address2_line1 = "ResidentialAddressLine1",
            address2_line2 = "ResidentialAddressLine2",
            address2_city = "ResidentialAddressCity",
            address2_stateorprovince = "ResidentialAddressProvince",
            address2_country = "ResidentialAddressCountry",
            address2_postalcode = "xyz789",
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddToaccounts(biz);

        Guid originalApplicationId = Guid.NewGuid();
        spd_application originalApp = new();
        originalApp.spd_applicationid = originalApplicationId;
        originalApp.spd_businesstype = (int?)BizTypeOptionSet.Corporation;

        _context.AddTospd_applications(originalApp);
        _context.SetLink(originalApp, nameof(originalApp.spd_ApplicantId_account), biz);
        contact contact = new() { contactid = Guid.NewGuid(), firstname = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}", emailaddress1 = "test@test.com" };
        _context.AddTocontacts(contact);
        await _context.SaveChangesAsync();

        var incidentId = Guid.NewGuid();
        incident incident = new();
        incident.incidentid = incidentId;

        _context.AddToincidents(incident);
        spd_servicetype? servicetype = _context.LookupServiceType(ServiceTypeEnum.SecurityWorkerLicence.ToString());
        _context.SetLink(incident, nameof(incident.spd_ServiceTypeId), servicetype);
        _context.SetLink(incident, nameof(incident.customerid_contact), contact);
        _context.SetLink(incident, nameof(incident.spd_ApplicationId), originalApp);
        await _context.SaveChangesAsync();

        spd_licence licence = new()
        {
            spd_licenceid = Guid.NewGuid(),
            statecode = DynamicsConstants.StateCode_Active,
            spd_nameonlicence = "test",
            spd_licencenumber = "XTAXYSQX6J",
            spd_expirydate = DateTime.UtcNow,
        };
        _context.AddTospd_licences(licence);
        _context.SetLink(licence, nameof(licence.spd_LicenceHolder_contact), contact);
        _context.SetLink(licence, nameof(licence.spd_CaseId), incident);
        _context.SetLink(licence, nameof(licence.spd_LicenceType), servicetype);
        await _context.SaveChangesAsync();

        PrivateInvestigatorSwlContactInfo privateInvestigator = new()
        {
            ApplicantId = contact.contactid,
            GivenName = "InvestigatorGivenName",
            Surname = "InvestigatorSurname",
            LicenceId = licence.spd_licenceid
        };

        CreateBizLicApplicationCmd cmd = fixture.Build<CreateBizLicApplicationCmd>()
            .With(a => a.ApplicationTypeCode, ApplicationTypeEnum.Renewal)
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.ManagerGivenName, IntegrationTestSetup.DataPrefix + "ManagerGiveName")
            .With(a => a.ManagerSurname, IntegrationTestSetup.DataPrefix + "ManagerSurname")
            .With(a => a.ManagerMiddleName1, IntegrationTestSetup.DataPrefix + "ManagerMiddleName1")
            .With(a => a.ManagerMiddleName2, IntegrationTestSetup.DataPrefix + "ManagerMiddleName2")
            .With(a => a.ManagerPhoneNumber, "1234567")
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.WorkPermit })
            .With(a => a.CategoryCodes, new List<WorkerCategoryTypeEnum>() { WorkerCategoryTypeEnum.PrivateInvestigator })
            .With(a => a.OriginalApplicationId, originalApplicationId)
            .With(a => a.PrivateInvestigatorSwlInfo, privateInvestigator)
            .Without(a => a.OriginalLicenceId)
            .Create();

        // Action
        var result = await _bizLicAppRepository.CreateBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? app = _context.spd_applications
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_businesscontact_spd_application)
            .Where(a => a.spd_applicationid == result.LicenceAppId)
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();

        spd_businesscontact? bizContact = _context.spd_businesscontacts
            .Expand(b => b.spd_position_spd_businesscontact)
            .OrderByDescending(b => b.createdon)
            .FirstOrDefault();

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(bizContact);
        Assert.Equal(cmd.GivenName, app.spd_firstname);
        Assert.Equal(cmd.Surname, app.spd_lastname);
        Assert.Equal(cmd.MiddleName1, app.spd_middlename1);
        Assert.Equal(cmd.MiddleName2, app.spd_middlename2);
        Assert.Equal(cmd.EmailAddress, app.spd_emailaddress1);
        Assert.Equal(cmd.PhoneNumber, app.spd_phonenumber);
        Assert.Equal(cmd.ManagerGivenName, app.spd_businessmanagerfirstname);
        Assert.Equal(cmd.ManagerSurname, app.spd_businessmanagersurname);
        Assert.Equal(cmd.ManagerMiddleName1, app.spd_businessmanagermiddlename1);
        Assert.Equal(cmd.ManagerMiddleName2, app.spd_businessmanagermiddlename2);
        Assert.Equal(cmd.ManagerEmailAddress, app.spd_businessmanageremail);
        Assert.Equal(cmd.ManagerPhoneNumber, app.spd_businessmanagerphone);
        Assert.Equal("100000002", app.spd_uploadeddocuments);
        Assert.Equal(biz.address1_line1, app.spd_addressline1);
        Assert.Equal(biz.address1_line2, app.spd_addressline2);
        Assert.Equal(biz.address1_city, app.spd_city);
        Assert.Equal(biz.address1_stateorprovince, app.spd_province);
        Assert.Equal(biz.address1_country, app.spd_country);
        Assert.Equal(biz.address1_postalcode, app.spd_postalcode);
        Assert.Equal(biz.address2_line1, app.spd_residentialaddress1);
        Assert.Equal(biz.address2_line2, app.spd_residentialaddress2);
        Assert.Equal(biz.address2_city, app.spd_residentialcity);
        Assert.Equal(biz.address2_stateorprovince, app.spd_residentialprovince);
        Assert.Equal(biz.address2_country, app.spd_residentialcountry);
        Assert.Equal(biz.address2_postalcode, app.spd_residentialpostalcode);
        Assert.Equal(originalApp.spd_businesstype, app.spd_businesstype);
        Assert.NotEmpty(app.spd_application_spd_licencecategory);
        Assert.NotEmpty(app.spd_businesscontact_spd_application);
        Assert.NotEmpty(bizContact.spd_position_spd_businesscontact);

        // Annihilate
        _context.DeleteObject(bizContact);
        _context.DeleteObject(biz);

        // Remove all links to the application before removing it
        _context.SetLink(originalApp, nameof(originalApp.spd_ApplicantId_account), null);
        _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        foreach (var appCategory in app.spd_application_spd_licencecategory)
            _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
        await _context.SaveChangesAsync();

        spd_application? appToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == result.LicenceAppId)
            .FirstOrDefault();
        _context.DeleteObject(appToRemove);

        spd_application? originalAppToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == originalApplicationId)
            .FirstOrDefault();
        _context.DeleteObject(originalAppToRemove);

        await _context.SaveChangesAsync();
    }
    */

    [Fact]
    public async Task CreateBizLicApplicationAsync_WithWrongApplicationType_Throw_Exception()
    {
        // Arrange
        CreateBizLicApplicationCmd cmd = new() { ApplicationTypeCode = ApplicationTypeEnum.New };

        // Action and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _bizLicAppRepository.CreateBizLicApplicationAsync(cmd, CancellationToken.None));
    }

    [Fact]
    public async Task CreateBizLicApplicationAsync_WithoutOriginalApplicationId_Throw_Exception()
    {
        // Arrange
        CreateBizLicApplicationCmd cmd = new()
        {
            ApplicationTypeCode = ApplicationTypeEnum.Renewal,
        };

        // Action and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _bizLicAppRepository.CreateBizLicApplicationAsync(cmd, CancellationToken.None));
    }

    [Fact]
    public async Task CreateBizLicApplicationAsync_WithoutOriginalApplication_Throw_Exception()
    {
        // Arrange
        CreateBizLicApplicationCmd cmd = new()
        {
            ApplicationTypeCode = ApplicationTypeEnum.Renewal,
            OriginalApplicationId = Guid.NewGuid()
        };

        // Action and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _bizLicAppRepository.CreateBizLicApplicationAsync(cmd, CancellationToken.None));
    }

    [Fact]
    public async Task CreateBizLicApplicationAsync_OriginalApplicationWithoutLinkedAccount_Throw_Exception()
    {
        // Arrange
        Guid latestApplicationId = Guid.NewGuid();
        spd_application originalApp = new();
        originalApp.spd_applicationid = latestApplicationId;

        _context.AddTospd_applications(originalApp);
        await _context.SaveChangesAsync();

        CreateBizLicApplicationCmd cmd = new()
        {
            ApplicationTypeCode = ApplicationTypeEnum.Renewal,
            OriginalApplicationId = latestApplicationId
        };

        // Action and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _bizLicAppRepository.CreateBizLicApplicationAsync(cmd, CancellationToken.None));

        // Annihilate
        spd_application? originalAppToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == latestApplicationId)
            .FirstOrDefault();
        _context.DeleteObject(originalAppToRemove);

        await _context.SaveChangesAsync();
    }

    private async Task<spd_businesscontact> CreateBizContactAsync(account biz, spd_application app, string firstName, BizContactRoleOptionSet role)
    {
        spd_businesscontact bizContact = new();
        bizContact.spd_businesscontactid = Guid.NewGuid();
        bizContact.spd_firstname = IntegrationTestSetup.DataPrefix + firstName;
        bizContact.spd_role = (int)role;
        _context.AddTospd_businesscontacts(bizContact);
        _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), app);
        return bizContact;
    }

}
