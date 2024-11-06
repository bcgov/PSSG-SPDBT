using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Shouldly;
using Spd.Utilities.Payment;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.Payment;

public class PaymentServiceTests : IntegrationTestBase
{
    private readonly PayBCSettings _settings;

    public PaymentServiceTests(ITestOutputHelper output, IntegrationTestFixture fixture, IOptions<PayBCSettings> settings) : base(output, fixture)
    {
        this._settings = settings.Value;
    }

    [Fact]
    public async Task GetScreeningRefundToken_Success()
    {
        var tokenProvider = Fixture.ServiceProvider.GetRequiredService<ITokenProviderResolver>().GetTokenProviderByName("BasicTokenProvider");
        string accessToken = await tokenProvider.AcquireToken(_configuration.);
        accessToken.ShouldNotBeNullOrEmpty();
    }

    //[Fact]
    //public async Task GetLicensingRefundToken_Success()
    //{
    //    var tokenProvider = Fixture.ServiceProvider.GetRequiredService<ITokenProviderResolver>().GetTokenProviderByName("BasicTokenProvider");
    //    string accessToken = await tokenProvider.AcquireToken();
    //    accessToken.ShouldNotBeNullOrEmpty();
    //}
}