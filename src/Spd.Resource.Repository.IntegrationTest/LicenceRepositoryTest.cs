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

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task ManageAsync_UpdateLicence_Correctly()
    {
        // Arrange
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

        // Action
        var response = await _licRepo.ManageAsync(cmd, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("newEmployerName", response.EmployerName);

        // Annihilate
        _context.DeleteObject(lic);
        await _context.SaveChangesAsync(CancellationToken.None);
    } */

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task QueryAsync_SwlPermitLicence_Correctly()
    {
        // Arrange
        contact p = new();
        p.firstname = $"{IntegrationTestSetup.DataPrefix}{new Random().Next(1000)}";
        p.contactid = Guid.NewGuid();
        _context.AddTocontacts(p);
        spd_licence lic = new();
        lic.spd_licenceid = Guid.NewGuid();
        lic.spd_licencenumber = $"{IntegrationTestSetup.DataPrefix}{new Random().Next(1000)}";
        _context.AddTospd_licences(lic);
        _context.SetLink(lic, nameof(lic.spd_LicenceHolder_contact), p);
        _context.SetLink(lic, nameof(lic.spd_LicenceType), _context.LookupServiceType(ServiceTypeEnum.BodyArmourPermit.ToString()));
        await _context.SaveChangesAsync(CancellationToken.None);
        LicenceQry q = new() { LicenceId = (Guid)lic.spd_licenceid };

        // Action
        var response = await _licRepo.QueryAsync(q, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(p.firstname, response.Items.First().LicenceHolderFirstName);

        // Annihilate
        _context.DeleteObject(lic);
        _context.DeleteObject(p);
        await _context.SaveChangesAsync(CancellationToken.None);
    } */

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task QueryAsync_BizLicence_Correctly()
    {
        // Arrange
        account biz = new();
        biz.name = $"{IntegrationTestSetup.DataPrefix}-biz-{new Random().Next(1000)}";
        biz.accountid = Guid.NewGuid();
        _context.AddToaccounts(biz);
        spd_licence lic = new();
        lic.spd_licenceid = Guid.NewGuid();
        lic.spd_licencenumber = $"{IntegrationTestSetup.DataPrefix}{new Random().Next(1000)}";
        _context.AddTospd_licences(lic);
        _context.SetLink(lic, nameof(lic.spd_LicenceHolder_account), biz);
        _context.SetLink(lic, nameof(lic.spd_LicenceType), _context.LookupServiceType(ServiceTypeEnum.SecurityBusinessLicence.ToString()));
        await _context.SaveChangesAsync(CancellationToken.None);
        LicenceQry q = new() { LicenceId = (Guid)lic.spd_licenceid };

        // Action
        var response = await _licRepo.QueryAsync(q, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(biz.name, response.Items.First().LicenceHolderFirstName);

        // Annihilate
        _context.DeleteObject(lic);
        _context.DeleteObject(biz);
        await _context.SaveChangesAsync(CancellationToken.None);
    } */

    /*** TODO: Fix test based on problem described in ticket SPDBT-2716
    [Fact]
    public async Task GetAsync_Licence_Correctly()
    {
        // Arrange
        contact p = new();
        p.firstname = $"{IntegrationTestSetup.DataPrefix}{new Random().Next(1000)}";
        p.contactid = Guid.NewGuid();
        _context.AddTocontacts(p);
        spd_licence lic = new();
        lic.spd_licenceid = Guid.NewGuid();
        lic.spd_licencenumber = $"{IntegrationTestSetup.DataPrefix}{new Random().Next(1000)}";
        _context.AddTospd_licences(lic);
        _context.SetLink(lic, nameof(lic.spd_LicenceHolder_contact), p);
        _context.SetLink(lic, nameof(lic.spd_LicenceType), _context.LookupServiceType(ServiceTypeEnum.BodyArmourPermit.ToString()));
        await _context.SaveChangesAsync(CancellationToken.None);

        // Action
        var response = await _licRepo.GetAsync((Guid)lic.spd_licenceid, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(p.firstname, response.LicenceHolderFirstName);

        // Annihilate
        _context.DeleteObject(lic);
        _context.DeleteObject(p);
        await _context.SaveChangesAsync(CancellationToken.None);
    } */

    [Fact]
    public async Task GetAsync_WithNoExistLicence_ReturnNull()
    {
        // Action 
        var response = await _licRepo.GetAsync(Guid.NewGuid(), CancellationToken.None);

        // Assert
        Assert.Null(response);
    }
}