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
    public async Task QueryAsync_ListUsersAsync_Run_Correctly()
    {
        // Arrange
        Guid identityId = Guid.NewGuid();
        Guid accountId = Guid.NewGuid();
        Guid portalUserId = Guid.NewGuid();

        spd_identity identity = new() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        spd_portaluser portalUser = new()
        {
            spd_OrganizationId = account,
            spd_IdentityId = identity,
            spd_portaluserid = portalUserId,
            spd_lastloggedin = DateTimeOffset.UtcNow.AddDays(-1)
        };

        _context.AddTospd_portalusers(portalUser);
        _context.SaveChanges();
        PortalUserQry qry = new() { OrgId = accountId };

        // Action
        var response = await _portalUserRepo.QueryAsync(qry, CancellationToken.None);
        // Assert
        Assert.IsType<PortalUserListResp>(response);
        Assert.NotNull(response);
        // Annihilate
        spd_portaluser? updatedPortalUser = _context.spd_portalusers.Where(u => u.spd_portaluserid == portalUserId).FirstOrDefault();

        _context.SetLink(portalUser, nameof(portalUser.spd_OrganizationId), null);
        _context.SetLink(portalUser, nameof(portalUser.spd_IdentityId), null);

        _context.DeleteObject(identity);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync();

        spd_portaluser? portalUserToRemove = _context.spd_portalusers.Where(u => u.spd_portaluserid == portalUserId).FirstOrDefault();

        _context.DeleteObject(portalUserToRemove);
        await _context.SaveChangesAsync();
    }
    [Fact]
    public async Task QueryAsync_GetUserAsync_Run_Correctly()
    {
        // Arrange
        Guid identityId = Guid.NewGuid();
        Guid accountId = Guid.NewGuid();
        Guid portalUserId = Guid.NewGuid();

        spd_identity identity = new() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        spd_portaluser portalUser = new()
        {
            spd_OrganizationId = account,
            spd_IdentityId = identity,
            spd_portaluserid = portalUserId,
            spd_lastloggedin = DateTimeOffset.UtcNow.AddDays(-1)
        };

        _context.AddTospd_portalusers(portalUser);
        _context.SaveChanges();

        PortalUserByIdQry qry = new(portalUserId);
        // Action
        var response = await _portalUserRepo.QueryAsync(qry, CancellationToken.None);
        // Assert
        Assert.IsType<PortalUserResp>(response);
        var result = (PortalUserResp)response;
        Assert.Equal(result.Id, portalUserId);

        // Annihilate
        spd_portaluser? updatedPortalUser = _context.spd_portalusers.Where(u => u.spd_portaluserid == result.Id).FirstOrDefault();

        _context.SetLink(portalUser, nameof(portalUser.spd_OrganizationId), null);
        _context.SetLink(portalUser, nameof(portalUser.spd_IdentityId), null);

        _context.DeleteObject(identity);
        _context.DeleteObject(account);
        await _context.SaveChangesAsync();

        spd_portaluser? portalUserToRemove = _context.spd_portalusers.Where(u => u.spd_portaluserid == result.Id).FirstOrDefault();

        _context.DeleteObject(portalUserToRemove);
        await _context.SaveChangesAsync();
    }
    [Fact]
    public async Task CreatePortalUserAsync_Run_Correctly()
    {
        // Arrange
        Guid identityId = Guid.NewGuid();
        Guid accountId = Guid.NewGuid();

        spd_identity identity = new() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        _context.SaveChanges();

        CreatePortalUserCmd cmd = new()
        {
            PortalUserServiceCategory = PortalUserServiceCategory.Licensing,
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
        Guid portalUserId = Guid.NewGuid();

        spd_identity identity = new() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        spd_portaluser portalUser = new() { spd_portaluserid = portalUserId };
        _context.AddTospd_portalusers(portalUser);
        _context.SaveChanges();

        UpdatePortalUserCmd cmd = new()
        {
            Id = portalUserId,
            OrgId = accountId,
            FirstName = IntegrationTestSetup.DataPrefix + "firstName",
            LastName = IntegrationTestSetup.DataPrefix + "lastName",
            EmailAddress = "test@test.com",
            IdentityId = identityId,
            ContactRoleCode = ContactRoleCode.BusinessManager,
            PhoneNumber = "8002223333"
        };

        // Act
        var response = await _portalUserRepo.ManageAsync(cmd, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(cmd.Id, response.Id);
        Assert.Equal(cmd.OrgId, response.OrganizationId);
        Assert.Equal(cmd.FirstName, response.FirstName);
        Assert.Equal(cmd.LastName, response.LastName);
        Assert.Equal(cmd.EmailAddress, response.UserEmail);
        Assert.Equal(ContactRoleCode.BusinessManager, response.ContactRoleCode);
        Assert.Equal(cmd.PhoneNumber, response.PhoneNumber);

        // Annihilate
        spd_portaluser? updatedPortalUser = _context.spd_portalusers.Where(u => u.spd_portaluserid == response.Id).FirstOrDefault();

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
    public async Task DeletePortalUserAsync_With_spd_identityid_Run_Correctly()
    {
        // Arrange
        Guid identityId = Guid.NewGuid();
        Guid accountId = Guid.NewGuid();

        spd_identity identity = new() { spd_identityid = identityId };
        _context.AddTospd_identities(identity);
        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        _context.SaveChanges();

        CreatePortalUserCmd createCmd = new()
        {
            PortalUserServiceCategory = PortalUserServiceCategory.Licensing,
            EmailAddress = "test@test.com",
            IdentityId = identityId,
            ContactRoleCode = ContactRoleCode.PrimaryBusinessManager,
            OrgId = accountId
        };

        var createdUser = await _portalUserRepo.ManageAsync(createCmd, CancellationToken.None);
        //TODO: here I tried to create an invitation, but it is not working (is null at the end)
        spd_portalinvitation invitation = new()
        {
            _spd_portaluserid_value = createdUser.Id
        };
        _context.AddTospd_portalinvitations(invitation);
        _context.SaveChanges();

        //Act
        PortalUserDeleteCmd cmd = new(createdUser.Id);
        var result = await _portalUserRepo.ManageAsync(cmd, CancellationToken.None);

        // Assert
        var deletedUser = await _context.GetUserById(createdUser.Id, CancellationToken.None);
        Assert.NotNull(deletedUser);
        Assert.Equal(deletedUser.statecode, DynamicsConstants.StateCode_Inactive);
        Assert.Equal(deletedUser.statuscode, DynamicsConstants.StatusCode_Inactive);

        // Annihilate
        spd_portaluser? updatedPortalUser = _context.spd_portalusers.Where(u => u.spd_portaluserid == deletedUser.spd_portaluserid).FirstOrDefault();

        _context.SetLink(updatedPortalUser, nameof(updatedPortalUser.spd_OrganizationId), null);
        _context.SetLink(updatedPortalUser, nameof(updatedPortalUser.spd_IdentityId), null);

        _context.DeleteObject(identity);
        _context.DeleteObject(account);
        _context.DeleteObject(invitation);
        await _context.SaveChangesAsync();

        spd_portaluser? portalUserToRemove = _context.spd_portalusers.Where(u => u.spd_portaluserid == deletedUser.spd_portaluserid).FirstOrDefault();

        _context.DeleteObject(portalUserToRemove);
        await _context.SaveChangesAsync();

    }
    [Fact]
    public async Task DeletePortalUserAsync_Without_spd_identityid_Run_Correctly()
    {
        // Arrange
        Guid accountId = Guid.NewGuid();

        account account = new() { accountid = accountId };
        _context.AddToaccounts(account);
        _context.SaveChanges();

        CreatePortalUserCmd createCmd = new()
        {
            PortalUserServiceCategory = PortalUserServiceCategory.Licensing,
            EmailAddress = "test@test.com",
            ContactRoleCode = ContactRoleCode.PrimaryBusinessManager,
            OrgId = accountId
        };

        var createdUser = await _portalUserRepo.ManageAsync(createCmd, CancellationToken.None);

        spd_portalinvitation invitation = new()
        {
            _spd_portaluserid_value = createdUser.Id
        };
        _context.AddTospd_portalinvitations(invitation);
        _context.SaveChanges();

        PortalUserDeleteCmd cmd = new(createdUser.Id);

        //Act
        var result = await _portalUserRepo.ManageAsync(cmd, CancellationToken.None);
        // Assert
        spd_portaluser? deletedUser = null;
        spd_portalinvitation? deletedInvitation = null;

        try
        {
            deletedUser = await _context.spd_portalusers
                .Where(u => u.spd_portaluserid == createdUser.Id)
                .FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {

        }
        try
        {
            deletedInvitation = await _context.spd_portalinvitations
                .Where(a => a._spd_portaluserid_value == createdUser.Id)
                .FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {

        }

        Assert.Null(deletedUser); // Ensure the user is deleted
        Assert.Null(deletedInvitation);


        // Annihilate
        if (deletedUser is not null)
        {
            _context.SetLink(deletedUser, nameof(deletedUser.spd_OrganizationId), null);
            _context.SetLink(deletedUser, nameof(deletedUser.spd_IdentityId), null);
            _context.DeleteObject(deletedUser);

        }
        _context.DeleteObject(account);
        await _context.SaveChangesAsync();
    }
}