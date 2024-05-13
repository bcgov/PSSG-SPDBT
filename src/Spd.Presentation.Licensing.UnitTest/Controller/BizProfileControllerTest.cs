using AutoFixture;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class BizProfileControllerTest
{
    private readonly IFixture fixture;
    private Mock<IMediator> mockMediator = new();
    private Mock<IValidator<BizProfileUpdateRequest>> mockValidator = new();
    private BizProfileController sut;

    public BizProfileControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        mockMediator.Setup(m => m.Send(It.IsAny<GetBizProfileQuery>(), CancellationToken.None))
            .ReturnsAsync(new BizProfileResponse());

        var validationResults = fixture.Build<ValidationResult>()
                .With(r => r.Errors, [])
                .Create();
        mockValidator.Setup(x => x.ValidateAsync(It.IsAny<BizProfileUpdateRequest>(), CancellationToken.None))
                .ReturnsAsync(validationResults);

        sut = new BizProfileController(mockMediator.Object, mockValidator.Object);
    }

    [Fact]
    public async void Get_GetProfile_Return_BizProfileResponse()
    {
        var result = await sut.GetProfile(Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<BizProfileResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Put_UpdateBizProfile_Return_Guid()
    {
        BizProfileUpdateRequest request = new();
        string bizId = Guid.NewGuid().ToString();

        var result = await sut.UpdateBizProfile(bizId, request, CancellationToken.None);

        Assert.IsType<Guid>(result);
        Assert.Equal(bizId, result.ToString());
        mockMediator.Verify();
    }

    [Fact]
    public async void Put_UpdateBizProfile_With_Invalid_Guid_Throw_Exception()
    {
        BizProfileUpdateRequest request = new();

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.UpdateBizProfile("123", request, CancellationToken.None));
    }

    [Fact]
    public async void Put_UpdateBizProfile_With_Invalid_Request_Throw_Exception()
    {
        BizProfileUpdateRequest request = new();
        var validationResults = fixture.Create<ValidationResult>();
        mockValidator.Setup(x => x.ValidateAsync(It.IsAny<BizProfileUpdateRequest>(), CancellationToken.None))
            .ReturnsAsync(validationResults);

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.UpdateBizProfile(Guid.NewGuid().ToString(), request, CancellationToken.None));
    }
}
