using Alba;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Presentation.Screening.Controllers;
using System.Net;
using Xunit;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.scenarios;

public class OrgRegistrationScenarios : ScenarioContextBase
{
    public OrgRegistrationScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    { }


    [Fact]
    public async Task RegisterOrg_NoAuth_Unauthorized()
    {
        await Host.Scenario(_ =>
        {
            _.Post.Json(Create_OrgRegistrationCreateRequest()).ToUrl($"/api/org-registrations");
            _.StatusCodeShouldBe(HttpStatusCode.Unauthorized);
        });
    }

    [Fact]
    public async Task RegisterOrg_WithAuth_Success()
    {
        await Host.Scenario(_ =>
        {
            _.Post.Json(Create_OrgRegistrationCreateRequest()).ToUrl($"/api/org-registrations");
            //todo: should be success, 
            _.StatusCodeShouldBe(HttpStatusCode.Unauthorized);
        });
    }

    [Fact]
    public async Task AnonymousRegisterOrg_ValidCaptcha_Success()
    {
        //we use google test client key and secrets in app for integration test.
        AnonymousOrgRegistrationCreateRequest request = Create_AnonymousOrgRegistrationCreateRequest();

        await Host.Scenario(_ =>
        {
            _.Post.Json<OrgRegistrationCreateRequest>(request).ToUrl($"/api/anonymous-org-registrations");
            _.StatusCodeShouldBeOk();
        });
    }

    private AnonymousOrgRegistrationCreateRequest Create_AnonymousOrgRegistrationCreateRequest() =>
        new AnonymousOrgRegistrationCreateRequest
        {
            ContactSurname = "test",
            RegistrationTypeCode = RegistrationTypeCode.Volunteer,
            VolunteerOrganizationTypeCode = VolunteerOrganizationTypeCode.NonProfit,
            OrganizationName = "test",
            ContactEmail = "test@test.com",
            ContactGivenName = "test",
            ContactPhoneNumber = "111-111-1111",
            ContactJobTitle = "test",
            MailingAddressLine1 = "address1",
            MailingCity = "victoria",
            MailingPostalCode = "abcedf",
            GenericEmail = "test@email.com",
            GenericPhoneNumber = "111-222-2222",
            AgreeToTermsAndConditions = true,
            Recaptcha = "recapthca_test_token"
        };

    private OrgRegistrationCreateRequest Create_OrgRegistrationCreateRequest() =>
        Create_AnonymousOrgRegistrationCreateRequest();
}