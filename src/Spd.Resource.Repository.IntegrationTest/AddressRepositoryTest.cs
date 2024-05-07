using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Address;
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

    }
}
