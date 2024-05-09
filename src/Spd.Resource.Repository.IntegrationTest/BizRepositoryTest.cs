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
        // Arrange
        Guid bizId = Guid.NewGuid();
        BizCreateCmd cmd = new() 
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test",
            ServiceTypes = new List<ServiceTypeEnum>() { ServiceTypeEnum.MDRA }
        };

        // Act
        var result = await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

        // Assert
        account? account = await _context.accounts.Expand(a => a.spd_account_spd_servicetype)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();
        Guid? serviceTypeId = _context.LookupServiceType(cmd.ServiceTypes.FirstOrDefault().ToString()).spd_servicetypeid;
        spd_servicetype? serviceType = account.spd_account_spd_servicetype.Where(s => s.spd_servicetypeid == serviceTypeId).FirstOrDefault();

        Assert.NotNull(account);
        Assert.NotNull(serviceType);
        Assert.Equal(cmd.BizGuid.ToString(), account.spd_orgguid);
        Assert.Equal(cmd.BizLegalName, account.spd_organizationlegalname);
        Assert.Equal(cmd.BizName, account.name);

        //Annihilate : When we have delete privilege, we need to do following
        //_context.DeleteObject(account);
        //await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task BizAddServiceTypeAsync_Run_Correctly()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        BizCreateCmd createCmd = new()
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test"
        };
        var biz = await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        BizAddServiceTypeCmd cmd = new(bizId, ServiceTypeEnum.SecurityBusinessLicence);

        // Act
        await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

        // Assert
        account? account = await _context.accounts.Expand(a => a.spd_account_spd_servicetype)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();
        Assert.NotNull(account);
        Assert.Equal(Guid.Parse("86aa9004-4c32-ee11-b845-00505683fbf4"), account.spd_account_spd_servicetype.First().spd_servicetypeid);
    }

    [Fact]
    public async void BizUpdateAsync_Run_Correctly()
    {
        // Arrange
        BranchAddr branchAddress = fixture.Build<BranchAddr>()
            .With(a => a.BranchId, Guid.NewGuid())
            .With(a => a.BranchPhoneNumber, "90000000")
            .With(a => a.PostalCode, "V7N 5J2")
            .Create();

        Addr address = fixture.Build<Addr>()
            .With(a => a.AddressLine1, "address 1")
            .With(a => a.AddressLine1, "address 2")
            .With(a => a.PostalCode, "abc123")
            .Create();
        
        Addr updatedAddress = fixture.Build<Addr>()
            .With(a => a.AddressLine1, "updated address 1")
            .With(a => a.AddressLine1, "updated address 2")
            .With(a => a.PostalCode, "xyz789")
            .Create();

        Guid bizId = Guid.NewGuid();
        BizCreateCmd createCmd = fixture.Build<BizCreateCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MCFD })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "80000000")
            .With(c => c.BCBusinessAddress, address)
            .With(c => c.BusinessAddress, address)
            .With(c => c.MailingAddress, address)
            .Create();

        BizUpdateCmd updateCmd = fixture.Build<BizUpdateCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "updated test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MDRA })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "90000000")
            .With(c => c.BCBusinessAddress, updatedAddress)
            .With(c => c.BusinessAddress, updatedAddress)
            .With(c => c.MailingAddress, updatedAddress)
            .Create();

        // Act
        await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        var result = await _bizRepository.ManageBizAsync(updateCmd, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(updateCmd.Id, result.Id);
        Assert.Equal(updateCmd.Email, result.Email);
        Assert.Equal(updateCmd.BizName, result.BizName);
        Assert.Equal(updateCmd.BizLegalName, result.BizLegalName);
        Assert.Equal(updateCmd.BizGuid, result.BizGuid);
        Assert.Equal(updateCmd.BizType, result.BizType);
        Assert.Equal(updateCmd.PhoneNumber, result.PhoneNumber);
        Assert.Equal(updateCmd.BCBusinessAddress.AddressLine1, result.BCBusinessAddress.AddressLine1);
        Assert.Equal(updateCmd.BCBusinessAddress.AddressLine2, result.BCBusinessAddress.AddressLine2);
        Assert.Equal(updateCmd.BCBusinessAddress.City, result.BCBusinessAddress.City);
        Assert.Equal(updateCmd.BCBusinessAddress.Country, result.BCBusinessAddress.Country);
        Assert.Equal(updateCmd.BCBusinessAddress.Province, result.BCBusinessAddress.Province);
        Assert.Equal(updateCmd.BCBusinessAddress.PostalCode, result.BCBusinessAddress.PostalCode);
        Assert.Equal(updateCmd.BusinessAddress.AddressLine1, result.BusinessAddress.AddressLine1);
        Assert.Equal(updateCmd.BusinessAddress.AddressLine2, result.BusinessAddress.AddressLine2);
        Assert.Equal(updateCmd.BusinessAddress.City, result.BusinessAddress.City);
        Assert.Equal(updateCmd.BusinessAddress.Country, result.BusinessAddress.Country);
        Assert.Equal(updateCmd.BusinessAddress.Province, result.BusinessAddress.Province);
        Assert.Equal(updateCmd.BusinessAddress.PostalCode, result.BusinessAddress.PostalCode);
        Assert.Equal(updateCmd.MailingAddress.AddressLine1, result.MailingAddress.AddressLine1);
        Assert.Equal(updateCmd.MailingAddress.AddressLine2, result.MailingAddress.AddressLine2);
        Assert.Equal(updateCmd.MailingAddress.City, result.MailingAddress.City);
        Assert.Equal(updateCmd.MailingAddress.Country, result.MailingAddress.Country);
        Assert.Equal(updateCmd.MailingAddress.Province, result.MailingAddress.Province);
        Assert.Equal(updateCmd.MailingAddress.PostalCode, result.MailingAddress.PostalCode);
    }
}