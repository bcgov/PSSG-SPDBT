using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class BizLicenceAppManangerTest
{
    private readonly IFixture fixture;
    private Mock<ILicenceRepository> mockLicRepo = new();
    private Mock<IPersonLicApplicationRepository> mockLicAppRepo = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
    private Mock<IMainFileStorageService> mockMainFileService = new();
    private Mock<ITransientFileStorageService> mockTransientFileStorageService = new();
    private Mock<IBizLicApplicationRepository> mockBizLicAppRepo = new();
    private Mock<IBizContactRepository> mockBizContactRepo = new();
    private BizLicAppMananger sut;

    public BizLicenceAppManangerTest()
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

        sut = new BizLicAppMananger(
            mockLicRepo.Object,
            mockLicAppRepo.Object,
            mapper,
            mockDocRepo.Object,
            mockLicFeeRepo.Object,
            mockMainFileService.Object,
            mockTransientFileStorageService.Object,
            mockBizContactRepo.Object,
            mockBizLicAppRepo.Object);
    }

    [Fact]
    public async void Handle_GetBizLicAppQuery_Return_BizLicAppResponse()
    {
        // Arrange
        Guid licAppId = Guid.NewGuid();
        mockBizLicAppRepo.Setup(m => m.GetBizLicApplicationAsync(It.Is<Guid>(q => q == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BizLicApplicationResp()
            {
                LicenceAppId = licAppId,
                BizId = Guid.NewGuid()
            });
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());

        // Act
        var viewResult = await sut.Handle(new GetBizLicAppQuery(licAppId), CancellationToken.None);

        // Assert
        Assert.IsType<BizLicAppResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_BizLicAppUpsertCommand_WithoutLicAppId_Return_BizLicAppCommandResponse()
    {
        //Arrange
        //no duplicates; no licAppId: means create a brand new application.
        Guid bizId = Guid.NewGuid();
        Guid licAppId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == bizId), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        mockBizLicAppRepo.Setup(a => a.SaveBizLicApplicationAsync(It.IsAny<SaveBizLicApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new BizLicApplicationCmdResp(licAppId, bizId));
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());

        var workPermit = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.WorkPermit)
            .Create();

        Members members = new()
        {
            SwlControllingMembers = new List<SwlContactInfo>(),
            NonSwlControllingMembers = new List<NonSwlContactInfo>(),
            Employees = new List<SwlContactInfo>()
        };

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId,
            DocumentInfos = new List<Document>() { workPermit },
            Members = members
        };

        //Act
        var viewResult = await sut.Handle(new BizLicAppUpsertCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<BizLicAppCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_BizLicAppUpsertCommand_WithDuplicateLic_Throw_Exception()
    {
        //Arrange
        //have licAppId in the upsert request and there is duplicated same type active licence.
        Guid licAppId = Guid.NewGuid();
        Guid bizId = Guid.NewGuid();

        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                new() { LicenceAppId = licAppId }
            });
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == bizId), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp>
                {
                    new(){ LicenceId = Guid.NewGuid() }
                }
            });

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = licAppId,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId
        };

        //Act
        Func<Task> act = () => sut.Handle(new BizLicAppUpsertCommand(request), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppUpsertCommand_WithDuplicateApp_Throw_Exception()
    {
        //Arrange
        //have licAppId in the upsert request and there is duplicated same type active application.
        Guid licAppId = Guid.NewGuid();
        Guid bizId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                    new() { LicenceAppId = licAppId },
                    new() { LicenceAppId = Guid.NewGuid() } });

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = licAppId,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId,
        };

        //Act
        Func<Task> act = () => sut.Handle(new BizLicAppUpsertCommand(request), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppSubmitCommand_WithoutLicAppId_Return_BizLicAppCommandResponse()
    {
        //Arrange
        //no duplicates; no licAppId: means create a brand new application.
        Guid bizId = Guid.NewGuid();
        Guid licAppId = Guid.NewGuid();
        LicenceFeeResp licenceFeeResp = new() { Amount = 100 };
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == bizId), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        mockBizLicAppRepo.Setup(a => a.SaveBizLicApplicationAsync(It.IsAny<SaveBizLicApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new BizLicApplicationCmdResp(licAppId, bizId));
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());
        mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceFeeListResp() { LicenceFees = new List<LicenceFeeResp> { licenceFeeResp } });

        var workPermit = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.WorkPermit)
            .Create();

        Members members = new()
        {
            SwlControllingMembers = new List<SwlContactInfo>(),
            NonSwlControllingMembers = new List<NonSwlContactInfo>(),
            Employees = new List<SwlContactInfo>()
        };

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId,
            DocumentInfos = new List<Document>() { workPermit },
            Members = members
        };

        //Act
        var viewResult = await sut.Handle(new BizLicAppSubmitCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<BizLicAppCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
        Assert.Equal(licenceFeeResp.Amount, viewResult.Cost);
    }
}
