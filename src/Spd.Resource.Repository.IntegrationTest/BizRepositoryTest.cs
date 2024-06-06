using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Biz;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

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
    public async Task GetBizAsync_Run_Correctly()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        CreateBizCmd cmd = new()
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test",
            BizType = BizTypeEnum.Corporation,
            ServiceTypes = new List<ServiceTypeEnum>() { ServiceTypeEnum.MDRA }
        };

        // Act
        await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);
        var result = await _bizRepository.GetBizAsync(bizId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<BizResult>(result);
    }

    [Fact]
    public async Task GetBizAsync_BizNotFound_Throw_Exception()
    {
        // Act and Assert
        await Assert.ThrowsAsync<ApiException>(async () => await _bizRepository.GetBizAsync(Guid.NewGuid(), CancellationToken.None));
    }

    [Fact]
    public async Task GetBizAsync_BizWithoutServiceType_Throw_Exception()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        CreateBizCmd cmd = new()
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test",
            BizType = BizTypeEnum.Corporation,
            ServiceTypes = new List<ServiceTypeEnum>()
        };

        // Act
        await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ApiException>(async () => await _bizRepository.GetBizAsync(bizId, CancellationToken.None));
    }

    [Fact]
    public async Task CreateBizAsync_Run_Correctly()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        CreateBizCmd cmd = new() 
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test",
            BizType = BizTypeEnum.Corporation,
            ServiceTypes = new List<ServiceTypeEnum>() { ServiceTypeEnum.MDRA }
        };

        // Act
        await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

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
        Assert.Equal(cmd.BizType, SharedMappingFuncs.GetBizTypeEnum(account.spd_licensingbusinesstype));

        //Annihilate : When we have delete privilege, we need to do following
        //_context.DeleteObject(account);
        //await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task AddBizServiceTypeAsync_Run_Correctly()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        CreateBizCmd createCmd = new()
        {
            BizGuid = Guid.NewGuid(),
            Id = bizId,
            BizLegalName = IntegrationTestSetup.DataPrefix + "test"
        };
        var biz = await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        AddBizServiceTypeCmd cmd = new(bizId, ServiceTypeEnum.SecurityBusinessLicence);

        // Act
        await _bizRepository.ManageBizAsync(cmd, CancellationToken.None);

        // Assert
        account? account = await _context.accounts.Expand(a => a.spd_account_spd_servicetype)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();
        Guid? serviceTypeId = _context.LookupServiceType(cmd.ServiceTypeEnum.ToString()).spd_servicetypeid;
        spd_servicetype? serviceType = account.spd_account_spd_servicetype.Where(s => s.spd_servicetypeid == serviceTypeId).FirstOrDefault();

        Assert.NotNull(account);
        Assert.NotNull(serviceType);
    }

    [Fact]
    public async void UpdateBizAsync_Run_Correctly()
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
        Guid newLicenceId = Guid.NewGuid();
        Guid newLicHolderId = Guid.NewGuid();

        CreateBizCmd createCmd = fixture.Build<CreateBizCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MCFD })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "80000000")
            .With(c => c.BCBusinessAddress, address)
            .With(c => c.BusinessAddress, address)
            .With(c => c.MailingAddress, address)
            .Create();

        UpdateBizCmd updateCmd = fixture.Build<UpdateBizCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "updated test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MDRA })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "90000000")
            .With(c => c.BCBusinessAddress, updatedAddress)
            .With(c => c.BusinessAddress, updatedAddress)
            .With(c => c.MailingAddress, updatedAddress)
            .With(c => c.BizType, BizTypeEnum.NonRegisteredSoleProprietor)
            .With(c => c.SoleProprietorSwlContactInfo, new SwlContactInfo()
            {
                LicenceId = newLicenceId
            })
            .Create();

        spd_licence licence = new spd_licence() 
        { 
            spd_licenceid = newLicenceId, 
            statecode = DynamicsConstants.StateCode_Active,
            createdon = DateTime.Now
        };
        _context.AddTospd_licences(licence);
        contact contact = new contact() { contactid = newLicHolderId, statecode = DynamicsConstants.StateCode_Active };
        _context.AddTocontacts(contact);
        _context.SetLink(licence, nameof(licence.spd_LicenceHolder_contact), contact);
        await _context.SaveChangesAsync();

        // Act
        await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        await _bizRepository.ManageBizAsync(updateCmd, CancellationToken.None);

        account? account = await _context.accounts
            .Expand(a => a.spd_account_spd_servicetype)
            .Expand(a => a.spd_organization_spd_licence_soleproprietor)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();

        // Assert
        Assert.NotNull(account);
        Assert.Equal(updateCmd.Id, account.accountid);
        Assert.Equal(updateCmd.Email, account.emailaddress1);
        Assert.Equal(updateCmd.BizName, account.name);
        Assert.Equal(updateCmd.BizLegalName, account.spd_organizationlegalname);
        Assert.Equal(updateCmd.BizGuid.ToString(), account.spd_orgguid);
        Assert.Equal(updateCmd.BizType, SharedMappingFuncs.GetBizTypeEnum(account.spd_licensingbusinesstype));
        Assert.Equal(updateCmd.PhoneNumber, account.telephone1);
        Assert.Equal(updateCmd.BCBusinessAddress.AddressLine1, account.spd_bcbusinessaddressline1);
        Assert.Equal(updateCmd.BCBusinessAddress.AddressLine2, account.spd_bcbusinessaddressline2);
        Assert.Equal(updateCmd.BCBusinessAddress.City, account.spd_bcbusinessaddresscity);
        Assert.Equal(updateCmd.BCBusinessAddress.Country, account.spd_bcbusinessaddresscountry);
        Assert.Equal(updateCmd.BCBusinessAddress.Province, account.spd_bcbusinessaddressprovince);
        Assert.Equal(updateCmd.BCBusinessAddress.PostalCode, account.spd_bcbusinessaddresspostalcode);
        Assert.Equal(updateCmd.BusinessAddress.AddressLine1, account.address2_line1);
        Assert.Equal(updateCmd.BusinessAddress.AddressLine2, account.address2_line2);
        Assert.Equal(updateCmd.BusinessAddress.City, account.address2_city);
        Assert.Equal(updateCmd.BusinessAddress.Country, account.address2_country);
        Assert.Equal(updateCmd.BusinessAddress.Province, account.address2_stateorprovince);
        Assert.Equal(updateCmd.BusinessAddress.PostalCode, account.address2_postalcode);
        Assert.Equal(updateCmd.MailingAddress.AddressLine1, account.address1_line1);
        Assert.Equal(updateCmd.MailingAddress.AddressLine2, account.address1_line2);
        Assert.Equal(updateCmd.MailingAddress.City, account.address1_city);
        Assert.Equal(updateCmd.MailingAddress.Country, account.address1_country);
        Assert.Equal(updateCmd.MailingAddress.Province, account.address1_stateorprovince);
        Assert.Equal(updateCmd.MailingAddress.PostalCode, account.address1_postalcode);
        Assert.Equal(licence.spd_licenceid, account.spd_organization_spd_licence_soleproprietor.FirstOrDefault()?.spd_licenceid);
        Assert.Equal(licence._spd_licenceholder_value, account.spd_organization_spd_licence_soleproprietor.FirstOrDefault()?._spd_licenceholder_value);
    }

    [Fact]
    public async void UpdateBizAsync_BizTypeDifferentFromSoleProprietor_Run_Correctly()
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

        CreateBizCmd createCmd = fixture.Build<CreateBizCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MCFD })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "80000000")
            .With(c => c.BizType, BizTypeEnum.RegisteredSoleProprietor)
            .With(c => c.BCBusinessAddress, address)
            .With(c => c.BusinessAddress, address)
            .With(c => c.MailingAddress, address)
            .Create();

        UpdateBizCmd updateCmd = fixture.Build<UpdateBizCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "updated test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MDRA })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "90000000")
            .With(c => c.Email, "test@test.com")
            .With(c => c.BCBusinessAddress, updatedAddress)
            .With(c => c.BusinessAddress, updatedAddress)
            .With(c => c.MailingAddress, updatedAddress)
            .With(c => c.BizType, BizTypeEnum.Corporation)
            .Without(c => c.SoleProprietorSwlContactInfo)
            .Create();

        // Act
        await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        await _bizRepository.ManageBizAsync(updateCmd, CancellationToken.None);

        account? account = await _context.accounts
            .Expand(a => a.spd_account_spd_servicetype)
            .Expand(a => a.spd_organization_spd_licence_soleproprietor)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();

        // Assert
        Assert.NotNull(account);
        Assert.Null(account.spd_organization_spd_licence_soleproprietor.FirstOrDefault());
        Assert.Equal(updateCmd.Id, account.accountid);
        Assert.Equal(updateCmd.BizName, account.name);
        Assert.Equal(updateCmd.BizLegalName, account.spd_organizationlegalname);
        Assert.Equal(updateCmd.BizGuid.ToString(), account.spd_orgguid);
        Assert.Equal(updateCmd.BizType, SharedMappingFuncs.GetBizTypeEnum(account.spd_licensingbusinesstype));
        Assert.Equal(updateCmd.Email, account.emailaddress1);
        Assert.Equal(updateCmd.PhoneNumber, account.telephone1);
        Assert.Equal(updateCmd.BCBusinessAddress.AddressLine1, account.spd_bcbusinessaddressline1);
        Assert.Equal(updateCmd.BCBusinessAddress.AddressLine2, account.spd_bcbusinessaddressline2);
        Assert.Equal(updateCmd.BCBusinessAddress.City, account.spd_bcbusinessaddresscity);
        Assert.Equal(updateCmd.BCBusinessAddress.Country, account.spd_bcbusinessaddresscountry);
        Assert.Equal(updateCmd.BCBusinessAddress.Province, account.spd_bcbusinessaddressprovince);
        Assert.Equal(updateCmd.BCBusinessAddress.PostalCode, account.spd_bcbusinessaddresspostalcode);
        Assert.Equal(updateCmd.BusinessAddress.AddressLine1, account.address2_line1);
        Assert.Equal(updateCmd.BusinessAddress.AddressLine2, account.address2_line2);
        Assert.Equal(updateCmd.BusinessAddress.City, account.address2_city);
        Assert.Equal(updateCmd.BusinessAddress.Country, account.address2_country);
        Assert.Equal(updateCmd.BusinessAddress.Province, account.address2_stateorprovince);
        Assert.Equal(updateCmd.BusinessAddress.PostalCode, account.address2_postalcode);
        Assert.Equal(updateCmd.MailingAddress.AddressLine1, account.address1_line1);
        Assert.Equal(updateCmd.MailingAddress.AddressLine2, account.address1_line2);
        Assert.Equal(updateCmd.MailingAddress.City, account.address1_city);
        Assert.Equal(updateCmd.MailingAddress.Country, account.address1_country);
        Assert.Equal(updateCmd.MailingAddress.Province, account.address1_stateorprovince);
        Assert.Equal(updateCmd.MailingAddress.PostalCode, account.address1_postalcode);
    }

    [Fact]
    public async void UpdateBizAsync_BizNotFound_Throw_Exception()
    {
        UpdateBizCmd cmd = fixture.Create<UpdateBizCmd>();

        // Act and Assert
        await Assert.ThrowsAsync<ApiException>(async () => await _bizRepository.ManageBizAsync(cmd, CancellationToken.None));
    }

    [Fact]
    public async void UpdateBizServiceTypeAsync_Run_Correctly()
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
        CreateBizCmd createCmd = fixture.Build<CreateBizCmd>()
            .With(c => c.Id, bizId)
            .With(c => c.BizLegalName, IntegrationTestSetup.DataPrefix + "test")
            .With(c => c.ServiceTypes, new List<ServiceTypeEnum>() { ServiceTypeEnum.MCFD })
            .With(c => c.BranchAddresses, new List<BranchAddr>() { branchAddress })
            .With(c => c.PhoneNumber, "80000000")
            .With(c => c.BCBusinessAddress, address)
            .With(c => c.BusinessAddress, address)
            .With(c => c.MailingAddress, address)
            .Create();

        UpdateBizServiceTypeCmd updateServiceTypeCmd = new(bizId, ServiceTypeEnum.PSSO);  

        // Act
        await _bizRepository.ManageBizAsync(createCmd, CancellationToken.None);
        await _bizRepository.ManageBizAsync(updateServiceTypeCmd, CancellationToken.None);

        // Assert
        account? account = await _context.accounts.Expand(a => a.spd_account_spd_servicetype)
            .Where(c => c.accountid == bizId).FirstOrDefaultAsync();
        Guid? serviceTypeId = _context.LookupServiceType(updateServiceTypeCmd.ServiceTypeEnum.ToString()).spd_servicetypeid;
        spd_servicetype? serviceType = account.spd_account_spd_servicetype.Where(s => s.spd_servicetypeid == serviceTypeId).FirstOrDefault();

        Assert.NotNull(account);
        Assert.NotNull(serviceType);
        Assert.Equal(updateServiceTypeCmd.ServiceTypeEnum.ToString(), serviceType.spd_servicetypename);
    }

    [Fact]
    public async void UpdateBizServiceTypeAsync_BizNotFound_Throw_Exception()
    {
        // Arrange
        UpdateBizServiceTypeCmd cmd = new(Guid.NewGuid(), ServiceTypeEnum.PSSO);

        // Act and Assert
        await Assert.ThrowsAsync<ApiException>(async () => await _bizRepository.ManageBizAsync(cmd, CancellationToken.None));
    }
}