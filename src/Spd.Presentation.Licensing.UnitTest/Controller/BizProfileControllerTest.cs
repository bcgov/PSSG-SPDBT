using MediatR;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class BizProfileControllerTest
{
    private Mock<IMediator> mockMediator = new();
    private BizProfileController sut;

    public BizProfileControllerTest()
    {
        mockMediator.Setup(m => m.Send(It.IsAny<GetBizProfileQuery>(), CancellationToken.None))
            .ReturnsAsync(new BizProfileResponse());

        sut = new BizProfileController(mockMediator.Object);
    }

    [Fact]
    public async void Get_GetProfile_Return_BizProfileResponse()
    {
        var result = await sut.GetProfile(Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<BizProfileResponse>(result);
        mockMediator.Verify();
    }

}
