using AutoMapper;
using Microsoft.Dynamics.CRM;
using Moq;
using Spd.Manager.Licence;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.ControllingMemberInvite;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using Mappings = Spd.Manager.Licence.Mappings;

namespace Spd.Manager.Licence.UnitTest;
public class ControllingMemberCrcAppManagerTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IDocumentRepository> _documentRepositoryMock;
    private readonly Mock<ILicenceFeeRepository> _feeRepositoryMock;
    private readonly Mock<ILicenceRepository> _licenceRepositoryMock;
    private readonly Mock<IMainFileStorageService> _mainFileServiceMock;
    private readonly Mock<ITransientFileStorageService> _transientFileServiceMock;
    private readonly Mock<IControllingMemberCrcRepository> _controllingMemberCrcRepositoryMock;
    private readonly Mock<ILicAppRepository> _licAppRepositoryMock;
    private readonly Mock<IControllingMemberInviteRepository> _cmInviteRepositoryMock;
    private readonly Mock<IContactRepository> _contactRepositroyMock;
    private readonly Mock<IAliasRepository> _aliasRepositoryMock;

    private ControllingMemberCrcAppManager sut;

    public ControllingMemberCrcAppManagerTests()
    {
        _mapperMock = new Mock<IMapper>();
        _documentRepositoryMock = new Mock<IDocumentRepository>();
        _feeRepositoryMock = new Mock<ILicenceFeeRepository>();
        _licenceRepositoryMock = new Mock<ILicenceRepository>();
        _mainFileServiceMock = new Mock<IMainFileStorageService>();
        _transientFileServiceMock = new Mock<ITransientFileStorageService>();
        _controllingMemberCrcRepositoryMock = new Mock<IControllingMemberCrcRepository>();
        _licAppRepositoryMock = new Mock<ILicAppRepository>();
        _cmInviteRepositoryMock = new Mock<IControllingMemberInviteRepository>();
        _contactRepositroyMock = new Mock<IContactRepository>();
        _aliasRepositoryMock = new Mock<IAliasRepository>();
        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<Mappings>();
        });
        var mapper = mapperConfig.CreateMapper();

        sut = new ControllingMemberCrcAppManager(mapper, _documentRepositoryMock.Object,
        _feeRepositoryMock.Object,
        _licenceRepositoryMock.Object,
        _mainFileServiceMock.Object,
        _transientFileServiceMock.Object, _controllingMemberCrcRepositoryMock.Object, 
        _cmInviteRepositoryMock.Object,_contactRepositroyMock.Object, _aliasRepositoryMock.Object, _licAppRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_anonymous_submit_WhithValidRequest()
    {
        Guid applicantId = Guid.NewGuid();
        Guid controllingMemberAppId = Guid.NewGuid();
        Guid inviteId = Guid.NewGuid();
        ContactResp contact = new()
        {
            Id = applicantId,
        };
        SetupMockRepositories(applicantId, controllingMemberAppId, contact);

        // Arrange
        var request = new ControllingMemberCrcAppSubmitRequest
        {
            IsCanadianCitizen = true,
            IsPoliceOrPeaceOfficer = true,
            IsTreatedForMHC = false,
            InviteId = inviteId,
            ApplicantId = applicantId,
        };

        var command = new ControllingMemberCrcAppNewCommand(request,
            new List<LicAppFileInfo>
                {
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict },
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint },
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianPassport }
            });


        // Act
        var result = await sut.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsType<ControllingMemberCrcAppCommandResponse>(result);

        Assert.NotNull(result);
        Assert.Equal(result.ControllingMemberAppId, controllingMemberAppId);
        _mainFileServiceMock.Verify();
        _transientFileServiceMock.Verify();
    }


    [Fact]
    public async Task Handle_anonymous_submit_WhithoutFingerPrint_ShouldReturnError()
    {
        Guid applicantId = Guid.NewGuid();
        Guid controllingMemberAppId = Guid.NewGuid();
        ContactResp contact = new()
        {
            Id = applicantId,
        };
        SetupMockRepositories(applicantId, controllingMemberAppId, contact);

        // Arrange
        var request = new ControllingMemberCrcAppSubmitRequest
        {
            IsCanadianCitizen = true,
            IsPoliceOrPeaceOfficer = true,
            IsTreatedForMHC = false,
            ApplicantId = applicantId,
        };

        var command = new ControllingMemberCrcAppNewCommand(request,
            new List<LicAppFileInfo>
                {
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict },
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianPassport }
            });


        // Act and Assert
        Func<Task> act = () => sut.Handle(command, CancellationToken.None);
        await Assert.ThrowsAsync<ApiException>(act);
    }
    private void SetupMockRepositories(Guid applicantId, Guid controllingMemberAppId, ContactResp contact)
    {
        _licAppRepositoryMock.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
               .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        _licenceRepositoryMock.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        _controllingMemberCrcRepositoryMock.Setup(a => a.SaveControllingMemberCrcApplicationAsync(It.IsAny<SaveControllingMemberCrcAppCmd>(), CancellationToken.None))
            .ReturnsAsync(new ControllingMemberCrcApplicationCmdResp(controllingMemberAppId, applicantId));
        _documentRepositoryMock.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == controllingMemberAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp()
            {
                Items = new List<DocumentResp> { new() }
            });
        _transientFileServiceMock.Setup(m => m.HandleQuery(It.IsAny<FileMetadataQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new FileMetadataQueryResult("key", "folder", null));
        _mainFileServiceMock.Setup(m => m.HandleCopyStorageFromTransientToMainCommand(It.IsAny<CopyStorageFromTransientToMainCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("string");
        _transientFileServiceMock.Setup(m => m.HandleDeleteCommand(It.IsAny<StorageDeleteCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("string");
        _cmInviteRepositoryMock.Setup(i => i.QueryAsync(It.IsAny<ControllingMemberInviteQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ControllingMemberInviteResp>()
            {
                new ControllingMemberInviteResp()
                {
                    Status = ApplicationInviteStatusEnum.Sent
                }
            });
        _contactRepositroyMock.Setup(c => c.GetAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(contact);
    }
}