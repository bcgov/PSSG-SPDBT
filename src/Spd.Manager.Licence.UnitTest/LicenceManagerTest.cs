using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DogTeam;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class LicenceManagerTest
{
    private readonly IFixture fixture;
    private readonly Mock<ILicenceRepository> mockLicRepo = new();
    private readonly Mock<IDocumentRepository> mockDocRepo = new();
    private readonly Mock<IMainFileStorageService> mockFileService = new();
    private readonly Mock<IIncidentRepository> mockIncidentRepo = new();
    private readonly Mock<IBizRepository> mockBizRepo = new();
    private readonly Mock<IDogTeamRepository> mockDogTeamRepo = new();

    private readonly LicenceManager sut;

    public LicenceManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<Mappings>();
        }, null);
        var mapper = mapperConfig.CreateMapper();

        sut = new LicenceManager(mockLicRepo.Object,
            mockDocRepo.Object,
            null,
            mockFileService.Object,
            mockIncidentRepo.Object,
            mockBizRepo.Object,
            mockDogTeamRepo.Object,
            mapper);
    }

    [Fact]
    public async void Handle_LicencePhotoQuery_Return_FileResponse()
    {
        Guid licenceId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        Guid photoDocumentUrlId = Guid.NewGuid();

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.LicenceId, licenceId)
                .With(r => r.LicenceHolderId, applicantId)
                .With(r => r.PhotoDocumentUrlId, photoDocumentUrlId)
                .Create();

        mockLicRepo.Setup(m => m.GetAsync(It.Is<Guid>(q => q == licenceId), It.IsAny<CancellationToken>()))
           .ReturnsAsync(licenceResp);

        DocumentResp document = fixture.Build<DocumentResp>()
            .With(r => r.LicenceId, licenceId)
            .Create();
        mockDocRepo.Setup(m => m.GetAsync(It.Is<Guid>(q => q == photoDocumentUrlId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(document);

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

        mockLicRepo.Setup(m => m.GetAsync(It.Is<Guid>(q => q == licenceId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(licenceResp);

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
        mockLicRepo.Setup(m => m.GetAsync(It.Is<Guid>(q => q == licenceId), It.IsAny<CancellationToken>()))
                   .ReturnsAsync(licenceResp);

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
            .With(r => r.PermitPurposeEnums, new List<PermitPurposeEnum>() { PermitPurposeEnum.ProtectionOfPersonalProperty })
            .Create();

        mockLicRepo.Setup(m => m.GetAsync(It.Is<Guid>(g => g.Equals(licenceId)), It.IsAny<CancellationToken>()))
            .ReturnsAsync(licenceResp);

        LicenceByIdQuery request = new(licenceId);

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.Equal(licenceId, result.LicenceId);
    }
}
