using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Resource.Applicants.Application;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Resources.Applicants;

public class ApplicationsTests : ScenarioContextBase
{
    public ApplicationsTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task CanGetStatistics()
    {
        var applicationRepository = Host.Services.GetRequiredService<IApplicationRepository>();
        var org = await fixture.testData.CreateOrg("org1");
        var stats = await applicationRepository.QueryApplicationStatisticsAsync(new ApplicationStatisticsQry(org.accountid!.Value), CancellationToken.None);
        stats.Statistics.ShouldNotBeEmpty();
    }
}
