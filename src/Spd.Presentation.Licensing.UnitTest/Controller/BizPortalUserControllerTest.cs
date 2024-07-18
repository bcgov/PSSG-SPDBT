using AutoFixture;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class BizPortalUserControllerTest
{
    private readonly IFixture fixture;
    private Mock<ILogger<BizPortalUserController>> logger = new();
    private Mock<IMediator> mockMediator = new();
    private Mock<IConfiguration> mockConfig = new();
    private Mock<IPrincipal> mockUser = new();
    private BizPortalUserController sut;

    public BizPortalUserControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        mockMediator.Setup(m => m.Send(It.IsAny<BizPortalUserListQuery>(), CancellationToken.None))
            .ReturnsAsync(new BizPortalUserListResponse());

        sut = new BizPortalUserController(logger.Object, mockMediator.Object, mockConfig.Object, mockUser.Object);
    }

    [Fact]
    public async void GetBizPortalUserList_ReturnBizLicAppResponse()
    {
        Guid bizId = Guid.NewGuid();
        var result = await sut.GetBizPortalUserList(bizId);

        Assert.IsType<BizPortalUserListResponse>(result);
        mockMediator.Verify();
    }
}
