using AutoFixture;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Shared.Exceptions;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class BizPortalUserControllerTest
{
    private readonly IFixture fixture;
    private Mock<ILogger<BizPortalUserController>> logger = new();
    private Mock<IMediator> mockMediator = new();
    private Mock<IConfiguration> mockConfig = new();
    private Mock<IPrincipal> mockUser = new();
    private Guid userId = Guid.NewGuid();
    private BizPortalUserController sut;

    public BizPortalUserControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        mockMediator.Setup(m => m.Send(It.IsAny<BizPortalUserListQuery>(), CancellationToken.None))
            .ReturnsAsync(new BizPortalUserListResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<BizPortalUserUpdateCommand>(), CancellationToken.None))
            .ReturnsAsync(new BizPortalUserResponse());

        var user = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim("birthdate", "2000-01-01"),
                new Claim("sub", "test"),
                new Claim(ClaimTypes.Role, ContactAuthorizationTypeCode.BusinessManager.ToString()),
                new Claim("spd_userid", userId.ToString())
            ], "mock"));

        sut = new BizPortalUserController(logger.Object, mockMediator.Object, mockConfig.Object, user);
    }

    [Fact]
    public async void GetBizPortalUserList_ReturnBizLicAppResponse()
    {
        Guid bizId = Guid.NewGuid();
        var result = await sut.GetBizPortalUserList(bizId);

        Assert.IsType<BizPortalUserListResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Put_ReturnBizPortalUserResponse()
    {
        Guid bizId = Guid.NewGuid();
        BizPortalUserUpdateRequest request = new();

        var result = await sut.Put(bizId, userId, request);

        Assert.IsType<BizPortalUserResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Put_With_Different_UserId_Throw_Exception()
    {
        Guid bizId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();
        BizPortalUserUpdateRequest request = new();

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.Put(bizId, userId, request));
    }
}
