using Microsoft.Extensions.DependencyInjection;
using Spd.Engine.Validation;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Vlidations;
public class DuplicateCheckTests : ScenarioContextBase
{
    public DuplicateCheckTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task CanCheckDuplicateInTsvAndDb()
    {
        var duplicateCheckEngine = Host.Services.GetRequiredService<IDuplicateCheckEngine>();
        var org = await fixture.testData.CreateOrg("org1");
        if (org.accountid != null)
        {
            List<AppBulkDuplicateCheck> checks = new() {
                new AppBulkDuplicateCheck()
                {
                    DateOfBirth = new DateTime(2000,1,1),
                    GivenName = "given",
                    SurName = "sur",
                    LineNumber = 1,
                    OrgId = (Guid)org.accountid
                }
            };
            var results = await duplicateCheckEngine.DuplicateCheckAsync(
                new BulkUploadAppDuplicateCheckRequest(checks),
                CancellationToken.None);
        }
    }
}
