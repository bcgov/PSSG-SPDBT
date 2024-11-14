using AutoFixture;
using AutoMapper;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Moq;
using Spd.Manager.Common.Admin;
using Spd.Resource.Repository.Config;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Address;

namespace Spd.Manager.Common.UnitTest;

public class AdminManagerTest
{
    private readonly IFixture fixture;
    private readonly Mock<IAddressAutocompleteClient> mockAddressClient = new();
    private readonly Mock<IConfigRepository> mockConfigRepo = new();
    private readonly Mock<IOrgRepository> mockOrgRepo = new();
    private readonly Mock<IMapper> mockMapper = new();
    private readonly IDistributedCache cache = new MemoryDistributedCache(Options.Create<MemoryDistributedCacheOptions>(new MemoryDistributedCacheOptions()));
    private readonly AdminManager sut;

    public AdminManagerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var addressAutocompleteFindResponse = fixture.Create<AddressAutocompleteFindResponse>();
        var addressAutocompleteFindList = new List<AddressAutocompleteFindResponse>() { addressAutocompleteFindResponse };
        mockAddressClient.Setup(m => m.Query(It.IsAny<AddressSearchQuery>(), CancellationToken.None))
            .ReturnsAsync(addressAutocompleteFindList);

        var addressAutocompleteRetrieveResponse = fixture.Create<AddressAutocompleteRetrieveResponse>();
        var addressAutocompleteRetrieveList = new List<AddressAutocompleteRetrieveResponse>() { addressAutocompleteRetrieveResponse };
        mockAddressClient.Setup(m => m.Query(It.IsAny<AddressRetrieveQuery>(), CancellationToken.None))
            .ReturnsAsync(addressAutocompleteRetrieveList);

        var bannerItem = fixture.Build<ConfigItem>()
            .With(i => i.Value, "test")
            .Create();
        var bannerItems = new List<ConfigItem>() { bannerItem };
        mockConfigRepo.Setup(m => m.Query(It.Is<ConfigQuery>(q => q.Key == IConfigRepository.BANNER_MSG_CONFIG_KEY), CancellationToken.None))
            .ReturnsAsync(new ConfigResult(bannerItems));

        var licensingItem = fixture.Build<ConfigItem>()
            .With(i => i.Value, "0")
            .Create();
        var licensingItems = new List<ConfigItem>() { licensingItem };
        mockConfigRepo.Setup(m => m.Query(It.Is<ConfigQuery>(q => q.Key == IConfigRepository.LICENSING_REPLACEMENTPROCESSINGTIME_KEY), CancellationToken.None))
            .ReturnsAsync(new ConfigResult(licensingItems));

        var orgsQryResult = fixture.Create<OrgsQryResult>();
        mockOrgRepo.Setup(m => m.QueryOrgAsync(It.IsAny<OrgsQry>(), CancellationToken.None))
            .ReturnsAsync(orgsQryResult);

        sut = new AdminManager(mockAddressClient.Object, mockMapper.Object, mockConfigRepo.Object, mockOrgRepo.Object, cache);
    }

    [Fact]
    public async Task Handle_FindAddressQuery_Return_AddressFindResponse()
    {
        FindAddressQuery request = new FindAddressQuery("test");

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsAssignableFrom<IEnumerable<AddressFindResponse>>(result);
    }

    [Fact]
    public async void Handle_RetrieveAddressQuery_Return_AddressFindResponse()
    {
        RetrieveAddressByIdQuery request = new RetrieveAddressByIdQuery("1");

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsAssignableFrom<IEnumerable<AddressRetrieveResponse>>(result);
    }

    [Fact]
    public async void Handle_GetBannerMsgQuery_Return_StringResponse()
    {
        GetBannerMsgQuery request = new GetBannerMsgQuery();

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<string>(result);
        Assert.Equal("test", result);
    }

    [Fact]
    public async void Handle_GetReplacementProcessingTimeQuery_Return_StringResponse()
    {
        GetReplacementProcessingTimeQuery request = new GetReplacementProcessingTimeQuery();

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<string>(result);
        Assert.Equal("0", result);
    }

    [Fact]
    public async void Handle_GetMinistryQuery_Return_MinistryResponse()
    {
        GetMinistryQuery request = new GetMinistryQuery();

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsAssignableFrom<IEnumerable<MinistryResponse>>(result);
    }
}