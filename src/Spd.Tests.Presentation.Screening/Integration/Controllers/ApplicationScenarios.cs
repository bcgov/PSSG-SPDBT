using Alba;
using Spd.Manager.Cases;
using System.Net.Http.Json;
using System.Net.Mime;
using System.Text.Json;
using System.Text.Json.Serialization;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Controllers;

public class ApplicationScenarios : ScenarioContextBase
{
    public ApplicationScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    { }

    [Fact]
    public async Task CreateApplicationInvites_WithCorrectAuth_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Post.Json(Create_ApplicationInvitesCreateRequest()).ToUrl($"/api/orgs/{org.accountid}/application-invites");
            if (org != null && org.accountid != null)
            {
                _.ContentShouldContain(org.accountid.ToString());
                _.StatusCodeShouldBeOk();
            }
        });
    }

    [Fact]
    public async Task ListApplicationInvites_WithCorrectAuth_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}/application-invites?page=0&filters=searchText@=str");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });
    }

    [Fact]
    public async Task DeleteApplicationInvite_WithCorrectAuth_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");
        var invite = await fixture.testData.CreatePortalInvitationInOrg("first1", "last1", org);

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Delete.Url($"/api/orgs/{org.accountid}/application-invites/{invite.spd_portalinvitationid}");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });
    }

    [Fact]
    public async Task CreateApplication_WithCorrectAuthAndHeader_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        var result = await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Post.MultipartFormData(CreateMultipartFormData("test", "test.txt")).ToUrl($"/api/orgs/{org.accountid}/application");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });

        var json = await result.ReadAsJsonAsync<ApplicationCreateResponse>();
        Assert.True(json.CreateSuccess);
    }

    [Fact]
    public async Task ListApplications_WithCorrectAuth_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}/applications?filters=status==AwaitingPayment|AwaitingApplicant,searchText@=str&sorts=name&page=1&pageSize=15");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });
    }

    [Fact]
    public async Task ApplicationStatistics_WithCorrectAuth_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}/application-statistics");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });
    }

    [Fact]
    public async Task ListBulkUploadHistory_WithCorrectAuth_Success()
    {
        var (org, user) = await fixture.testData.CreateOrgWithLogonUser("org1");

        await Host.Scenario(_ =>
        {
            _.WithRequestHeader("organization", org.accountid.ToString());
            _.Get.Url($"/api/orgs/{org.accountid}/applications/bulk/history");
            if (org != null && org.accountid != null)
            {
                _.StatusCodeShouldBeOk();
            }
        });
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

    private MultipartFormDataContent CreateMultipartFormData(string content, string fileName)
    {
        MultipartFormDataContent multipartContent = new();
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(content);
        writer.Flush();
        stream.Position = 0;
        var streamContent = new StreamContent(stream);
        streamContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(MediaTypeNames.Text.Plain);
        multipartContent.Add(streamContent, "ConsentFormFile", fileName);

        var applicationCreateRequest = Create_ApplicationCreateRequest();
        var options = new JsonSerializerOptions();
        options.Converters.Add(new JsonStringEnumConverter());
        var jsonContent = JsonContent.Create(applicationCreateRequest, typeof(ApplicationCreateRequest), options: options);
        multipartContent.Add(jsonContent, "ApplicationCreateRequestJson");
        return multipartContent;
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
            RequireDuplicateCheck = false,
            City = "city",
            PhoneNumber = "12345678",
            DateOfBirth = new DateTime(2000, 1, 1),
            AddressLine1 = "address1",
            PostalCode = "121212",
            Province = "bc",
            Country = "canada",
            AgreeToCompleteAndAccurate = true,
            HaveVerifiedIdentity = true,
            ScreeningTypeCode = ScreeningTypeCode.Staff,
            BirthPlace = "place"
        };
    }
}