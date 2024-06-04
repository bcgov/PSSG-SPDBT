using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.LicApp;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class LicAppRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly ILicAppRepository _licAppRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public LicAppRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

        _licAppRepository = testSetup.ServiceProvider.GetRequiredService<ILicAppRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
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
        LicenceApplicationCmdResp? resp = await _licAppRepository.CommitLicenceApplicationAsync(appId, ApplicationStatusEnum.Submitted, CancellationToken.None);

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
        LicenceApplicationCmdResp? resp = await _licAppRepository.CommitLicenceApplicationAsync(appId, ApplicationStatusEnum.Submitted, CancellationToken.None);

        //Assert
        Assert.NotNull(resp);
        Assert.Equal(appId, resp.LicenceAppId);
        Assert.Equal(bizId, resp.BizId);

        // Annihilate
        _context.DeleteObject(app);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync(CancellationToken.None);
    }
}