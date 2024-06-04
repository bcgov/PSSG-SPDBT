using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.IntegrationTest;

public class PersonLicApplicationRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IPersonLicApplicationRepository _personLicAppRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public PersonLicApplicationRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

        _personLicAppRepository = testSetup.ServiceProvider.GetRequiredService<IPersonLicApplicationRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Fact]
    public async Task CreateLicenceApplicationAsync_Run_Correctly()
    {
        // Arrange
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

        // Action
        LicenceApplicationCmdResp? resp = await _personLicAppRepository.CreateLicenceApplicationAsync(cmd, CancellationToken.None);

        // Assert
        Assert.NotNull(resp);
        spd_application app = _context.spd_applications.Where(a => a.spd_applicationid == resp.LicenceAppId).FirstOrDefault();
        Assert.Equal("100000000,100000001", app.spd_uploadeddocuments);
        Assert.NotNull(app.spd_portalmodifiedon);
    }

    [Fact]
    public async Task GetLicenceApplicationAsync_Run_Correctly()
    {
        // Arrange
        Guid licenceApplicationId = Guid.NewGuid();
        Guid contactId = Guid.NewGuid();
        spd_application application = new() { spd_applicationid = licenceApplicationId };
        _context.AddTospd_applications(application);
        contact contact = new() { contactid = contactId, firstname = "test", emailaddress1 = "test@test.com" };
        _context.AddTocontacts(contact);
        _context.SetLink(application, nameof(spd_application.spd_ApplicantId_contact), contact);
        await _context.SaveChangesAsync();

        // Action
        LicenceApplicationResp resp = await _personLicAppRepository.GetLicenceApplicationAsync(licenceApplicationId, CancellationToken.None);

        // Assert
        Assert.NotNull(resp);
        Assert.Equal(licenceApplicationId, resp.LicenceAppId);
        Assert.Equal(contactId, resp.ContactId);
        Assert.Equal(contact.firstname, resp.GivenName);
        Assert.Equal(contact.emailaddress1, resp.ContactEmailAddress);
    }

    [Fact]
    public async Task GetLicenceApplicationAsync_ApplicationNotFound_Throw_Exception()
    {
        // Action and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _personLicAppRepository.GetLicenceApplicationAsync(Guid.NewGuid(), CancellationToken.None));
    }

    [Fact]
    public async Task CommitLicenceApplicationAsync_ForApplicant_Run_Correctly()
    {
        // Arrange
        Guid appId = Guid.NewGuid();
        Guid contactId = Guid.NewGuid();
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);
        contact contact = new() { contactid = contactId };
        _context.AddTocontacts(contact);
        _context.SetLink(app, nameof(spd_application.spd_ApplicantId_contact), contact);
        await _context.SaveChangesAsync();

        // Action
        LicenceApplicationCmdResp? resp = await _personLicAppRepository.CommitLicenceApplicationAsync(appId, ApplicationStatusEnum.Submitted, CancellationToken.None);

        //Assert
        Assert.NotNull(resp);
        Assert.Equal(appId, resp.LicenceAppId);
        Assert.Equal(contactId, resp.ContactId);

        // Annihilate
        _context.DeleteObject(app);
        _context.DeleteObject(contact);
        await _context.SaveChangesAsync(CancellationToken.None);
    }

    [Fact]
    public async Task CommitLicenceApplicationAsync_ForBusiness_Run_Correctly()
    {
        // Arrange
        Guid appId = Guid.NewGuid();
        Guid bizId = Guid.NewGuid();
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);
        account account = new() { accountid = bizId };
        _context.AddToaccounts(account);
        _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
        await _context.SaveChangesAsync();

        // Action
        LicenceApplicationCmdResp? resp = await _personLicAppRepository.CommitLicenceApplicationAsync(appId, ApplicationStatusEnum.Submitted, CancellationToken.None);

        //Assert
        Assert.NotNull(resp);
        Assert.Equal(appId, resp.LicenceAppId);
        Assert.Equal(bizId, resp.ContactId);

        // Annihilate
        _context.DeleteObject(app);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync(CancellationToken.None);
    }
}