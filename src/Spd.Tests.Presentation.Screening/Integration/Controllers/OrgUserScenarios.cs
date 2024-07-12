using Alba;
using Microsoft.Dynamics.CRM;
using Spd.Manager.Screening;
using Spd.Manager.Shared;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Controllers;

public class OrgUserScenarios : ScenarioContextBase
{
    public Random rnd;
    public OrgUserScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
        rnd = new Random();
    }


    [Fact]
    public async Task CreateUser_WithCorrectAuthAndHeader_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser($"org{rnd.Next(1,999)}");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Post.Json(Create_OrgUserCreateRequest((Guid)org.accountid)).ToUrl($"/api/orgs/{org.accountid}/users");
            _.ContentShouldContain(org.accountid.ToString());
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task UpdateUser_WithCorrectAuthAndHeader_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser($"org{rnd.Next(1, 999)}");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Put.Json(Create_OrgUserUpdateRequest((Guid)org.accountid, (Guid)user.spd_portaluserid)).ToUrl($"/api/orgs/{org.accountid}/users/{user.spd_portaluserid}");
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task GetUser_WithCorrectAuthAndHeader_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser($"org{rnd.Next(1, 999)}");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}/users/{user.spd_portaluserid}");
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task DeleteUser_WithCorrectAuthAndHeader_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser($"org{rnd.Next(1, 999)}");
        Guid userGuid = Guid.NewGuid();
        spd_identity id = await fixture.testData.CreateIdentity(userGuid.ToString(), org.spd_orgguid.ToString());
        spd_portaluser user1 = await fixture.testData.CreateUserInOrg("contactSur", "contactGiven", org, id);

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Delete.Url($"/api/orgs/{org.accountid}/users/{user1.spd_portaluserid}");
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task VerifyUser_WithCorrectAuth_Success()
    {
        Guid userGuid = Guid.NewGuid();
        var (org, user) = await fixture.testData.CreateOrgWithPrimaryUser($"org3", userGuid, WebAppFixture.LOGON_ORG_GUID);

        var (user1, invite) = await fixture.testData.CreateTempUserInOrg("contactSur", "contactGiven", org);
        //get invitation link
        string encyptedCode = invite.spd_invitationlink.Substring(invite.spd_invitationlink.LastIndexOf("/") + 1, invite.spd_invitationlink.Length - invite.spd_invitationlink.LastIndexOf("/") - 1);
        await Host.Scenario(_ =>
        {
            _.Post.Json(new InvitationRequest(encyptedCode)).ToUrl($"/api/invitations");
            _.StatusCodeShouldBeOk();
        });
    }

    private OrgUserCreateRequest Create_OrgUserCreateRequest(Guid orgId)
    {
        return new OrgUserCreateRequest
        {
            OrganizationId = orgId,
            ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Contact,
            Email = $"test{Guid.NewGuid()}@test.com",
            FirstName = "firstname",
            LastName = "lastname",
            JobTitle = "qa",
            PhoneNumber = "123456"
        };
    }

    private OrgUserUpdateRequest Create_OrgUserUpdateRequest(Guid orgId, Guid userId)
    {
        return new OrgUserUpdateRequest
        {
            Id = userId,
            OrganizationId = orgId,
            ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Primary,
            Email = "test@test1.com",
            FirstName = "firstname",
            LastName = "lastname",
            JobTitle = "qa",
            PhoneNumber = "123456"
        };
    }
}