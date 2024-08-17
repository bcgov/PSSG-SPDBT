using System.Security.Claims;
using AutoFixture;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Controllers;
using Spd.Tests.Fixtures;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Presentation.Licensing.UnitTest.Controller;

public class PermitControllerTest
{
    private readonly IFixture fixture;
    private readonly PermitFixture permitFixture;
    private readonly Mock<IMediator> mockMediator = new();
    private readonly IDistributedCache cache = new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));
    private readonly Mock<IValidator<PermitAppSubmitRequest>> mockPermitAppSubmitValidator = new();
    private readonly Mock<IValidator<PermitAppUpsertRequest>> mockPermitAppUpsertValidator = new();
    private readonly Mock<IDataProtectionProvider> mockDpProvider = new();
    private readonly Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private readonly PermitController sut;

    private Dictionary<string, string> uploadFileConfiguration = new()
    {
        {"UploadFile:StreamFileFolder", "/tmp"},
        {"UploadFile:MaxFileSizeMB", "25"},
        {"UploadFile:AllowedExtensions", ".docx"},
        {"UploadFile:MaxAllowedNumberOfFiles", "10"}
    };

    public PermitControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        permitFixture = new PermitFixture();

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(uploadFileConfiguration)
            .Build();

        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);
        mockMediator.Setup(m => m.Send(It.IsAny<CreateDocumentInTransientStoreCommand>(), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppDocumentResponse>());
        mockMediator.Setup(m => m.Send(It.IsAny<PermitUpsertCommand>(), CancellationToken.None))
            .ReturnsAsync(new PermitAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<PermitSubmitCommand>(), CancellationToken.None))
            .ReturnsAsync(new PermitAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<PermitAppReplaceCommand>(), CancellationToken.None))
               .ReturnsAsync(new PermitAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<PermitAppRenewCommand>(), CancellationToken.None))
               .ReturnsAsync(new PermitAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<PermitAppUpdateCommand>(), CancellationToken.None))
               .ReturnsAsync(new PermitAppCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<GetLatestPermitApplicationIdQuery>(), CancellationToken.None))
                .ReturnsAsync(Guid.NewGuid());
        mockMediator.Setup(m => m.Send(It.IsAny<GetPermitApplicationQuery>(), CancellationToken.None))
        .ReturnsAsync(new PermitLicenceAppResponse());

        var validationResults = fixture.Build<ValidationResult>()
            .With(r => r.Errors, [])
            .Create();
        mockPermitAppSubmitValidator.Setup(x => x.ValidateAsync(It.IsAny<PermitAppSubmitRequest>(), CancellationToken.None))
            .ReturnsAsync(validationResults);
        mockPermitAppUpsertValidator.Setup(x => x.ValidateAsync(It.IsAny<PermitAppUpsertRequest>(), CancellationToken.None))
            .ReturnsAsync(validationResults);

        var user = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim("birthdate", "2000-01-01"),
                new Claim("sub", "test"),
            ], "mock"));

        sut = new PermitController(user,
                mockMediator.Object,
                configuration,
                mockPermitAppSubmitValidator.Object,
                mockPermitAppUpsertValidator.Object,
                mockRecaptch.Object,
                cache,
                mockDpProvider.Object);
    }

    [Fact]
    public async void GetLatestSecurityWorkerLicenceApplication_ReturnWorkerLicenceAppResponse()
    {
        Guid applicantId = Guid.NewGuid();
        var result = await sut.GetLatestPermitApplication(applicantId, WorkerLicenceTypeCode.ArmouredVehiclePermit);

        Assert.IsType<PermitLicenceAppResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_UploadPermitAppFilesAuthenticated_Return_Guid()
    {
        LicenceAppDocumentUploadRequest request = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BirthCertificate);

        var result = await sut.UploadPermitAppFiles(request, CancellationToken.None);

        Assert.IsType<Guid>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_UploadLicenceAppFilesAuthenticated_Return_LicenceAppDocumentResponse_List()
    {
        LicenceAppDocumentUploadRequest request = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BirthCertificate);

        var result = await sut.UploadLicenceAppFiles(request, Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<List<LicenceAppDocumentResponse>>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SavePermitLicenceApplication_Return_PermitCommandResponse()
    {
        PermitAppUpsertRequest request = new() { ApplicantId = Guid.NewGuid() };

        var result = await sut.SavePermitLicenceApplication(request);

        Assert.IsType<PermitAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SavePermitLicenceApplication_With_Empty_ApplicantId_Throw_Exception()
    {
        PermitAppUpsertRequest request = new();

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.SavePermitLicenceApplication(request));
    }

    [Fact]
    public async void Post_SubmitPermitApplication_Return_PermitCommandResponse()
    {
        PermitAppUpsertRequest request = new();

        var result = await sut.SubmitPermitApplication(request, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitPermitApplicationJsonAuthenticated_Replacement_Return_PermitAppCommandResponse()
    {
        var permitAppSubmitRequest = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Replacement);

        var result = await sut.SubmitPermitApplicationJsonAuthenticated(permitAppSubmitRequest, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitPermitApplicationJsonAuthenticated_Renewal_Return_PermitAppCommandResponse()
    {
        var permitAppSubmitRequest = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Renewal);

        var result = await sut.SubmitPermitApplicationJsonAuthenticated(permitAppSubmitRequest, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitPermitApplicationJsonAuthenticated_Update_Return_PermitAppCommandResponse()
    {
        var permitAppSubmitRequest = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Update);

        var result = await sut.SubmitPermitApplicationJsonAuthenticated(permitAppSubmitRequest, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitPermitApplicationJsonAuthenticated_With_ApplicationTypeCode_New_Throw_Exception()
    {
        var permitAppSubmitRequest = permitFixture.GenerateValidPermitAppSubmitRequest();

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.SubmitPermitApplicationJsonAuthenticated(permitAppSubmitRequest, CancellationToken.None));
    }
}