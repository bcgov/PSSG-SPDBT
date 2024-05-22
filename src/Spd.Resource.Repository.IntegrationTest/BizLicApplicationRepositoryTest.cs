using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Dynamics;

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
    public async Task SaveBizLicApplicationAsync_WithoutLicenceAppId_Run_Correctly()
    {
        // Arrange
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
            .Without(a => a.LicenceAppId)
            .Without(a => a.ApplicantId)
            .Create();

        // Action
        BizLicApplicationCmdResp? resp = await _bizLicAppRepository.SaveBizLicApplicationAsync(cmd, CancellationToken.None);
        spd_application? app = _context.spd_applications
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
        Assert.NotNull(app.spd_origin);
        Assert.NotNull(app.spd_payer);
        Assert.NotNull(app.spd_portalmodifiedon);
    }
}
