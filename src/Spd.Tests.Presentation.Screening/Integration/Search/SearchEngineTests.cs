using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Engine.Search;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Vlidations;
public class SearchEngineTests : ScenarioContextBase
{
    public SearchEngineTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task SearchShareableClearance_Success()
    {
        var searchEngine = Host.Services.GetRequiredService<ISearchEngine>();
        string bcscId = Guid.NewGuid().ToString();
        await fixture.testData.CreateClearance(bcscId);
        var org2 = await fixture.testData.CreateOrg("org4");

        ShareableClearanceSearchResponse searchResponse = (ShareableClearanceSearchResponse)await searchEngine.SearchAsync(
            new ShareableClearanceSearchRequest((Guid)org2.accountid, bcscId, Spd.Manager.Common.ManagerContract.ServiceTypeCode.CRRP_EMPLOYEE),
            CancellationToken.None);
        searchResponse.Items.Count().ShouldBe(1);
    }


}
