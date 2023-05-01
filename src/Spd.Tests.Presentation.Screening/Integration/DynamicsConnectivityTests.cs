using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.Dynamics;
using Xunit;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration;

public class DynamicsConnectivityTests : ScenarioContextBase
{
    public DynamicsConnectivityTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task GetSecurityToken()
    {
        var tokenProvider = Host.Services.GetRequiredService<ISecurityTokenProvider>();
        var token = await tokenProvider.AcquireToken();
        token.ShouldNotBeNullOrEmpty();
        output.WriteLine("Authorization: Bearer {0}", token);
    }

    [Fact]
    public async Task CanConnectToDynamics()
    {
        var context = Host.Services.GetRequiredService<IDynamicsContextFactory>().CreateReadOnly();
        await Should.NotThrowAsync(context.spd_roles.GetAllPagesAsync());
    }
}
