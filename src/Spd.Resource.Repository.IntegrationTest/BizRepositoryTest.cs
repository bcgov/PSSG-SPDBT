using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Biz;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;

public class BizRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IBizRepository _bizRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public BizRepositoryTest(IntegrationTestSetup testSetup)
    {
        _bizRepository = testSetup.ServiceProvider.GetService<IBizRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
    }

    [Fact]
    public async Task BizCreateAsync_Run_Correctly()
    {
        //Arrange
        Guid bizId = Guid.NewGuid();
        BizCreateCmd cmd = new(new Spd.Resource.Repository.Biz.Biz
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test"
        });

        //Act
        var result = await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

        //Assert
        account? account = await _context.accounts.Where(c => c.accountid == bizId).FirstOrDefaultAsync();
        Assert.NotNull(account);
        Assert.Equal(cmd.Biz.BizGuid.ToString(), account.spd_orgguid);

        //Annihilate : When we have delete privilege, we need to do following
        //_context.DeleteObject(account);
        //await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task BizAddServiceTypeAsync_Run_Correctly()
    {
        //Arrange
        Guid bizId = Guid.NewGuid();
        BizCreateCmd createCmd = new(new Spd.Resource.Repository.Biz.Biz
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test"
        });
        var biz = await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        BizAddServiceTypeCmd cmd = new(bizId, ServiceTypeEnum.SecurityBusinessLicence);

        //Act
        await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

        //Assert
        account? account = await _context.accounts.Expand(a => a.spd_account_spd_servicetype)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();
        Assert.NotNull(account);
        Assert.Equal(Guid.Parse("86aa9004-4c32-ee11-b845-00505683fbf4"), account.spd_account_spd_servicetype.First().spd_servicetypeid);
    }
}