using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration;
public class DistributedCacheTests : ScenarioContextBase
{
    public DistributedCacheTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task CanSetAndGetItems()
    {
        var cache = Host.Services.GetRequiredService<IDistributedCache>();

        var key = "test_key";
        var value = "test_value";

        await cache.SetStringAsync(key, value);

        var actualValue = await cache.GetStringAsync(key);

        actualValue.ShouldBe(value);
    }
}
