using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.Payment;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.Payment;

public class PaymentServiceTests(ITestOutputHelper output, IntegrationTestFixture fixture) : IntegrationTestBase(output, fixture)
{
    [Fact]
    public async Task GetToken_Success()
    {
        var tokenProvider = Fixture.ServiceProvider.GetRequiredService<ITokenProviderResolver>().GetTokenProviderByName("BasicTokenProvider");
        string accessToken = await tokenProvider.AcquireToken();
        accessToken.ShouldNotBeNullOrEmpty();
    }
}