using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Manager.Cases.Payment;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Dynamics.Integration.Managers;

public class PaymentManagerTests : ScenarioContextBase
{
    public PaymentManagerTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task Handle_PaymentRefundCommand_Success()
    {
        var mediator = Host.Services.GetRequiredService<IMediator>();
        Guid paymentId = new Guid("fdfdccc8-9f7c-4199-a33f-3f7b1d8351b9");
        PaymentRefundCommand command = new(paymentId);
        var response = await mediator.Send(command);
        response.Approved.ShouldBe(true);
        response.PaymentId.ShouldBe(paymentId);
    }
    [Fact]
    public async Task Handle_CreateInvoicesCommand()
    {
        var mediator = Host.Services.GetRequiredService<IMediator>();
        CreateInvoicesInCasCommand command = new CreateInvoicesInCasCommand();
        await mediator.Send(command);
    }
}
