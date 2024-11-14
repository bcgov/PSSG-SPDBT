using AutoFixture;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence.UnitTest;

public class LicenceAppDocumentManagerTest
{
    private readonly IFixture fixture;
    private Mock<IPersonLicApplicationRepository> mockPersonLicAppRepo = new();
    private Mock<IMapper> mockMapper = new();
    private Mock<ITempFileStorageService> mockTempFileStorageService = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<IBizLicApplicationRepository> mockBizLicApplicationRepository = new();

    private LicenceAppDocumentManager sut;

    public LicenceAppDocumentManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        sut = new LicenceAppDocumentManager(mockPersonLicAppRepo.Object,
            mockBizLicApplicationRepository.Object,
            mockMapper.Object,
            mockTempFileStorageService.Object,
            mockDocRepo.Object);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_Return_LicenceAppDocumentResponse_List()
    {
        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.txt");
        file.Setup(f => f.ContentType).Returns("multipart/form-data");
        file.Setup(f => f.Length).Returns(1);

        var document = file.Object;

        LicenceAppDocumentUploadRequest request = new(Documents: new List<IFormFile> { document }, LicenceDocumentTypeCode: LicenceDocumentTypeCode.BirthCertificate);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(cmd.AppId)), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationResp());
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<CreateDocumentCmd>(m => m.ApplicantId == cmd.AppId), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());
        mockTempFileStorageService.Setup(m => m.HandleCommand(It.IsAny<SaveTempFileCommand>(), CancellationToken.None))
            .ReturnsAsync(Guid.NewGuid().ToString());
        mockDocRepo.Setup(m => m.ManageAsync(It.IsAny<CreateDocumentCmd>(), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<LicenceAppDocumentResponse[]>(result);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_WithBizBranding_Return_LicenceAppDocumentResponse_List()
    {
        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.txt");
        file.Setup(f => f.ContentType).Returns("multipart/form-data");
        file.Setup(f => f.Length).Returns(1);

        var document = file.Object;

        LicenceAppDocumentUploadRequest request = new(Documents: new List<IFormFile> { document }, LicenceDocumentTypeCode: LicenceDocumentTypeCode.BizBranding);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(cmd.AppId)), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationResp());
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<CreateDocumentCmd>(m => m.ApplicantId == cmd.AppId), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());
        mockTempFileStorageService.Setup(m => m.HandleCommand(It.IsAny<SaveTempFileCommand>(), CancellationToken.None))
            .ReturnsAsync(Guid.NewGuid().ToString());
        mockDocRepo.Setup(m => m.ManageAsync(It.IsAny<CreateDocumentCmd>(), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<LicenceAppDocumentResponse[]>(result);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_WithBizInsurance_Return_LicenceAppDocumentResponse_List()
    {
        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.txt");
        file.Setup(f => f.ContentType).Returns("multipart/form-data");
        file.Setup(f => f.Length).Returns(1);

        var document = file.Object;

        LicenceAppDocumentUploadRequest request = new(Documents: new List<IFormFile> { document }, LicenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(cmd.AppId)), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationResp());
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<CreateDocumentCmd>(m => m.ApplicantId == cmd.AppId), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());
        mockTempFileStorageService.Setup(m => m.HandleCommand(It.IsAny<SaveTempFileCommand>(), CancellationToken.None))
            .ReturnsAsync(Guid.NewGuid().ToString());
        mockDocRepo.Setup(m => m.ManageAsync(It.IsAny<CreateDocumentCmd>(), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<LicenceAppDocumentResponse[]>(result);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_WithArmourCarGuardRegistrar_Return_LicenceAppDocumentResponse_List()
    {
        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.txt");
        file.Setup(f => f.ContentType).Returns("multipart/form-data");
        file.Setup(f => f.Length).Returns(1);

        var document = file.Object;

        LicenceAppDocumentUploadRequest request = new(Documents: new List<IFormFile> { document }, LicenceDocumentTypeCode: LicenceDocumentTypeCode.ArmourCarGuardRegistrar);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(cmd.AppId)), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationResp());
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<CreateDocumentCmd>(m => m.ApplicantId == cmd.AppId), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());
        mockTempFileStorageService.Setup(m => m.HandleCommand(It.IsAny<SaveTempFileCommand>(), CancellationToken.None))
            .ReturnsAsync(Guid.NewGuid().ToString());
        mockDocRepo.Setup(m => m.ManageAsync(It.IsAny<CreateDocumentCmd>(), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<LicenceAppDocumentResponse[]>(result);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_WithBizSecurityDogCertificate_Return_LicenceAppDocumentResponse_List()
    {
        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.txt");
        file.Setup(f => f.ContentType).Returns("multipart/form-data");
        file.Setup(f => f.Length).Returns(1);

        var document = file.Object;

        LicenceAppDocumentUploadRequest request = new(Documents: new List<IFormFile> { document }, LicenceDocumentTypeCode: LicenceDocumentTypeCode.BizSecurityDogCertificate);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(cmd.AppId)), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationResp());
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<CreateDocumentCmd>(m => m.ApplicantId == cmd.AppId), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());
        mockTempFileStorageService.Setup(m => m.HandleCommand(It.IsAny<SaveTempFileCommand>(), CancellationToken.None))
            .ReturnsAsync(Guid.NewGuid().ToString());
        mockDocRepo.Setup(m => m.ManageAsync(It.IsAny<CreateDocumentCmd>(), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<LicenceAppDocumentResponse[]>(result);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_WithBizBCReport_Return_LicenceAppDocumentResponse_List()
    {
        var file = new Mock<IFormFile>();
        file.Setup(f => f.FileName).Returns("test.txt");
        file.Setup(f => f.ContentType).Returns("multipart/form-data");
        file.Setup(f => f.Length).Returns(1);

        var document = file.Object;

        LicenceAppDocumentUploadRequest request = new(Documents: new List<IFormFile> { document }, LicenceDocumentTypeCode: LicenceDocumentTypeCode.BizBCReport);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(cmd.AppId)), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationResp());
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<CreateDocumentCmd>(m => m.ApplicantId == cmd.AppId), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());
        mockTempFileStorageService.Setup(m => m.HandleCommand(It.IsAny<SaveTempFileCommand>(), CancellationToken.None))
            .ReturnsAsync(Guid.NewGuid().ToString());
        mockDocRepo.Setup(m => m.ManageAsync(It.IsAny<CreateDocumentCmd>(), CancellationToken.None))
            .ReturnsAsync(new DocumentResp());

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.NotNull(result);
        Assert.IsType<LicenceAppDocumentResponse[]>(result);
    }

    [Fact]
    public async void Handle_CreateDocumentInTransientStoreCommand_WithInvalidAppId_Throw_Exception()
    {
        LicenceAppDocumentUploadRequest request = new(Documents: [], LicenceDocumentTypeCode: LicenceDocumentTypeCode.BirthCertificate);
        CreateDocumentInTransientStoreCommand cmd = new(request, null, Guid.NewGuid());

        _ = await Assert.ThrowsAsync<ArgumentException>(async () => await sut.Handle(cmd, CancellationToken.None));
    }
}