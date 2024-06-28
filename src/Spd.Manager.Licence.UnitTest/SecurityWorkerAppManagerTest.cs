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

namespace Spd.Manager.Licence.UnitTest
{
    public class SecurityWorkerAppManagerTest
    {
        private readonly IFixture fixture;
        private WorkerLicenceFixture workerLicenceFixture;
        private Mock<ILicenceRepository> mockLicRepo = new();
        private Mock<IPersonLicApplicationRepository> mockPersonLicAppRepo = new();
        private Mock<ILicAppRepository> mockLicAppRepo = new();
        private Mock<IDocumentRepository> mockDocRepo = new();
        private Mock<ITaskRepository> mockTaskAppRepo = new();
        private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
        private Mock<IContactRepository> mockContactRepo = new();
        private Mock<IMainFileStorageService> mockMainFileService = new();
        private Mock<ITransientFileStorageService> mockTransientFileStorageService = new();
        private Mock<IMapper> mockMapper = new();
        private SecurityWorkerAppManager sut;
        public SecurityWorkerAppManagerTest()
        {
            fixture = new Fixture();
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
            fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());
            workerLicenceFixture = new WorkerLicenceFixture();

            sut = new SecurityWorkerAppManager(mockLicRepo.Object,
                mockPersonLicAppRepo.Object,
                mockLicAppRepo.Object,
                mockMapper.Object,
                mockDocRepo.Object,
                mockTaskAppRepo.Object,
                mockLicFeeRepo.Object,
                mockContactRepo.Object,
                mockMainFileService.Object,
                mockTransientFileStorageService.Object);
        }

        [Fact]
        public async void Handle_GetLatestWorkerLicenceQuery_WithoutApp_Throw_Exception()
        {
            //Arrange
            Guid applicantId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp> {
                    new() {ApplicationTypeCode = ApplicationTypeEnum.Replacement}
                });

            //Act
            Func<Task> act = () => sut.Handle(new GetLatestWorkerLicenceQuery(applicantId), CancellationToken.None);

