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

    
}