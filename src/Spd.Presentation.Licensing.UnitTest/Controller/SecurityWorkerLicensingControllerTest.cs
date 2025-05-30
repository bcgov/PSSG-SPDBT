﻿using System.Security.Principal;
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

public class SecurityWorkerLicensingControllerTest
{
    private readonly IFixture fixture;
    private readonly WorkerLicenceFixture workerLicenceFixture;
    private readonly Mock<IPrincipal> mockUser = new();
    private readonly Mock<IMediator> mockMediator = new();
    private readonly Mock<IValidator<WorkerLicenceAppUpsertRequest>> mockWslUpsertValidator = new();
    private readonly Mock<IValidator<WorkerLicenceAppSubmitRequest>> mockWslAnonymousSubmitValidator = new();
    private readonly IDistributedCache cache = new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));
    private readonly Mock<IDataProtectionProvider> mockDpProvider = new();
    private readonly Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private readonly SecurityWorkerLicensingController sut;

    private Dictionary<string, string> uploadFileConfiguration = new()
    {
        {"UploadFile:StreamFileFolder", "/tmp"},
        {"UploadFile:MaxFileSizeMB", "25"},
        {"UploadFile:AllowedExtensions", ".docx"},
        {"UploadFile:MaxAllowedNumberOfFiles", "10"}
    };

    public SecurityWorkerLicensingControllerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        workerLicenceFixture = new WorkerLicenceFixture();

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(uploadFileConfiguration)
            .Build();

        mockMediator.Setup(m => m.Send(It.IsAny<CreateDocumentInCacheCommand>(), CancellationToken.None))
               .ReturnsAsync(new List<LicAppFileInfo>());
        mockMediator.Setup(m => m.Send(It.IsAny<WorkerLicenceAppReplaceCommand>(), CancellationToken.None))
               .ReturnsAsync(new WorkerLicenceCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<WorkerLicenceAppRenewCommand>(), CancellationToken.None))
               .ReturnsAsync(new WorkerLicenceCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<WorkerLicenceAppUpdateCommand>(), CancellationToken.None))
               .ReturnsAsync(new WorkerLicenceCommandResponse());
        mockMediator.Setup(m => m.Send(It.IsAny<GetLatestWorkerLicenceApplicationIdQuery>(), CancellationToken.None))
               .ReturnsAsync(Guid.NewGuid());
        mockMediator.Setup(m => m.Send(It.IsAny<GetWorkerLicenceQuery>(), CancellationToken.None))
               .ReturnsAsync(new WorkerLicenceAppResponse());

        var validationResults = fixture.Build<ValidationResult>()
            .With(r => r.Errors, [])
            .Create();
        mockWslAnonymousSubmitValidator.Setup(x => x.ValidateAsync(It.IsAny<WorkerLicenceAppSubmitRequest>(), CancellationToken.None))
            .ReturnsAsync(validationResults);

        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);

        sut = new SecurityWorkerLicensingController(null,
                mockUser.Object,
                mockMediator.Object,
                configuration,
                mockWslUpsertValidator.Object,
                mockWslAnonymousSubmitValidator.Object,
                cache,
                mockDpProvider.Object,
                mockRecaptch.Object);
    }

    [Fact]
    public async void GetLatestSecurityWorkerLicenceApplication_ReturnWorkerLicenceAppResponse()
    {
        Guid applicantId = Guid.NewGuid();
        var result = await sut.GetLatestSecurityWorkerLicenceApplication(applicantId);

        Assert.IsType<WorkerLicenceAppResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitSecurityWorkerLicenceApplicationJsonAuthenticated_Replacement_Return_WorkerLicenceCommandResponse()
    {
        var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Replacement);

        var result = await sut.SubmitSecurityWorkerLicenceApplicationJsonAuthenticated(wLAppAnonymousSubmitRequest, CancellationToken.None);

        Assert.IsType<WorkerLicenceCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitSecurityWorkerLicenceApplicationJsonAuthenticated_Renewal_Return_WorkerLicenceCommandResponse()
    {
        var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Renewal);

        var result = await sut.SubmitSecurityWorkerLicenceApplicationJsonAuthenticated(wLAppAnonymousSubmitRequest, CancellationToken.None);

        Assert.IsType<WorkerLicenceCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitSecurityWorkerLicenceApplicationJsonAuthenticated_Update_Return_WorkerLicenceCommandResponse()
    {
        var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Update);

        var result = await sut.SubmitSecurityWorkerLicenceApplicationJsonAuthenticated(wLAppAnonymousSubmitRequest, CancellationToken.None);

        Assert.IsType<WorkerLicenceCommandResponse>(result);
        mockMediator.Verify();
    }

    [Fact]
    public async void Post_SubmitSecurityWorkerLicenceApplicationJsonAuthenticated_With_ApplicationTypeCode_New_Throw_Exception()
    {
        var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest();

        _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.SubmitSecurityWorkerLicenceApplicationJsonAuthenticated(wLAppAnonymousSubmitRequest, CancellationToken.None));
    }
}