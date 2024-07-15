using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.PortalUser;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class PortalUserRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IPortalUserRepository _portalUserRepo;
    private DynamicsContext _context;

    public PortalUserRepositoryTest(IntegrationTestSetup testSetup)
    {
        _portalUserRepo = testSetup.ServiceProvider.GetRequiredService<IPortalUserRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Fact]
    public async Task QueryAsync_Run_Correctly()
    {
        // Arrange
        PortalUserQry qry = new() { OrgId = Guid.Parse("0326f9fd-7043-ee11-b845-00505683fbf4") };

        // Action
        var response = await _portalUserRepo.QueryAsync(qry, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
    }

    [Fact]
    public async Task CreatePortalUserAsync_Run_Correctly()
    {
        // Arrange
        Guid identityId = Guid.NewGuid();
        Guid accountId = Guid.NewGuid();

        spd_identity identity = new spd_identity() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new account() { accountid = accountId };
        _context.AddToaccounts(account);
        _context.SaveChanges();

        CreatePortalUserCmd cmd = new()
        {
            PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing,
            EmailAddress = "test@test.com",
            IdentityId = identityId,
            ContactRoleCode = ContactRoleCode.PrimaryBusinessManager,
            OrgId = accountId
        };

        // Act
        var response = await _portalUserRepo.ManageAsync(cmd, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal(cmd.OrgId, response.OrganizationId);
        Assert.Equal(ContactRoleCode.PrimaryBusinessManager, response.ContactRoleCode);
        
        // Annihilate
        spd_portaluser? portalUser = _context.spd_portalusers.Where(u => u.spd_portaluserid == response.Id).FirstOrDefault();

        _context.SetLink(portalUser, nameof(portalUser.spd_OrganizationId), null);
        _context.SetLink(portalUser, nameof(portalUser.spd_IdentityId), null);

        _context.DeleteObject(identity);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync();

        spd_portaluser? portalUserToRemove = _context.spd_portalusers.Where(u => u.spd_portaluserid == response.Id).FirstOrDefault();

        _context.DeleteObject(portalUserToRemove);
        await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task UpdatePortalUserAsync_Run_Correctly()
    {
        // Arrange
        Guid identityId = Guid.NewGuid();
        Guid accountId = Guid.NewGuid();
        Guid bizContactId = Guid.NewGuid();

        spd_identity identity = new spd_identity() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new account() { accountid = accountId };
        _context.AddToaccounts(account);
        spd_businesscontact businessContact = new spd_businesscontact() { spd_businesscontactid = bizContactId };
        _context.AddTospd_businesscontacts(businessContact);
        _context.SaveChanges();

        UpdatePortalUserCmd cmd = new()
        {
            FirstName = IntegrationTestSetup.DataPrefix + "firstName",
            LastName = IntegrationTestSetup.DataPrefix + "lastName",
            EmailAddress = "test@test.com",
            IdentityId = identityId,
            ContactRoleCode = ContactRoleCode.BusinessManager,
            OrgId = accountId
        };

        // Act
        var response = await _portalUserRepo.ManageAsync(cmd, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal(cmd.OrgId, response.OrganizationId);
        Assert.Equal(response.ContactRoleCode, ContactRoleCode.BusinessManager);

        // Annihilate
        spd_portaluser? portalUser = _context.spd_portalusers.Where(u => u.spd_portaluserid == response.Id).FirstOrDefault();

        _context.SetLink(portalUser, nameof(portalUser.spd_OrganizationId), null);
        _context.SetLink(portalUser, nameof(portalUser.spd_IdentityId), null);

        _context.DeleteObject(identity);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync();

        spd_portaluser? portalUserToRemove = _context.spd_portalusers.Where(u => u.spd_portaluserid == response.Id).FirstOrDefault();

        _context.DeleteObject(portalUserToRemove);
        await _context.SaveChangesAsync();
    }
}