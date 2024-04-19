using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class LicenceManagerTest
{
    private readonly IFixture fixture;
    private Mock<ILicenceRepository> mockLicRepo = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<IMainFileStorageService> mockFileService = new();
    private Mock<IMapper> mockMapper = new();

    private LicenceManager sut;

    public LicenceManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        sut = new LicenceManager(mockLicRepo.Object,
            mockDocRepo.Object,
            null,
            mockFileService.Object,
            mockMapper.Object);
    }

    [Fact]
    public async void Handle_LicencePhotoQuery_Return_FileResponse()
    {
        Guid licenceId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.LicenceId, licenceId)
                .With(r => r.LicenceHolderId, applicantId)
                .Create();

        mockLicRepo.Setup(m => m.QueryAsync(It.Is<LicenceQry>(q => q.LicenceId == licenceId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        DocumentResp document = fixture.Create<DocumentResp>();
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicantId == applicantId &&
            q.FileType == DocumentTypeEnum.Photograph), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp() { Items = new List<DocumentResp>() { document } });

        LicencePhotoQuery request = fixture.Build<LicencePhotoQuery>()
            .With(q => q.LicenceId, licenceId)
            .Create();

        FileQueryResult fileResult = fixture.Create<FileQueryResult>();
        mockFileService.Setup(m => m.HandleQuery(It.Is<FileQuery>(q => q.Key == document.DocumentUrlId.ToString() &&
            q.Folder == document.Folder), It.IsAny<CancellationToken>()))
            .ReturnsAsync(fileResult);

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<FileResponse>(result);
        Assert.NotEmpty(result.Content);
        Assert.NotNull(result.ContentType);
        Assert.NotNull(result.FileName);
    }

    [Fact]
    public async void Handle_LicencePhotoQuery_Return_Empty_FileResponse()
    {
        Guid licenceId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.LicenceId, licenceId)
                .With(r => r.LicenceHolderId, applicantId)
                .Create();

        mockLicRepo.Setup(m => m.QueryAsync(It.Is<LicenceQry>(q => q.LicenceId == licenceId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        LicencePhotoQuery request = fixture.Build<LicencePhotoQuery>()
            .With(q => q.LicenceId, licenceId)
            .Create();

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<FileResponse>(result);
        Assert.Empty(result.Content);
        Assert.Null(result.ContentType);
        Assert.Null(result.FileName);
    }

    [Fact]
    public async void Handle_LicencePhotoQuery_WithNoFiles_Return_Empty_FileResponse()
    {
        Guid licenceId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.LicenceId, licenceId)
                .With(r => r.LicenceHolderId, applicantId)
                .Create();

        mockLicRepo.Setup(m => m.QueryAsync(It.Is<LicenceQry>(q => q.LicenceId == licenceId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicantId == applicantId &&
            q.FileType == DocumentTypeEnum.Photograph), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());

        LicencePhotoQuery request = fixture.Build<LicencePhotoQuery>()
            .With(q => q.LicenceId, licenceId)
            .Create();

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<FileResponse>(result);
        Assert.Empty(result.Content);
        Assert.Null(result.ContentType);
        Assert.Null(result.FileName);
    }

    [Fact]
    public async void Handle_LicencePhotoQuery_WithNoLicences_Throw_Exception()
    {
        Guid licenceId = Guid.NewGuid();

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.LicenceId, licenceId)
                .Without(r => r.LicenceHolderId)
                .Create();

        mockLicRepo.Setup(m => m.QueryAsync(It.Is<LicenceQry>(q => q.LicenceId == licenceId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        LicencePhotoQuery request = fixture.Build<LicencePhotoQuery>()
            .With(q => q.LicenceId, licenceId)
            .Create();

        Func<Task> act = () => sut.Handle(request, CancellationToken.None);

        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_ApplicantLicenceListQuery_Return_LicenceResponse_List()
    {
        Guid applicantId = Guid.NewGuid();

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.LicenceHolderId, applicantId)
            .Create();

        mockLicRepo.Setup(m => m.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == applicantId && q.IncludeInactive == true), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        List<LicenceResponse> licenceResponses = new List<LicenceResponse>()
        {
            new LicenceResponse()
            {
                LicenceId = licenceResp.LicenceId,
                LicenceAppId = licenceResp.LicenceAppId,
                LicenceNumber = licenceResp.LicenceNumber,
                LicenceHolderId = licenceResp.LicenceHolderId,
                LicenceStatusCode = licenceResp.LicenceStatusCode
            }
        };

        mockMapper.Setup(m => m.Map<IEnumerable<LicenceResponse>>(It.Is<IEnumerable<LicenceResp>>(r => r.Any(r => r.LicenceStatusCode == LicenceStatusEnum.Active || r.LicenceStatusCode == LicenceStatusEnum.Expired))))
            .Returns(licenceResponses);

        ApplicantLicenceListQuery request = new ApplicantLicenceListQuery(applicantId);

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<List<LicenceResponse>>(result);
        Assert.Equal(applicantId, result.First().LicenceHolderId);
    }
}
