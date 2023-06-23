using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Vlidations;
public class SearchEngineTests : ScenarioContextBase
{
    public SearchEngineTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task SearchSharableClearance_Success()
    {
        var searchEngine = Host.Services.GetRequiredService<ISearchEngine>();
        string bcscId = Guid.NewGuid().ToString();
        await fixture.testData.CreateClearance(bcscId);
        var org2 = await fixture.testData.CreateOrg("org4");

        SharableClearanceSearchResponse searchResponse = (SharableClearanceSearchResponse)await searchEngine.SearchAsync(
            new SharableClearanceSearchRequest((Guid)org2.accountid, bcscId, Utilities.Shared.ManagerContract.ServiceTypeCode.CRRP_EMPLOYEE),
            CancellationToken.None);
        searchResponse.Items.Count().ShouldBe(1);
    }


}
