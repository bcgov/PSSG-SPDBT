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

    // * TODO finish test
    //[Fact]
    //public async Task CreatePortalUserAsync_Run_Correctly()
    //{
    //    // Arrange
    //    CreatePortalUserCmd cmd = new()
    //    {
    //        PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing,
    //        EmailAddress = "test@test.com",
    //        IdentityId = Guid.NewGuid(),
    //        ContactRoleCode = ContactRoleCode.PrimaryBusinessManager,
    //        OrgId = Guid.NewGuid()
    //    };

    //    // Act
    //    var response = await _portalUserRepo.ManageAsync(cmd, CancellationToken.None);

    //    // Assert
    //    Assert.NotNull(response);
    //    Assert.NotEqual(Guid.Empty, response.Id);
    //    Assert.Equal(cmd.OrgId, response.OrganizationId);

    //    // Annihilate
    //    spd_portaluser? portaluser = _context.spd_portalusers.Where(u => u.spd_portaluserid == response.Id).FirstOrDefault();

    //    _context.DeleteObject(portaluser);
    //    await _context.SaveChangesAsync();
    //}
}