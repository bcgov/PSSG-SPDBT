using AutoFixture;
using MediatR;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Screening;
using Spd.Presentation.Dynamics.Controllers;

namespace Spd.Presentation.Dynamics.UnitTest.Controller;
public class OrgControllerTest
{
    private Mock<IMediator> mockMediator = new();
    private Mock<IConfiguration> mockConfig = new();
    private readonly IFixture fixture;
    private OrgController sut;
    public OrgControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        sut = new OrgController(mockMediator.Object,
            mockConfig.Object);
    }

    [Fact]
    public async void OrgInvitationLinkCreateCommand_Return_OrgInvitationLinkResponse()
    {
        //Arrange
        mockConfig.Setup(c => c.GetValue<string>(It.IsAny<string>())).Returns("path");
        mockMediator.Setup(m => m.Send(It.IsAny<OrgInvitationLinkCreateCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(fixture.Build<OrgInvitationLinkResponse>().With(i => i.OrgInvitationLinkUrl, "url").Create());

        //Act
        var viewResult = await sut.GetOrgInvitationLinkAsync(Guid.NewGuid(), CancellationToken.None);

        //Assert
        Assert.IsType<OrgInvitationLinkResponse>(viewResult);
        Assert.Equal("url", viewResult.OrgInvitationLinkUrl);
        mockMediator.Verify();
    }
}
