using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class PermitAppManagerTest
{
    private readonly IFixture fixture;
    private Mock<ILicenceRepository> mockLicRepo = new();
    private Mock<ILicenceApplicationRepository> mockLicAppRepo = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<ITaskRepository> mockTaskAppRepo = new();
    private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
    private Mock<IContactRepository> mockContactRepo = new();
    private Mock<IMainFileStorageService> mockMainFileService = new();
    private Mock<ITransientFileStorageService> mockTransientFileStorageService = new();
    private Mock<IMapper> mockMapper = new();
    private PermitAppManager sut;

    public PermitAppManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        sut = new PermitAppManager(
            mockLicRepo.Object,
            mockLicAppRepo.Object,
            mockMapper.Object,
            mockDocRepo.Object,
            mockLicFeeRepo.Object,
            mockContactRepo.Object,
            mockTaskAppRepo.Object,
            mockMainFileService.Object,
            mockTransientFileStorageService.Object);
    }

    [Fact]
    public async void Handle_PermitUpsertCommand_WithoutLicAppId_Return_PermitCommandResponse()
    {
        //Arrange
        //no duplicates; no licAppId: means create a brand new application.
        Guid applicantId = Guid.NewGuid();
        Guid licAppId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == applicantId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == applicantId), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        mockLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
        mockMapper.Setup(m => m.Map<SaveLicenceApplicationCmd>(It.Is<PermitAppUpsertRequest>(r => r.ApplicantId == applicantId)))
            .Returns(new SaveLicenceApplicationCmd());
        mockMapper.Setup(m => m.Map<PermitCommandResponse>(It.IsAny<LicenceApplicationCmdResp>()))
            .Returns(new PermitCommandResponse() { LicenceAppId = licAppId });
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());
        
        var proofOfFingerprint = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.ProofOfFingerprint)
            .Create();
        var workPermit = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.WorkPermit)
            .Create();

        PermitAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            ApplicantId = applicantId,
            DocumentInfos = new List<Document>() { proofOfFingerprint, workPermit }
        };

        //Act
        var viewResult = await sut.Handle(new PermitUpsertCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<PermitCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_PermitUpsertCommand_WithDuplicateLic_Throw_Exception()
    {
        //Arrange
        //have licAppId in the upsert request and there is duplicated same type active licence.
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == applicantId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                new() { LicenceAppId = licAppId }
            });
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == applicantId), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp>
                {
                    new(){ LicenceId = Guid.NewGuid() }
                }
            });

        PermitAppUpsertRequest request = new()
        {
            LicenceAppId = licAppId,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            ApplicantId = applicantId,
        };

        //Act
        Func<Task> act = () => sut.Handle(new PermitUpsertCommand(request), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_PermitUpsertCommand_WithDuplicateApp_Throw_Exception()
    {
        //Arrange
        //have licAppId in the upsert request and there is duplicated same type active application.
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == applicantId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                    new() { LicenceAppId = licAppId },
                    new() { LicenceAppId = Guid.NewGuid() } });
        PermitAppUpsertRequest request = new()
        {
            LicenceAppId = licAppId,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            ApplicantId = applicantId,
        };

        //Act
        Func<Task> act = () => sut.Handle(new PermitUpsertCommand(request), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_PermitSubmitCommand_WithoutLicAppId_Return_PermitCommandResponse()
    {
        //Arrange
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == applicantId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == applicantId), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        mockLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
        mockMapper.Setup(m => m.Map<SaveLicenceApplicationCmd>(It.Is<PermitAppUpsertRequest>(r => r.ApplicantId == applicantId)))
            .Returns(new SaveLicenceApplicationCmd());
        mockMapper.Setup(m => m.Map<PermitCommandResponse>(It.IsAny<LicenceApplicationCmdResp>()))
            .Returns(new PermitCommandResponse() { LicenceAppId = licAppId });
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());
        PermitAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            ApplicantId = applicantId,
        };

        //Act
        var viewResult = await sut.Handle(new PermitSubmitCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<PermitCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }
}