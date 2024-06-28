using AutoFixture;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.Security.Claims;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class BizLicensingControllerTest
{
    private readonly IFixture fixture;
    private Mock<IValidator<BizLicAppUpsertRequest>> mockUpsertValidator = new();
    private Mock<IValidator<BizLicAppSubmitRequest>> mockSubmitValidator = new();
    private Mock<IMediator> mockMediator = new();
    private Mock<IDistributedCache> mockCache = new();
    private Mock<IDataProtectionProvider> mockDpProvider = new();
    private Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private BizLicensingController sut;

    private Dictionary<string, string> uploadFileConfiguration = new()
    {
        {"UploadFile:StreamFileFolder", "/tmp"},
        {"UploadFile:MaxFileSizeMB", "25"},
        {"UploadFile:AllowedExtensions", ".docx"},
        {"UploadFile:MaxAllowedNumberOfFiles", "10"}
    };

    public BizLicensingControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(uploadFileConfiguration)
            .Build();

        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
            .Returns(new Mock<ITimeLimitedDataProtector>().Object);
        mockMediator.Setup(m => m.Send(It.IsAny<GetBizLicAppQuery>(), CancellationToken.None))
            .ReturnsAsync(new BizLicAppResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<GetLatestBizLicenceAppQuery>(), CancellationToken.None))
            .ReturnsAsync(new BizLicAppResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<BizLicAppUpsertCommand>(), CancellationToken.None))
            .ReturnsAsync(new BizLicAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<CreateDocumentInTransientStoreCommand>(), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppDocumentResponse>());
        mockMediator.Setup(m => m.Send(It.IsAny<BizLicAppRenewCommand>(), CancellationToken.None))
            .ReturnsAsync(new BizLicAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<BizLicAppUpdateCommand>(), CancellationToken.None))
            .ReturnsAsync(new BizLicAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<BizLicAppReplaceCommand>(), CancellationToken.None))
            .ReturnsAsync(new BizLicAppCommandResponse());
        var validationResults = fixture.Build<ValidationResult>()
                .With(r => r.Errors, [])
                .Create();
        mockUpsertValidator.Setup(x => x.ValidateAsync(It.IsAny<BizLicAppUpsertRequest>(), CancellationToken.None))
                .ReturnsAsync(validationResults);
        mockSubmitValidator.Setup(x => x.ValidateAsync(It.IsAny<BizLicAppSubmitRequest>(), CancellationToken.None))
                .ReturnsAsync(validationResults);

        var user = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim("birthdate", "2000-01-01"),
                new Claim("sub", "test"),
            ], "mock"));

        sut = new BizLicensingController(user,
            mockMediator.Object,
            configuration,
            mockUpsertValidator.Object,
            mockSubmitValidator.Object,
            mockRecaptch.Object,
            mockCache.Object,
            mockDpProvider.Object);
    }

    [Fact]
    public async void GetLatestBizLicenceApplication_ReturnBizLicAppResponse()
    {
        Guid applicantId = Guid.NewGuid();
        var result = await sut.GetLatestBizLicenceApplication(applicantId);

        Assert.IsType<BizLicAppResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Get_GetBizLicenceApplication_Return_BizLicAppResponse()
    {
        var result = await sut.GetBizLicenceApplication(Guid.NewGuid());

        Assert.IsType<BizLicAppResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SaveBusinessLicenceApplication_Return_BizLicAppCommandResponse()
    {
        BizLicAppUpsertRequest request = new() { BizId = Guid.NewGuid() };

        var result = await sut.SaveBusinessLicenceApplication(request, CancellationToken.None);

        Assert.IsType<BizLicAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SaveBusinessLicenceApplication_With_Empty_Guid_Throw_Exception()
    {
        BizLicAppUpsertRequest request = new();

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.SaveBusinessLicenceApplication(request, CancellationToken.None));
    }

    [Fact]
    public async void Post_UploadLicenceAppFiles_Return_LicenceAppDocumentResponse_List()
    {
        LicenceAppDocumentUploadRequest request = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance);

        var result = await sut.UploadLicenceAppFiles(request, Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<List<LicenceAppDocumentResponse>>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitBusinessLicenceApplication_Return_BizLicAppCommandResponse()
    {
        BizLicAppUpsertRequest request = new() { BizId = Guid.NewGuid() };

        var result = await sut.SubmitBusinessLicenceApplication(request, CancellationToken.None);

        Assert.IsType<BizLicAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_ChangeOnBizLicApp_Renewal_Return_BizLicAppCommandResponse()
    {
        BizLicAppSubmitRequest request = new() { ApplicationTypeCode = ApplicationTypeCode.Renewal };

        var result = await sut.ChangeOnBizLicApp(request, CancellationToken.None);

        Assert.IsType<BizLicAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_ChangeOnBizLicApp_Update_Return_BizLicAppCommandResponse()
    {
        BizLicAppSubmitRequest request = new() { ApplicationTypeCode = ApplicationTypeCode.Update };

        var result = await sut.ChangeOnBizLicApp(request, CancellationToken.None);

        Assert.IsType<BizLicAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_ChangeOnBizLicApp_Replacement_Return_BizLicAppCommandResponse()
    {
        BizLicAppSubmitRequest request = new() { ApplicationTypeCode = ApplicationTypeCode.Replacement };

        var result = await sut.ChangeOnBizLicApp(request, CancellationToken.None);

        Assert.IsType<BizLicAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_ChangeOnBizLicApp_With_Wrong_ApplicationTypeCode_Throw_Exception()
    {
        BizLicAppSubmitRequest request = new() { ApplicationTypeCode = ApplicationTypeCode.New };

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.ChangeOnBizLicApp(request, CancellationToken.None));
    }
}
