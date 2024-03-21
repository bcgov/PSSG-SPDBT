using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Configurations;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class SecurityWorkerLicensingControllerTest
{
    private Mock<IPrincipal> mockUser = new();
    private Mock<IMediator> mockMediator = new();
    //private Mock<IConfiguration> mockConfig = new();

    private Dictionary<string, string> inMemorySettings = new Dictionary<string, string> {
        {"UploadFile:StreamFileFolder", "/tmp"},
        {"UploadFile:MaxFileSizeMB", "25"},
        {"UploadFile:AllowedExtensions", ".docx"},
        {"UploadFile:MaxAllowedNumberOfFiles", "10"}
    };

    private Mock<IConfigurationSection> mockConfigSection = new();
    private Mock<IValidator<WorkerLicenceAppSubmitRequest>> mockWslSubmitValidator = new();
    private Mock<IValidator<WorkerLicenceAppUpsertRequest>> mockWslUpsertValidator = new();
    private Mock<IValidator<WorkerLicenceAppAnonymousSubmitRequest>> mockWslAnonymousSubmitValidator = new();
    private Mock<IDistributedCache> mockCache = new();
    private Mock<IDataProtectionProvider> mockDpProvider = new();
    private Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private SecurityWorkerLicensingController sut;

    public SecurityWorkerLicensingControllerTest()
    {
        IConfiguration configuration = new ConfigurationBuilder()
        .AddInMemoryCollection(inMemorySettings)
        .Build();
        //mockConfigSection.Setup(m => m.Value).Returns(string.Empty);

        mockConfigSection.SetReturnsDefault(new UploadFileConfiguration());
        //mockConfig.SetReturnsDefault(new UploadFileConfiguration());
        //mockConfig.Setup(m => m.GetSection(It.IsAny<string>())).Returns(mockConfigSection.Object);
        mockMediator.Setup(m => m.Send(It.IsAny<CreateDocumentInCacheCommand>(), CancellationToken.None))
               .ReturnsAsync(new List<LicAppFileInfo>());
        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);
        sut = new SecurityWorkerLicensingController(null,
                mockUser.Object,
                mockMediator.Object,
                configuration,
                mockWslSubmitValidator.Object,
                mockWslUpsertValidator.Object,
                mockWslAnonymousSubmitValidator.Object,
                mockCache.Object,
                mockDpProvider.Object,
                mockRecaptch.Object);
    }

    [Fact]
    public async void Post_UploadLicenceAppFilesAuthenticated_Return_Guid()
    {
        LicenceAppDocumentUploadRequest licenceAppDocumentUploadRequest = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BirthCertificate);

        var result = await sut.UploadLicenceAppFilesAuthenticated(licenceAppDocumentUploadRequest, CancellationToken.None);

        Assert.IsType<Guid>(result);
        mockMediator.Verify();
    }
}
