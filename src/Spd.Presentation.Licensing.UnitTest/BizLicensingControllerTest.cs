﻿using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using System.Security.Claims;

namespace Spd.Presentation.Licensing.UnitTest;
public class BizLicensingControllerTest
{
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
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(uploadFileConfiguration)
            .Build();

        mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);
        mockMediator.Setup(m => m.Send(It.IsAny<CreateDocumentInTransientStoreCommand>(), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppDocumentResponse>());

        var user = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim("birthdate", "2000-01-01"),
                new Claim("sub", "test"),
            ], "mock"));

        sut = new BizLicensingController(user,
            mockMediator.Object,
            configuration,
            mockRecaptch.Object,
            mockCache.Object,
            mockDpProvider.Object);
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
