using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.Payment;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.Payment;

/// <summary>
/// test
/// </summary>
/// <param name="output"></param>
/// <param name="fixture"></param>

public class PaymentServiceTests(ITestOutputHelper output, IntegrationTestFixture fixture) : IntegrationTestBase(output, fixture)
{

    [Fact]
    public async Task ScreeningRefundWorks()
    {
        var paymentService = Fixture.ServiceProvider.GetRequiredService<IPaymentService>();
        var result = (RefundPaymentResult)await paymentService.HandleCommand(new RefundPaymentCmd { OrderNumber = "12345", PbcRefNumber = "10015" });

        result.Message.ShouldContain("Transaction does not exist");
    }

    [Fact]
    public async Task LicensingRefundWorks()
    {
        var paymentService = Fixture.ServiceProvider.GetRequiredService<IPaymentService>();
        var result = (RefundPaymentResult)await paymentService.HandleCommand(new RefundPaymentCmd { OrderNumber = "12345", PbcRefNumber = "10016" });

        result.Message.ShouldContain("Transaction does not exist");
    }
}