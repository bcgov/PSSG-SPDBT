using Alba;
using Spd.Manager.Screening;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Controllers;

public class OrgScenarios : ScenarioContextBase
{
    public OrgScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    { }

    [Fact]
    public async Task GetOrgFromId_WithoutHeader_Unauthorized()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithBceidUser(WebAppFixture.LOGON_USER_GUID, WebAppFixture.LOGON_ORG_GUID);
            _.Get.Url($"/api/orgs/{org.accountid}");
            //todo, once we know how to make pkce auth working, uncomment following code.
            _.StatusCodeShouldBe(401);
        });
    }

    [Fact]
    public async Task GetOrgFromId_WithCorrectAuthAndHeader_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithBceidUser(WebAppFixture.LOGON_USER_GUID, WebAppFixture.LOGON_ORG_GUID);
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}");
            _.ContentShouldContain(org.accountid.ToString());
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task GetOrgFromId_WithCorrectAuth_WithoutHeader_Fail()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithBceidUser(WebAppFixture.LOGON_USER_GUID, WebAppFixture.LOGON_ORG_GUID);
            _.Get.Url($"/api/orgs/{org.accountid}");
            _.StatusCodeShouldBe(401);
        });
    }

    [Fact]
    public async Task UpdateOrg_With_Header_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");
        await Host.Scenario(_ =>
        {
            _.WithBceidUser(WebAppFixture.LOGON_USER_GUID, WebAppFixture.LOGON_ORG_GUID);
            _.WithRequestHeader("organization", org.accountid.ToString());
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
            PayerPreference = Spd.Manager.Shared.PayerPreferenceTypeCode.Applicant,
            PhoneNumber = "111-111-1111",
            AddressLine1 = "line1",
            AddressCountry = "canada",
            AddressPostalCode = "ABCEDF",
            AddressProvince = "BC"
        };
    }
}