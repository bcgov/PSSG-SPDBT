using AutoFixture;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.UnitTest.Controller;
public class PermitControllerTest
{
    private readonly IFixture fixture;
    private Mock<IPrincipal> mockUser = new();
    private Mock<IMediator> mockMediator = new();
    private Mock<IDistributedCache> mockCache = new();
    private Mock<IValidator<PermitAppSubmitRequest>> mockPermitAppSubmitValidator = new();
    private Mock<IDataProtectionProvider> mockDpProvider = new();
    private Mock<IRecaptchaVerificationService> mockRecaptch = new();
    private PermitController sut;

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

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(uploadFileConfiguration)
            .Build();

        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);

        sut = new PermitController(mockUser.Object,
                mockMediator.Object,
                configuration,
                mockPermitAppSubmitValidator.Object,
                mockRecaptch.Object,
                mockCache.Object,
                mockDpProvider.Object);
    }

    [Fact]
    public async void Post_UploadPermitAppFilesAuthenticated_Return_Guid()
    {
        LicenceAppDocumentUploadRequest licenceAppDocumentUploadRequest = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BirthCertificate);

        var result = await sut.UploadPermitAppFiles(licenceAppDocumentUploadRequest, CancellationToken.None);

        Assert.IsType<Guid>(result);
        mockMediator.Verify();
    }
}