            //Assert
            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_GetLatestWorkerLicenceQuery_ReturnCorrect()
        {
            //Arrange
            Guid applicantId = Guid.NewGuid();
            Guid applicationId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp> {
                    new() {ApplicationTypeCode = ApplicationTypeEnum.Update, LicenceAppId=applicationId}
                });
            mockPersonLicAppRepo.Setup(a => a.GetLicenceApplicationAsync(It.Is<Guid>(p => p == applicationId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationResp() { LicenceAppId = applicationId });
            mockMapper.Setup(m => m.Map<WorkerLicenceAppResponse>(It.IsAny<LicenceApplicationResp>()))
                .Returns(new WorkerLicenceAppResponse() { LicenceAppId = applicationId });
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(p => p.ApplicationId == applicationId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp { Items = new List<DocumentResp>() });

            //Act
            var viewResult = await sut.Handle(new GetLatestWorkerLicenceQuery(applicantId), CancellationToken.None);

            //Assert
            Assert.Equal(applicationId, viewResult.LicenceAppId);
        }

        [Fact]
        public async void Handle_WorkerLicenceUpsertCommand_WithDuplicateApp_Throw_Exception()
        {
            //Arrange
            //have licAppId in the upsert request and there is duplicated same type active application.
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp> {
                    new() { LicenceAppId = licAppId },
                    new() { LicenceAppId = Guid.NewGuid() } });
            WorkerLicenceAppUpsertRequest request = new()
            {
                LicenceAppId = licAppId,
                WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
                ApplicantId = applicantId,
            };

            //Act
            Func<Task> act = () => sut.Handle(new WorkerLicenceUpsertCommand(request), CancellationToken.None);

            //Assert
            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceSubmitCommand_Return_WorkerLicenceCommandResponse()
        {
            //Arrange
            //no duplicates; 
            Guid applicantId = Guid.NewGuid();
            Guid licAppId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { }
                });
            mockPersonLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockMapper.Setup(m => m.Map<SaveLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppUpsertRequest>()))
                .Returns(new SaveLicenceApplicationCmd());
            mockMapper.Setup(m => m.Map<WorkerLicenceCommandResponse>(It.IsAny<LicenceApplicationCmdResp>()))
                .Returns(new WorkerLicenceCommandResponse() { LicenceAppId = licAppId });
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp()
                {
                    Items = new List<DocumentResp> { new() }
                });
            mockTransientFileStorageService.Setup(m => m.HandleQuery(It.IsAny<FileMetadataQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new FileMetadataQueryResult("key", "folder", null));
            mockMainFileService.Setup(m => m.HandleCopyStorageFromTransientToMainCommand(It.IsAny<CopyStorageFromTransientToMainCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync("string");
            mockTransientFileStorageService.Setup(m => m.HandleDeleteCommand(It.IsAny<StorageDeleteCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync("string");
            WorkerLicenceAppUpsertRequest request = new()
            {
                LicenceAppId = licAppId,
                WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
                ApplicantId = applicantId,
            };

            //Act
            var viewResult = await sut.Handle(new WorkerLicenceSubmitCommand(request), CancellationToken.None);

            //Assert
            Assert.IsType<WorkerLicenceCommandResponse>(viewResult);
            Assert.Equal(licAppId, viewResult.LicenceAppId);
            mockMainFileService.Verify();
            mockTransientFileStorageService.Verify();
        }

        [Fact]
        public async void Handle_WorkerLicenceUpsertCommand_WithDuplicateLic_Throw_Exception()
        {
            //Arrange
            //have licAppId in the upsert request and there is duplicated same type active licence.
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp> {
                    new() { LicenceAppId = licAppId }
                });
            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp>
                    {
                        new(){ LicenceId = Guid.NewGuid() }
                    }
                });

            WorkerLicenceAppUpsertRequest request = new()
            {
                LicenceAppId = licAppId,
                WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
                ApplicantId = applicantId,
            };

            //Act
            Func<Task> act = () => sut.Handle(new WorkerLicenceUpsertCommand(request), CancellationToken.None);

            //Assert
            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceUpsertCommand_WithoutLicAppId_Return_WorkerLicenceCommandResponse()
        {
            //Arrange
            //no duplicates; no licAppId: means create a brand new application.
            Guid applicantId = Guid.NewGuid();
            Guid licAppId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { }
                });
            mockPersonLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockMapper.Setup(m => m.Map<SaveLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppUpsertRequest>()))
                .Returns(new SaveLicenceApplicationCmd());
            mockMapper.Setup(m => m.Map<WorkerLicenceCommandResponse>(It.IsAny<LicenceApplicationCmdResp>()))
                .Returns(new WorkerLicenceCommandResponse() { LicenceAppId = licAppId });
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp());
            WorkerLicenceAppUpsertRequest request = new()
            {
                LicenceAppId = null,
                WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
                ApplicantId = applicantId,
            };

            //Act
            var viewResult = await sut.Handle(new WorkerLicenceUpsertCommand(request), CancellationToken.None);

            //Assert
            Assert.IsType<WorkerLicenceCommandResponse>(viewResult);
            Assert.Equal(licAppId, viewResult.LicenceAppId);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppReplaceCommand_Return_WorkerLicenceCommandResponse()
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp());
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            WorkerLicenceAppReplaceCommand request = new(swlAppSubmitRequest, []);

            var result = await sut.Handle(request, CancellationToken.None);

            Assert.IsType<WorkerLicenceCommandResponse>(result);
            Assert.Equal(licAppId, result.LicenceAppId);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppReplaceCommand_WithWrongApplicationTypeCode_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.New, licAppId);
            WorkerLicenceAppReplaceCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppReplaceCommand_WithNoLicences_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            WorkerLicenceAppReplaceCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppReplaceCommand_WithInvalidExpirationDate_Throw_Exception()
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

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            WorkerLicenceAppReplaceCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppReplaceCommand_WithNoOriginalApplicationId_Throw_Exception()
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            swlAppSubmitRequest.OriginalApplicationId = null;
            WorkerLicenceAppReplaceCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppRenewCommand_Return_WorkerLicenceCommandResponse()
        {
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(-1);
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());

            WorkerLicenceAppSubmitRequest request = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);

            LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, proofOfFingerprint, photoOfYourself };
            WorkerLicenceAppRenewCommand cmd = new(request, licAppFileInfos);

            var result = await sut.Handle(cmd, CancellationToken.None);

            Assert.IsType<WorkerLicenceCommandResponse>(result);
            Assert.Equal(licAppId, result.LicenceAppId);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppRenewCommand_AnonymousRequest_WithoutMentalHealthDocument_Should_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(-1);
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());

            WorkerLicenceAppSubmitRequest request = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
            request.HasNewMentalHealthCondition = true;

            LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, proofOfFingerprint, photoOfYourself };
            WorkerLicenceAppRenewCommand cmd = new(request, licAppFileInfos);

            Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppRenewCommand_AnonymousRequest_WithoutPoliceBackgroundLetter_Should_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(-1);
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());

            WorkerLicenceAppSubmitRequest request = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
            request.IsPoliceOrPeaceOfficer = true;

            LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, proofOfFingerprint, photoOfYourself };
            WorkerLicenceAppRenewCommand cmd = new(request, licAppFileInfos);

            Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppRenewCommand_WithWrongApplicationTypeCode_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.New, licAppId);
            WorkerLicenceAppRenewCommand request = new(wLAppAnonymousSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppRenewCommand_WithNoLicences_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
            WorkerLicenceAppRenewCommand request = new(wLAppAnonymousSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppRenewCommand_WithInvalidExpirationDate_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays + 1);
            DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);

            LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .Create();

            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { licenceResp }
                });

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
            WorkerLicenceAppRenewCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppUpdateCommand_Return_WorkerLicenceCommandResponse()
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });

            LicenceApplicationResp originalApp = fixture.Build<LicenceApplicationResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .With(r => r.LicenceAppId, licAppId)
                .Create();
            mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(licAppId)), CancellationToken.None))
                .ReturnsAsync(originalApp);

            mockTaskAppRepo.Setup(m => m.ManageAsync(It.IsAny<CreateTaskCmd>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new TaskResp());
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockMapper.Setup(m => m.Map<UpdateContactCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new UpdateContactCmd());
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());

            WorkerLicenceAppSubmitRequest request = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Update, licAppId);

            LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, proofOfFingerprint, photoOfYourself };

            WorkerLicenceAppUpdateCommand cmd = new(request, licAppFileInfos);

            var result = await sut.Handle(cmd, CancellationToken.None);

            Assert.IsType<WorkerLicenceCommandResponse>(result);
            Assert.Equal(licAppId, result.LicenceAppId);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppUpdateCommand_AnonymousRequest_WithoutMentalHealthDocument_Should_Throw_Exception()
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });

            LicenceApplicationResp originalApp = fixture.Build<LicenceApplicationResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .With(r => r.LicenceAppId, licAppId)
                .Create();
            mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(licAppId)), CancellationToken.None))
                .ReturnsAsync(originalApp);

            mockTaskAppRepo.Setup(m => m.ManageAsync(It.IsAny<CreateTaskCmd>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new TaskResp());
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockMapper.Setup(m => m.Map<UpdateContactCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new UpdateContactCmd());
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());

            WorkerLicenceAppSubmitRequest request = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Update, licAppId);
            request.HasNewMentalHealthCondition = true;

            LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, proofOfFingerprint, photoOfYourself };
            WorkerLicenceAppUpdateCommand cmd = new(request, licAppFileInfos);

            Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppUpdateCommand_AnonymousRequest_WithoutPoliceBackgroundLetter_Should_Throw_Exception()
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
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });

            LicenceApplicationResp originalApp = fixture.Build<LicenceApplicationResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .With(r => r.LicenceAppId, licAppId)
                .Create();
            mockPersonLicAppRepo.Setup(m => m.GetLicenceApplicationAsync(It.Is<Guid>(g => g.Equals(licAppId)), CancellationToken.None))
                .ReturnsAsync(originalApp);

            mockTaskAppRepo.Setup(m => m.ManageAsync(It.IsAny<CreateTaskCmd>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new TaskResp());
            mockPersonLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockMapper.Setup(m => m.Map<UpdateContactCmd>(It.IsAny<WorkerLicenceAppSubmitRequest>()))
                .Returns(new UpdateContactCmd());
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());

            WorkerLicenceAppSubmitRequest request = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Update, licAppId);
            request.IsPoliceOrPeaceOfficer = true;

            LicAppFileInfo canadianCitizenship = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new() { canadianCitizenship, proofOfFingerprint, photoOfYourself };
            WorkerLicenceAppUpdateCommand cmd = new(request, licAppFileInfos);

            Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppUpdateCommand_WithWrongApplicationTypeCode_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.New, licAppId);
            WorkerLicenceAppUpdateCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppUpdateCommand_WithNoLicences_Throw_Exception()
        {
            //Arrange
            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { }
                });
            Guid licAppId = Guid.NewGuid();

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Update, licAppId);

            //Action
            WorkerLicenceAppUpdateCommand request = new(swlAppSubmitRequest, []);
            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            //Assert
            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_WorkerLicenceAppUpdateCommand_WithInvalidExpirationDate_Throw_Exception()
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

            var swlAppSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppSubmitRequest(ApplicationTypeCode.Update, licAppId);
            WorkerLicenceAppUpdateCommand request = new(swlAppSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }
    }
}