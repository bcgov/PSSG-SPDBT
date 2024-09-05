using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class LicenceManagerTest
{
    private readonly IFixture fixture;
    private Mock<ILicenceRepository> mockLicRepo = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<IMainFileStorageService> mockFileService = new();

    private LicenceManager sut;

    public LicenceManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<Mappings>();
        });
        var mapper = mapperConfig.CreateMapper();

        sut = new LicenceManager(mockLicRepo.Object,
            mockDocRepo.Object,
            null,
            mockFileService.Object,
            mapper);
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
    public async void Handle_LicenceListQuery_Return_LicenceBasicResponse_List()
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

        List<LicenceBasicResponse> licenceResponses = new()
        {
            new ()
            {
                LicenceId = licenceResp.LicenceId,
                LicenceAppId = licenceResp.LicenceAppId,
                LicenceNumber = licenceResp.LicenceNumber,
                LicenceHolderId = licenceResp.LicenceHolderId,
                LicenceStatusCode = Enum.Parse<LicenceStatusCode>(licenceResp.LicenceStatusCode.ToString())
            }
        };

        LicenceListQuery request = new(applicantId, null);

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.Equal(applicantId, result.First().LicenceHolderId);
    }

    [Fact]
    public async void Handle_LicenceByIdQuery_Return_LicenceResponse()
    {
        Guid licenceId = Guid.NewGuid();
        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.LicenceId, licenceId)
            .With(r => r.PermitPurposeEnums, new List<PermitPurpose>() { PermitPurpose.ProtectionOfPersonalProperty })
            .Create();

        mockLicRepo.Setup(m => m.GetAsync(It.Is<Guid>(g => g.Equals(licenceId)), It.IsAny<CancellationToken>()))
            .ReturnsAsync(licenceResp);

        LicenceByIdQuery request = new(licenceId);

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.Equal(licenceId, result.LicenceId);
    }
}
