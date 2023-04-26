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

    [Fact]
    public async Task CreateApplication_WithCorrectAuth_Success()
    {
        var org = await fixture.testData.CreateOrg("org1");

        var result = await Host.Scenario(_ =>
        {
            var result = _.Post.Json(Create_ApplicationCreateRequest()).ToUrl($"/api/orgs/{org.accountid}/application");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });

        var json = await result.ReadAsJsonAsync<ApplicationCreateResponse>();
        Assert.True(json.CreateSuccess);
    }

    private ApplicationInvitesCreateRequest Create_ApplicationInvitesCreateRequest()
    {
        return new ApplicationInvitesCreateRequest
        {
            RequireDuplicateCheck = true,
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

    private ApplicationCreateRequest Create_ApplicationCreateRequest()
    {
        return new ApplicationCreateRequest
        {
            OriginTypeCode = ApplicationOriginTypeCode.Portal,
            GivenName = "givenName",
            EmailAddress = "email@test.com",
            Surname = "surname",
            JobTitle = "qa",
            CheckDuplicate = false,
            City="city",
            PhoneNumber="12345678",
            DateOfBirth=new DateTime(2000,1,1),
            AddressLine1="address1",
            PostalCode="121212",
            Province="bc",
            Country="canada",
            AgreeToCompleteAndAccurate=true,
            HaveVerifiedIdentity=true,
            ScreeningTypeCode=ScreeningTypeCode.Staff,
            BirthPlace="place"
        };
    }
}