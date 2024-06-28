using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.Tasks;
using Spd.Tests.Fixtures;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class PermitAppManagerTest
{
    private readonly IFixture fixture;
    private PermitFixture permitFixture;
    private Mock<ILicenceRepository> mockLicRepo = new();
    private Mock<IPersonLicApplicationRepository> mockPersonLicAppRepo = new();
    private Mock<ILicAppRepository> mockLicAppRepo = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<ITaskRepository> mockTaskAppRepo = new();
    private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
    private Mock<IContactRepository> mockContactRepo = new();
    private Mock<IMainFileStorageService> mockMainFileService = new();
    private Mock<ITransientFileStorageService> mockTransientFileStorageService = new();
    private PermitAppManager sut;

    public PermitAppManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        permitFixture = new PermitFixture();

        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<Mappings>();
        });
        var mapper = mapperConfig.CreateMapper();

        sut = new PermitAppManager(
            mockLicRepo.Object,
            mockPersonLicAppRepo.Object,
            mapper,
            mockDocRepo.Object,
            mockLicFeeRepo.Object,
            mockContactRepo.Object,
            mockTaskAppRepo.Object,
            mockMainFileService.Object,
            mockTransientFileStorageService.Object,
            mockLicAppRepo.Object);
    }

    [Fact]
    public async void Handle_GetLatestPermitApplicationQuery_WithoutApp_Throw_Exception()
    {
        //Arrange
        Guid applicantId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> { });

        //Act
        Func<Task> act = () => sut.Handle(new GetLatestPermitApplicationQuery(applicantId, WorkerLicenceTypeCode.SecurityBusinessLicence), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_GetLatestPermitApplicationQuery_ReturnCorrect()
    {
        //Arrange
        Guid applicantId = Guid.NewGuid();
        Guid applicationId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                    new() {ApplicationTypeCode = ApplicationTypeEnum.Update, LicenceAppId = applicationId}
            });
        mockPersonLicAppRepo.Setup(a => a.GetLicenceApplicationAsync(It.Is<Guid>(p => p == applicationId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceApplicationResp() { LicenceAppId = applicationId });
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(p => p.ApplicationId == applicationId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp { Items = new List<DocumentResp>() });

        //Act
        var viewResult = await sut.Handle(new GetLatestPermitApplicationQuery(applicantId, WorkerLicenceTypeCode.BodyArmourPermit), CancellationToken.None);

        //Assert
        Assert.Equal(applicationId, viewResult.LicenceAppId);
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
        mockPersonLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());

        var workPermit = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.WorkPermit)
            .Create();

        PermitAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            ApplicantId = applicantId,
            DocumentInfos = new List<Document>() { workPermit }
        };

        //Act
        var viewResult = await sut.Handle(new PermitUpsertCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<PermitAppCommandResponse>(viewResult);
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
    public async void Handle_PermitAppReplaceCommand_Return_PermitAppCommandResponse()
    {
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays + 1);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });
        mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());
        mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceFeeListResp());

        PermitAppSubmitRequest request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
        LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
        LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
        List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, photoOfYourself };
        PermitAppReplaceCommand cmd = new(request, licAppFileInfos);

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        Assert.Equal(licAppId, result.LicenceAppId);
    }

    [Fact]
    public async void Handle_PermitAppReplaceCommand_WithWrongApplicationTypeCode_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.New, licAppId);
        PermitAppReplaceCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppReplaceCommand_WithNoLicences_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
        PermitAppReplaceCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppReplaceCommand_WithInvalidExpirationDate_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
        PermitAppReplaceCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppReplaceCommand_WithNoOriginalApplicationId_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays + 1);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });
        mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
        request.OriginalApplicationId = null;
        PermitAppReplaceCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
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
        mockPersonLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
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
        Assert.IsType<PermitAppCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_PermitAppNewCommand_Return_PermitAppCommandResponse()
    {
        //Arrange
        PermitAppSubmitRequest request = fixture.Build<PermitAppSubmitRequest>()
            .With(r => r.IsCanadianCitizen, true)
            .Create();
        LicAppFileInfo canadianCitizenship = fixture.Build<LicAppFileInfo>()
            .With(i => i.LicenceDocumentTypeCode, LicenceDocumentTypeCode.CanadianCitizenship)
            .Create();
        LicAppFileInfo photoOfYourself = fixture.Build<LicAppFileInfo>()
            .With(i => i.LicenceDocumentTypeCode, LicenceDocumentTypeCode.PhotoOfYourself)
            .Create();

        Guid licAppId = Guid.NewGuid();
        Guid contactId = Guid.NewGuid();
        Guid originalApplicationId = Guid.NewGuid();
        mockPersonLicAppRepo.Setup(a => a.CreateLicenceApplicationAsync(It.IsAny<CreateLicenceApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, contactId));

        //Act
        var viewResult = await sut.Handle(new PermitAppNewCommand(request, new List<LicAppFileInfo>() { canadianCitizenship, photoOfYourself }), CancellationToken.None);

        //Assert
        Assert.IsType<PermitAppCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_PermitAppNewCommand_WithMissingFiles_Throw_Exception()
    {
        //Arrange
        PermitAppSubmitRequest request = fixture.Build<PermitAppSubmitRequest>()
            .With(r => r.IsCanadianCitizen, false)
            .Create();

        Guid licAppId = Guid.NewGuid();
        Guid contactId = Guid.NewGuid();
        Guid originalApplicationId = Guid.NewGuid();
        mockPersonLicAppRepo.Setup(a => a.CreateLicenceApplicationAsync(It.IsAny<CreateLicenceApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, contactId));

        //Act
        Func<Task> act = () => sut.Handle(new PermitAppNewCommand(request, new List<LicAppFileInfo>()), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_PermitAppRenewCommand_Return_PermitAppCommandResponse()
    {
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(1);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .With(r => r.LicenceTermCode, LicenceTermEnum.NinetyDays)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });
        mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
        mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
        .ReturnsAsync(new LicenceFeeListResp());

        PermitAppSubmitRequest request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);

        LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
        LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
        List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, photoOfYourself };
        PermitAppRenewCommand cmd = new(request, licAppFileInfos);

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        Assert.Equal(licAppId, result.LicenceAppId);
    }

    [Fact]
    public async void Handle_PermitAppRenewCommand_WithWrongApplicationTypeCode_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.New, licAppId);
        PermitAppRenewCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppRenewCommand_WithNoLicences_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
        PermitAppRenewCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppRenewCommand_WithInvalidExpirationDate_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays + 1);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
        PermitAppRenewCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppUpdateCommand_Return_PermitAppCommandResponse()
    {
        Guid licAppId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays + 1);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });
        mockLicRepo.Setup(a => a.ManageAsync(It.IsAny<UpdateLicenceCmd>(), CancellationToken.None))
            .ReturnsAsync(licenceResp);

        var existingdoc = fixture.Build<DocumentResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.LicenceId == licenceResp.LicenceId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp { Items = new List<DocumentResp> { existingdoc } });
        mockDocRepo.Setup(m => m.ManageAsync(It.Is<DeactivateDocumentCmd>(q => q.DocumentUrlId == existingdoc.DocumentUrlId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingdoc);
        mockTaskAppRepo.Setup(m => m.ManageAsync(It.IsAny<CreateTaskCmd>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new TaskResp());
        mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));

        PermitAppSubmitRequest request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Update, licAppId);
        request.PreviousDocumentIds = null;
        List<LicAppFileInfo> licAppFileInfos = new();

        PermitAppUpdateCommand cmd = new(request, licAppFileInfos);

        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.IsType<PermitAppCommandResponse>(result);
        Assert.Equal(licAppId, result.LicenceAppId);
    }

    [Fact]
    public async void Handle_PermitAppUpdateCommand_WithWrongApplicationTypeCode_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.New, licAppId);
        PermitAppUpdateCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppUpdateCommand_WithNoLicences_Throw_Exception()
    {
        //Arrange
        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        Guid licAppId = Guid.NewGuid();

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Update, licAppId);

        //Action
        PermitAppUpdateCommand cmd = new(request, []);
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_PermitAppUpdateCommand_WithInvalidExpirationDate_Throw_Exception()
    {
        Guid licAppId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(1);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

        LicenceResp licenceResp = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { licenceResp }
            });

        var request = permitFixture.GenerateValidPermitAppSubmitRequest(ApplicationTypeCode.Update, licAppId);
        PermitAppUpdateCommand cmd = new(request, []);

        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(act);
    }
}