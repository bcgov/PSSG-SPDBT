using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Manager.Screening;
using Spd.Manager.Membership.UserProfile;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Screening.Integration.Managers;

public class UserProfileManagerTests : ScenarioContextBase
{
    public UserProfileManagerTests(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task Handle_GetApplicantProfileQuery_withApplicantSub_Success()
    {
        var mediator = Host.Services.GetRequiredService<IMediator>();
        var org = await fixture.testData.CreateOrg("org1");
        var request = ApplicationManagerTests.Create_ApplicantAppCreateRequest();
        request.OrgId = (Guid)org.accountid;
        string bcscApplicantSub = Guid.NewGuid().ToString();
        //create app with new bcsc 
        await mediator.Send(new ApplicantApplicationCreateCommand(request, bcscApplicantSub));

        ApplicantProfileResponse response = await mediator.Send(new GetApplicantProfileQuery(bcscApplicantSub), CancellationToken.None);
        response.FirstName.ShouldBe(request.GivenName, StringCompareShould.IgnoreCase);
        response.LastName.ShouldBe(request.Surname, StringCompareShould.IgnoreCase);
    }


}
