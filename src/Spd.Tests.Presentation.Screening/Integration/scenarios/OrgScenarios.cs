using Alba;
using Spd.Manager.Membership.Org;
using Xunit;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.scenarios;

public class OrgScenarios : ScenarioContextBase
{
    public OrgScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    { }


    [Fact]
    public async Task GetOrgFromId_NoAuth_Unauthorized()
    {
        var org = await fixture.testData.CreateOrg("org1");

        await Host.Scenario(_ =>
        {
            _.Get.Url($"/api/orgs/{org.accountid}");
            //todo, once we know how to make pkce auth working, uncomment following code.
            //_.StatusCodeShouldBe(HttpStatusCode.Unauthorized);
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task GetOrgFromId_WithCorrectAuthAndHeader_Success()
    {
        var org = await fixture.testData.CreateOrg("org1");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}");
            _.ContentShouldContain(org.accountid.ToString());
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task GetOrgFromId_WithCorrectAuthWithoutHeader_Fail()
    {
        var org = await fixture.testData.CreateOrg("org1");

        await Host.Scenario(_ =>
        {
            _.Get.Url($"/api/orgs/{org.accountid}");
            _.ContentShouldContain(org.accountid.ToString());
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task UpdateOrg_WithCorrectAuth_Success()
    {
        var org = await fixture.testData.CreateOrg("org1");

        await Host.Scenario(_ =>
        {
            _.Put.Json(Create_OrgUpdateRequest((Guid)org.accountid)).ToUrl($"/api/orgs/{org.accountid}");
            _.ContentShouldContain(org.accountid.ToString());
            _.StatusCodeShouldBeOk();
        });
    }

    private OrgUpdateRequest Create_OrgUpdateRequest(Guid orgId)
    {
        return new OrgUpdateRequest
        {
            Id = orgId,
            AddressCity = "city",
            Email = "test@test.com",
            PayerPreference = Manager.Membership.Shared.PayerPreferenceTypeCode.Applicant,
            PhoneNumber = "111-111-1111",
            AddressLine1 = "line1",
            AddressCountry = "canada",
            AddressPostalCode = "ABCEDF",
            AddressProvince = "BC"
        };
    }
}