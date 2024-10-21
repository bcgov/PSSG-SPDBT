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
using Spd.Presentation.Licensing.Controllers;
using Spd.Tests.Fixtures;
using Spd.Utilities.FileScanning;
using Spd.Utilities.Recaptcha;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class LicenceAppDocumentControllerTest
{
    private readonly IFixture fixture;
    private readonly PermitFixture permitFixture;
    private readonly Mock<IMediator> mockMediator = new();
    private readonly IDistributedCache cache = new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));
    private readonly Mock<IDataProtectionProvider> mockDpProvider = new();
    private readonly Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private readonly Mock<IFileScanProvider> mockFileScanProvider = new();
    private readonly LicenceAppDocumentController sut;

    private Dictionary<string, string> uploadFileConfiguration = new()
    {
        {"UploadFile:StreamFileFolder", "/tmp"},
        {"UploadFile:MaxFileSizeMB", "25"},
        {"UploadFile:AllowedExtensions", ".docx"},
        {"UploadFile:MaxAllowedNumberOfFiles", "10"}
    };
    public LicenceAppDocumentControllerTest()
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
        mockFileScanProvider.Setup(m => m.ScanAsync(It.IsAny<Stream>(), CancellationToken.None))
            .ReturnsAsync(new FileScanResult(ScanResult.Clean));

        var validationResults = fixture.Build<ValidationResult>()
            .With(r => r.Errors, [])
            .Create();


        var user = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim("birthdate", "2000-01-01"),
                new Claim("sub", "test"),
            ], "mock"));

        sut = new LicenceAppDocumentController(
                mockMediator.Object,
                cache,
                mockDpProvider.Object,
                user,
                mockRecaptch.Object,
                configuration,
                mockFileScanProvider.Object
                );
    }
    [Fact]
    public async void Post_UploadLicenceAppFiles_Return_LicenceAppDocumentResponse_List()
    {
        LicenceAppDocumentUploadRequest request = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance);

        var result = await sut.UploadLicenceAppFiles(request, Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<List<LicenceAppDocumentResponse>>(result);
        mockMediator.Verify();
    }
}
