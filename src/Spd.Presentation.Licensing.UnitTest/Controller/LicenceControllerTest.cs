using AutoFixture;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class LicenceControllerTest
{
    private readonly IFixture fixture;
    private Mock<IMediator> mockMediator = new();
    private Mock<IConfiguration> mockConfig = new();
    private Mock<IDistributedCache> mockCache = new();
    private Mock<IDataProtectionProvider> mockDpProvider = new();
    private Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private LicenceController sut;

    public LicenceControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        mockMediator.Setup(m => m.Send(It.IsAny<LicenceListQuery>(), CancellationToken.None))
               .ReturnsAsync(new List<LicenceBasicResponse>());
        mockMediator.Setup(m => m.Send(It.IsAny<LicencePhotoQuery>(), CancellationToken.None))
               .ReturnsAsync(new FileResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<LicenceByIdQuery>(), CancellationToken.None))
               .ReturnsAsync(new LicenceResponse());

        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);

        sut = new LicenceController(mockMediator.Object,
            mockRecaptch.Object,
            mockDpProvider.Object,
            mockCache.Object,
            mockConfig.Object);
    }

    [Fact]
    public async void Get_GetBizLicences_Return_LicenceResponse()
    {
        var result = await sut.GetBizLicences(Guid.NewGuid());

        Assert.IsType<List<LicenceBasicResponse>>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Get_GetApplicantLicences_Return_LicenceResponse()
    {
        var result = await sut.GetApplicantLicences(Guid.NewGuid());

        Assert.IsType<List<LicenceBasicResponse>>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Get_GetLicencePhoto_Return_FileStreamResult()
    {
        var result = await sut.GetLicencePhoto(Guid.NewGuid());

        Assert.IsType<FileStreamResult>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Get_GetLicence_Return_LicenceResponse()
    {
        var result = await sut.GetLicence(Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<LicenceResponse>(result);
        mockMediator.Verify();
    }
}
