using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class LicenceRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly ILicenceRepository _licRepo;
    private DynamicsContext _context;

    public LicenceRepositoryTest(IntegrationTestSetup testSetup)
    {
        _licRepo = testSetup.ServiceProvider.GetRequiredService<ILicenceRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }

    [Fact]
    public async Task ManageAsync_UpdateLicence_Correctly()
    {
        //Arrange
        // PortalUserQry qry = new() { OrgId = Guid.Parse("0326f9fd-7043-ee11-b845-00505683fbf4") };

        //Action
        // var response = await _licRepo.QueryAsync(qry, CancellationToken.None);

        //Assert
        //Assert.NotNull(response);
    }
}