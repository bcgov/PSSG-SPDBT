using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Controllers;

public class ConfigurationScenarios : ScenarioContextBase
{
    public ConfigurationScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    { }


    [Fact]
    public async Task GetConfiguration_WithoutHeader_Unauthorized_ShouldSuccess()
    {
        await Host.Scenario(_ =>
        {
            _.Get.Url($"/api/configuration");
            _.StatusCodeShouldBe(200);
        });
    }
}