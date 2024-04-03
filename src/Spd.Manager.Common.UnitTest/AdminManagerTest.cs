using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Manager.Common.Admin;
using Spd.Resource.Repository.Config;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Address;

namespace Spd.Manager.Common.UnitTest;

public class AdminManagerTest
{
    private readonly IFixture fixture;
    private Mock<IAddressAutocompleteClient> mockAddressClient = new();
    private Mock<IConfigRepository> mockConfigRepo = new();
    private Mock<IOrgRepository> mockOrgRepo = new();
    private Mock<IMapper> mockMapper = new();
    private AdminManager sut;

    public AdminManagerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        sut = new AdminManager(mockAddressClient.Object, mockMapper.Object, mockConfigRepo.Object, mockOrgRepo.Object);
    }
}