using Alba;
using Spd.Manager.Cases;
using Xunit;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.scenarios;

public class ApplicationScenarios : ScenarioContextBase
{
    public ApplicationScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    { }

    [Fact]
    public async Task CreateApplicationInvites_WithCorrectAuth_Success()
    {
        var org = await fixture.testData.CreateOrg("org1");

        await Host.Scenario(_ =>
        {
            _.Post.Json(Create_ApplicationInvitesCreateRequest()).ToUrl($"/api/orgs/{org.accountid}/application-invites");
            if (org != null && org.accountid != null)
            {
                _.ContentShouldContain(org.accountid.ToString());
                _.StatusCodeShouldBeOk();
            }
        });
    }

    private ApplicationInvitesCreateRequest Create_ApplicationInvitesCreateRequest()
    {
        return new ApplicationInvitesCreateRequest
        {
            CheckDuplicate = true,
            ApplicationInviteCreateRequests = new List<ApplicationInviteCreateRequest>
            {
                new ApplicationInviteCreateRequest
                {
                    FirstName= "firstName",
                    LastName="lastName",
                    Email="email@test.com",
                    JobTitle="qa",
                    PayeeType=PayeePreferenceTypeCode.Applicant
                }
            }
        };
    }
}