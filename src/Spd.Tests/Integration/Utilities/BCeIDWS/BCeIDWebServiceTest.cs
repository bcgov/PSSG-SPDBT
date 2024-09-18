using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.BCeIDWS;

namespace Spd.Tests.Integration.Utilities.BCeIDWS;

public class TransientFileStorageServiceTest : IClassFixture<IntegrationTestFixture>
{
    private readonly IBCeIDService _bceidService;

    public TransientFileStorageServiceTest(IntegrationTestFixture testSetup)
    {
        _bceidService = testSetup.ServiceProvider.GetRequiredService<IBCeIDService>();
    }

    [Fact]
    public async Task HandleQuery_GetBCeIDAccountDetailAsync_Run_Correctly()
    {
        //Arrange
        //We already have established a bceid in bceid dev env, so, hardcode the value to do the test.
        BCeIDAccountDetailQuery query = new()
        {
            UserGuid = Guid.Parse("846597a7-0224-4ba0-884b-dc3ac8cb21b5")
        };

        //Act
        var result = (await _bceidService.HandleQuery(query)).ShouldNotBeNull().ShouldBeOfType<BCeIDUserDetailResult>();

        //Assert
        Assert.NotNull(result);
        Assert.Equal("Victoria Charity", result.LegalName);
        Assert.Equal(BusinessTypeCode.Other, result.BusinessTypeCode);
        Assert.Equal("Victoria", result.MailingAddress?.City);
        Assert.Equal("BC", result.MailingAddress?.Province);
        Assert.Equal("Not-for-profit", result.OtherBusinessTypeDetail);
    }
}