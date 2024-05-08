using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Biz;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.IntegrationTest;
public class AddressRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IAddressRepository _addressRepository;
    private DynamicsContext _context;
    private readonly IFixture fixture;

    public AddressRepositoryTest(IntegrationTestSetup testSetup)
    {
        _addressRepository = testSetup.ServiceProvider.GetService<IAddressRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
    }

    [Fact]
    public async Task QueryAsync_Run_Correctly()
    {
        // Arrange
        AddressQry qry = new() { OrganizationId = Guid.Parse("dfa245a8-6a43-ee11-b845-00505683fbf4"), Type = AddressTypeEnum.Branch };

        // Action
        var response = await _addressRepository.QueryAsync(qry, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.NotEmpty(response.Items);
    }

    [Fact]
    public async Task QueryAsync_WithNoFilteringCriteria_Throw_Exception()
    {
        // Arrange
        AddressQry qry = new();

        // Action and Assert
        await Assert.ThrowsAsync<ArgumentException>(async () => await _addressRepository.QueryAsync(qry, CancellationToken.None));
    }

    [Fact]
    public async Task DeleteAddressesAsync_Run_Correctly()
    {
        // Arrange
        spd_address address = new spd_address() 
        { 
            spd_addressid = Guid.NewGuid(), 
            statecode = DynamicsConstants.StateCode_Active, 
            statuscode = DynamicsConstants.StatusCode_Active 
        };

        _context.AddTospd_addresses(address);
        await _context.SaveChangesAsync();

        var addressToDelete = new List<Guid?>() { address.spd_addressid };

        // Act
        await _addressRepository.DeleteAddressesAsync(addressToDelete, CancellationToken.None);

        // Assert
        var deletedAddress = _context.spd_addresses.Where(
            a => a.spd_addressid == address.spd_addressid && 
            a.statecode == DynamicsConstants.StateCode_Inactive &&
            a.statuscode == DynamicsConstants.StatusCode_Inactive)
            .ToList();

        Assert.NotEmpty(deletedAddress);
    }

    [Fact]
    public async Task UpdateAddressesAsync_Run_Correctly()
    {
        // Arrange
        spd_address address = new spd_address()
        {
            spd_addressid = Guid.NewGuid(),
            spd_address1 = "address1",
            spd_address2 = "address2",
            spd_city = "city",
            spd_provincestate = "province",
            spd_postalcode = "abc123",
            spd_country = "Canada",
            spd_branchmanagername = "manager",
            spd_branchphone = "80000000",
            spd_branchemail = "test@test.com",
            statecode = DynamicsConstants.StateCode_Active,
            statuscode = DynamicsConstants.StatusCode_Active
        };

        _context.AddTospd_addresses(address);
        await _context.SaveChangesAsync();

        BranchAddr addressToUpdate = fixture.Build<BranchAddr>()
            .With(a => a.BranchId, address.spd_addressid)
            .With(a => a.BranchPhoneNumber, "90000000")
            .With(a => a.PostalCode, "V7N 5J2")
            .Create();
        UpdateAddressCmd cmd = new() { Addresses = new List<BranchAddr> { addressToUpdate } };

        // Act
        await _addressRepository.UpdateAddressesAsync(cmd, CancellationToken.None);

        // Assert
        spd_address? updatedAddress = _context.spd_addresses.
            Where(a => a.spd_addressid == addressToUpdate.BranchId && 
            a.spd_address1 == addressToUpdate.AddressLine1 &&
            a.spd_address2 == addressToUpdate.AddressLine2 &&
            a.spd_city == addressToUpdate.City &&
            a.spd_country == addressToUpdate.Country &&
            a.spd_branchmanagername == addressToUpdate.BranchManager &&
            a.spd_branchphone == addressToUpdate.BranchPhoneNumber &&
            a.spd_branchemail == addressToUpdate.BranchEmailAddr)
            .FirstOrDefault();

        Assert.NotNull(updatedAddress);
    }
}
