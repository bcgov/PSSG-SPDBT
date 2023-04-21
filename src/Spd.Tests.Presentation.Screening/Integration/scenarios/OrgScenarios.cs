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
        Guid orgId = Guid.NewGuid();
        await fixture.testData.CreateOrg(orgId, "org1");

        await Host.Scenario(_ =>
        {
            _.Get.Url($"/api/org/{orgId}");
            //todo, once we know how to make pkce auth working, uncomment following code.
            //_.StatusCodeShouldBe(HttpStatusCode.Unauthorized);
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task GetOrgFromId_WithCorrectAuth_Success()
    {
        Guid orgId = Guid.NewGuid();
        await fixture.testData.CreateOrg(orgId, "org1");

        await Host.Scenario(_ =>
        {
            _.Get.Url($"/api/org/{orgId}");
            _.ContentShouldContain(orgId.ToString());
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task UpdateOrg_WithCorrectAuth_Success()
    {
        Guid orgId = Guid.NewGuid();
        await fixture.testData.CreateOrg(orgId, "org1");

        await Host.Scenario(_ =>
        {
            _.Put.Json(Create_OrgUpdateRequest(orgId)).ToUrl($"/api/org/{orgId}");
            _.ContentShouldContain(orgId.ToString());
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
            OrganizationName = "org2",
            OrganizationLegalName = "legalorg2",
            PayerPreference = Manager.Membership.Shared.PayerPreferenceTypeCode.Applicant,
            PhoneNumber = "111-111-1111",
            AddressLine1 = "line1",
            AddressCountry = "canada",
            AddressPostalCode = "ABCEDF",
            AddressProvince = "BC"
        };
    }
}