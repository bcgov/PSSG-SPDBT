using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class OrgRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IOrgRepository _orgRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public OrgRepositoryTest(IntegrationTestSetup testSetup)
    {
        _orgRepository = testSetup.ServiceProvider.GetService<IOrgRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
    }

    [Fact]
    public async Task OrgGuidUpdateAsync_Run_Correctly()
    {
        //Arrange
        Guid orgId = Guid.NewGuid();
        account org = new()
        {
            accountid = orgId,
            spd_orgguid = null,
            name = IntegrationTestSetup.DataPrefix + "test",
        };

        _context.AddToaccounts(org);
        _context.SaveChanges();

        //Act
        Guid orgGuid = Guid.NewGuid();
        await _orgRepository.ManageOrgAsync(new OrgGuidUpdateCmd(orgId, orgGuid.ToString()), CancellationToken.None);

        //Assert
        account? account = await _context.accounts.Where(c => c.accountid == orgId).FirstOrDefaultAsync();
        Assert.NotNull(account);
        Assert.Equal(orgGuid.ToString(), account.spd_orgguid);

        //Annihilate : When we have delete privilege, we need to do following
        //_context.DeleteObject(org);
        //await _context.SaveChangesAsync();
    }
}