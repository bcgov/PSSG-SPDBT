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
    private IConfiguration config;
    private readonly IFixture fixture;
    private OrgController sut;
    public OrgControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        var inMemorySettings = new Dictionary<string, string> {
            {"ScreeningHostUrl", "localhost"},
            {"ScreeningOrgInvitationPath", "path"},
        };
        config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        sut = new OrgController(mockMediator.Object, config);
    }

    [Fact]
    public async void OrgInvitationLinkCreateCommand_Return_OrgInvitationLinkResponse()
    {
        //Arrange
        mockMediator.Setup(m => m.Send(It.IsAny<OrgInvitationLinkCreateCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                fixture.Build<OrgInvitationLinkResponse>()
                .With(i => i.OrgInvitationLinkUrl, "url")
                .Create());

        //Act
        var viewResult = await sut.GetOrgInvitationLinkAsync(Guid.NewGuid(), CancellationToken.None);

        //Assert
        Assert.IsType<OrgInvitationLinkResponse>(viewResult);
        Assert.Equal("url", viewResult.OrgInvitationLinkUrl);
        mockMediator.Verify();
    }
}
