using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Engine.Validation;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Vlidations;
public class DuplicateCheckTests : ScenarioContextBase
{
    public DuplicateCheckTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task BulkUploadDuplicateCheck_CanCheckDuplicateInTsvAndDb()
    {
        var duplicateCheckEngine = Host.Services.GetRequiredService<IDuplicateCheckEngine>();
        var org = await fixture.testData.CreateOrg("org1");
        await fixture.testData.CreateAppInOrg("ln", "fn", DateTimeOffset.UtcNow, org);
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
                },
                new AppBulkDuplicateCheck()
                {
                    DateOfBirth = new DateTime(2000,1,1),
                    GivenName = "given",
                    SurName = "sur",
                    LineNumber = 2,
                    OrgId = (Guid)org.accountid
                },
                new AppBulkDuplicateCheck()
                {
                    DateOfBirth = new DateTime(2000,1,1),
                    GivenName = "given3",
                    SurName = "sur3",
                    LineNumber = 3,
                    OrgId = (Guid)org.accountid
                },
                new AppBulkDuplicateCheck()
                {
                    DateOfBirth = new DateTime(2000,5,10),
                    GivenName = "test 5",
                    SurName = "Five 5",
                    LineNumber = 4,
                    OrgId = Guid.Parse("dc1746ef-63ce-ed11-b841-00505683fbf4")
                }
            };
            var results = (BulkUploadAppDuplicateCheckResponse)await duplicateCheckEngine.DuplicateCheckAsync(
                new BulkUploadAppDuplicateCheckRequest(checks),
                CancellationToken.None);
            results.BulkDuplicateChecks.First(c => c.LineNumber == 1).HasPotentialDuplicate.ShouldBeTrue();
            results.BulkDuplicateChecks.First(c => c.LineNumber == 3).HasPotentialDuplicate.ShouldBeFalse();
            results.BulkDuplicateChecks.First(c => c.LineNumber == 4).HasPotentialDuplicate.ShouldBeTrue();
        }
    }


}
