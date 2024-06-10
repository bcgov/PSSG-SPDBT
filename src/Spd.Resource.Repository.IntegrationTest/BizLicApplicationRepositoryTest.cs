using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Licence;
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
    }

    [Fact]
    public async Task GetBizLicApplicationAsync_BizNotFound_Throw_Exception()
    {
        // Act and Assert
        await Assert.ThrowsAsync<ApiException>(async () => await _bizLicAppRepository.GetBizLicApplicationAsync(Guid.NewGuid(), CancellationToken.None));
    }

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
        account account = new() { accountid = cmd.ApplicantId, statecode = DynamicsConstants.StateCode_Active };
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
    }

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
        account account = new() { accountid = cmd.ApplicantId, statecode = DynamicsConstants.StateCode_Active };
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
    }

    [Fact]
    public async Task SaveBizLicApplicationAsync_ApplicationNotFound_Throw_Exception()
    {
        // Arrange
        SaveBizLicApplicationCmd cmd = new() { LicenceAppId = Guid.NewGuid() };

        // Act and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None));
    }
}
