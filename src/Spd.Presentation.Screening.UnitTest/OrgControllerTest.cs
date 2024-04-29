using AutoFixture;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Screening;
using Spd.Presentation.Screening.Controllers;

namespace Spd.Presentation.Screening.UnitTest;

public class OrgControllerTest
{
    private Mock<IMediator> mockMediator = new();
    private Mock<IMapper> mockMap = new();
    private Mock<IConfiguration> mockConfiguration = new();
    private readonly IFixture fixture;
    private OrgController sut;
    public OrgControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        sut = new OrgController(mockMediator.Object,
            mockMap.Object,
            mockConfiguration.Object);
    }

    [Fact]
    public async void VerifyOrgInviteLink_Return_OrgInviteVerifyResponse()
    {
        //Arrange
        mockMediator.Setup(m => m.Send(It.IsAny<OrgInvitationLinkVerifyCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(fixture.Build<OrgInviteVerifyResponse>().With(r => r.LinkIsValid, true).Create());

        //Act
        var viewResult = await sut.VerifyOrgInviteLink("test");

        //Assert
        Assert.IsType<OrgInviteVerifyResponse>(viewResult);
        Assert.True(viewResult.LinkIsValid);
        mockMediator.Verify();
    }
}
