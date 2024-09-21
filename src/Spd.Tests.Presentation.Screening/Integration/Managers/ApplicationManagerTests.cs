using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Manager.Screening;
using Spd.Manager.Shared;
using Spd.Utilities.Dynamics;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Managers;

public class ApplicationManagerTests : ScenarioContextBase
{
    public ApplicationManagerTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task Handle_ApplicantApplicationCreateCommand_withApplicantSub_Success()
    {
        var mediator = Host.Services.GetRequiredService<IMediator>();
        var org = await fixture.testData.CreateOrg("org1");
        var request = Create_ApplicantAppCreateRequest();
        request.OrgId = (Guid)org.accountid;
        string bcscApplicantSub = Guid.NewGuid().ToString();

        //create app with totally new bcsc
        //app created, identity created, contact created
        var response = await mediator.Send(new ApplicantApplicationCreateCommand(request, bcscApplicantSub));
        response.CreateSuccess.ShouldBeTrue();
        var context = Host.Services.GetRequiredService<IDynamicsContextFactory>().CreateReadOnly();
        var id = context.spd_identities
            .Expand(i => i.spd_ContactId)
            .Where(i => i.spd_userguid == bcscApplicantSub)
            .FirstOrDefault();
        id.ShouldNotBeNull();
        id.spd_ContactId.ShouldNotBeNull();

        //create app with existing bcsc, same name
        //app created, link to existing contact
        var org2 = await fixture.testData.CreateOrg("org2");
        request.OrgId = (Guid)org2.accountid;
        response = await mediator.Send(new ApplicantApplicationCreateCommand(request, bcscApplicantSub));
        response.CreateSuccess.ShouldBeTrue();
        var app = context.spd_applications
            .Expand(a => a.spd_ApplicantId_contact)
            .Where(a => a.spd_applicationid == response.ApplicationId)
            .FirstOrDefault();
        app.spd_ApplicantId_contact.contactid.ShouldBe(id.spd_ContactId.contactid);

        //create app with existing bcsc, different name
        //app created, link to existing contact, existing contact updated with new name, alias created for old name
        var org3 = await fixture.testData.CreateOrg("org3");
        request.OrgId = (Guid)org3.accountid;
        request.GivenName = "NewGivenName";
        response = await mediator.Send(new ApplicantApplicationCreateCommand(request, bcscApplicantSub));
        response.CreateSuccess.ShouldBeTrue();
        app = context.spd_applications
            .Expand(a => a.spd_ApplicantId_contact)
            .Where(a => a.spd_applicationid == response.ApplicationId)
            .FirstOrDefault();
        app.spd_ApplicantId_contact.contactid.ShouldBe(id.spd_ContactId.contactid);
        app.spd_ApplicantId_contact.firstname.ShouldBe("Newgivenname");
        var contact = context.contacts
            .Expand(c => c.spd_Contact_Alias)
            .Where(c => c.contactid == id.spd_ContactId.contactid)
            .FirstOrDefault();
        var alias = contact.spd_Contact_Alias.Where(a => a.spd_firstname.Equals("Givenname"))
            .FirstOrDefault();
        alias.ShouldNotBeNull();
    }

    public static ApplicantAppCreateRequest Create_ApplicantAppCreateRequest()
    {
        return new ApplicantAppCreateRequest
        {
            OriginTypeCode = ApplicationOriginTypeCode.Portal,
            GivenName = "givenName",
            EmailAddress = "email@test.com",
            Surname = "surname",
            JobTitle = "qa",
            RequireDuplicateCheck = false,
            City = "city",
            PhoneNumber = "12345678",
            DateOfBirth = new DateOnly(2000, 1, 1),
            AddressLine1 = "address1",
            PostalCode = "121212",
            Province = "bc",
            Country = "canada",
            AgreeToCompleteAndAccurate = true,
            HaveVerifiedIdentity = true,
            ScreeningType = ScreeningTypeCode.Staff,
            BirthPlace = "place"
        };
    }
}