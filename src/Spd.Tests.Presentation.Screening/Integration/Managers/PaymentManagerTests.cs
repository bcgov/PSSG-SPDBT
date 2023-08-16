using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Manager.Cases.Payment;
using Spd.Utilities.Payment;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Managers;

public class PaymentManagerTests : ScenarioContextBase
{
    public PaymentManagerTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }


}
