using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class LicenceApplicationRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly ILicenceApplicationRepository _licAppRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public LicenceApplicationRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

        _licAppRepository = testSetup.ServiceProvider.GetRequiredService<ILicenceApplicationRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Fact]
    public async Task CreateLicenceApplicationAsync_Run_Correctly()
    {
        //Arrange
        CreateLicenceApplicationCmd cmd = fixture.Build<CreateLicenceApplicationCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.ContactPhoneNumber, "1234567")
            .With(a => a.SupervisorPhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.EmployerPrimaryAddress, fixture.Build<Addr>().With(a => a.PostalCode, "V7N 5J2").Create())
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>().With(a => a.PostalCode, "V9N 5J2").Create())
            .With(a => a.MailingAddressData, fixture.Build<MailingAddr>().With(a => a.PostalCode, "V9N 5J2").Create())
            .With(a => a.Aliases, new List<AliasResp> { new() { Surname = "surname", GivenName = "givenname" } })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.StudyPermit, UploadedDocumentEnum.Fingerprint })
            .Create();

        //Action
        LicenceApplicationCmdResp? resp = await _licAppRepository.CreateLicenceApplicationAsync(cmd, CancellationToken.None);

        //Assert
        Assert.NotNull(resp);
        spd_application app = _context.spd_applications.Where(a => a.spd_applicationid == resp.LicenceAppId).FirstOrDefault();
        Assert.Equal("100000000,100000001", app.spd_uploadeddocuments);
        Assert.NotNull(app.spd_portalmodifiedon);
    }
}