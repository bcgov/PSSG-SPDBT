using Microsoft.Dynamics.CRM;
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
        spd_licence lic = new();
        lic.spd_licenceid = Guid.NewGuid();
        lic.spd_employercontactname = IntegrationTestSetup.DataPrefix + "employername";
        lic.spd_employeremail = "test@test.com";
        _context.AddTospd_licences(lic);
        await _context.SaveChangesAsync(CancellationToken.None);
        PermitLicence pl = new()
        {
            EmployerName = "newEmployerName",
            SupervisorPhoneNumber = "222222222"
        };
        UpdateLicenceCmd cmd = new(pl, (Guid)lic.spd_licenceid);

        //Action
        var response = await _licRepo.ManageAsync(cmd, CancellationToken.None);

        //Assert
        Assert.NotNull(response);
        Assert.Equal("newEmployerName", response.EmployerName);
    }
}