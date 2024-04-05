using AutoFixture;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Screening;
using Spd.Presentation.Screening.Controllers;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Presentation.Screening.UnitTest;

public class OrgUserControllerTest
{
    private Mock<IMediator> mockMediator = new();
    private Mock<IConfiguration> mockConfig = new();
    private Mock<IMapper> mockMap = new();
    private IPrincipal user;
    private readonly IFixture fixture;
    private OrgUserController sut;
    public OrgUserControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        var claims = new List<Claim>()
            {
                new(ClaimTypes.Name, "username"),
                new(ClaimTypes.NameIdentifier, "userId"),
                new("name", "John Doe"),
            };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        sut = new OrgUserController(null,
            mockMediator.Object,
            mockConfig.Object,
            claimsPrincipal);
    }

    [Fact]
    public async void AddBceidPrimaryUser_Return_OrgUserResponse()
    {
        //Arrange
        mockMediator.Setup(m => m.Send(
                It.IsAny<RegisterBceidPrimaryUserCommand>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                fixture.Build<OrgUserResponse>().Create());

        //Act
        var viewResult = await sut.AddBceidPrimaryUser(Guid.NewGuid());

        //Assert
        Assert.IsType<OrgUserResponse>(viewResult);
        mockMediator.Verify();
    }
}
