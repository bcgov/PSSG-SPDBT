using AutoFixture;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Tests.Fixtures;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest
{
    public class SecurityWorkerAppManagerTest
    {
        private readonly IFixture fixture;
        private WorkerLicenceFixture workerLicenceFixture;
        private Mock<ILicenceRepository> mockLicRepo = new();
        private Mock<ILicenceApplicationRepository> mockLicAppRepo = new();
        private Mock<IDocumentRepository> mockDocRepo = new();
        private Mock<ITaskRepository> mockTaskAppRepo = new();
        private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
        private Mock<IContactRepository> mockContactRepo = new();
        private Mock<IMapper> mockMapper = new();
        private SecurityWorkerAppManager sut;
        public SecurityWorkerAppManagerTest()
        {
            fixture = new Fixture();
            fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());
            workerLicenceFixture = new WorkerLicenceFixture(CancellationToken.None);

            sut = new SecurityWorkerAppManager(mockLicRepo.Object,
                mockLicAppRepo.Object,
                mockMapper.Object,
                mockDocRepo.Object,
                mockTaskAppRepo.Object,
                mockLicFeeRepo.Object,
                mockContactRepo.Object);
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
                    new LicenceAppListResp() { LicenceAppId = licAppId },
                    new LicenceAppListResp() { LicenceAppId = Guid.NewGuid() } });
            WorkerLicenceAppUpsertRequest request = new WorkerLicenceAppUpsertRequest()
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
        public async void Handle_WorkerLicenceUpsertCommand_WithDuplicateLic_Throw_Exception()
        {
            //Arrange
            //have licAppId in the upsert request and there is duplicated same type active licence.
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
                .ReturnsAsync(new List<LicenceAppListResp> {
                    new LicenceAppListResp() { LicenceAppId = licAppId }
                });
            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp>
                    {
                        new LicenceResp(){ LicenceId = Guid.NewGuid() }
                    }
                });

            WorkerLicenceAppUpsertRequest request = new WorkerLicenceAppUpsertRequest()
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
            mockLicAppRepo.Setup(a => a.SaveLicenceApplicationAsync(It.IsAny<SaveLicenceApplicationCmd>(), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockMapper.Setup(m => m.Map<SaveLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppUpsertRequest>()))
                .Returns(new SaveLicenceApplicationCmd());
            mockMapper.Setup(m => m.Map<WorkerLicenceCommandResponse>(It.IsAny<LicenceApplicationCmdResp>()))
                .Returns(new WorkerLicenceCommandResponse() { LicenceAppId = licAppId });
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(d => d.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp());
            WorkerLicenceAppUpsertRequest request = new WorkerLicenceAppUpsertRequest()
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
        public async void Handle_AnonymousWorkerLicenceAppReplaceCommand_Return_WorkerLicenceCommandResponse()
        {
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays + 1);
            DateOnly expiryDate = new DateOnly(dateTime.Year, dateTime.Month, dateTime.Day);

            LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .Create();

            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { licenceResp }
                });
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppAnonymousSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId});
            mockLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(d => d.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp());
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            AnonymousWorkerLicenceAppReplaceCommand request = new AnonymousWorkerLicenceAppReplaceCommand(wLAppAnonymousSubmitRequest, []);
            
            var result = await sut.Handle(request, CancellationToken.None);

            Assert.IsType<WorkerLicenceCommandResponse>(result);
            Assert.Equal(licAppId, result.LicenceAppId);
        }

        [Fact]
        public async void Handle_AnonymousWorkerLicenceAppReplaceCommand_WithWrongApplicationTypeCode_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode.New, licAppId);
            AnonymousWorkerLicenceAppReplaceCommand request = new AnonymousWorkerLicenceAppReplaceCommand(wLAppAnonymousSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_AnonymousWorkerLicenceAppReplaceCommand_WithNoLicences_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            AnonymousWorkerLicenceAppReplaceCommand request = new AnonymousWorkerLicenceAppReplaceCommand(wLAppAnonymousSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_AnonymousWorkerLicenceAppReplaceCommand_WithInvalidExpirationDate_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays);
            DateOnly expiryDate = new DateOnly(dateTime.Year, dateTime.Month, dateTime.Day);

            LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .Create();

            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { licenceResp }
                });

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            AnonymousWorkerLicenceAppReplaceCommand request = new AnonymousWorkerLicenceAppReplaceCommand(wLAppAnonymousSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_AnonymousWorkerLicenceAppReplaceCommand_WithNoOriginalApplicationId_Throw_Exception()
        {
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays + 1);
            DateOnly expiryDate = new DateOnly(dateTime.Year, dateTime.Month, dateTime.Day);

            LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .Create();

            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { licenceResp }
                });
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppAnonymousSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));

            var wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode.Replacement, licAppId);
            wLAppAnonymousSubmitRequest.OriginalApplicationId = null;
            AnonymousWorkerLicenceAppReplaceCommand request = new AnonymousWorkerLicenceAppReplaceCommand(wLAppAnonymousSubmitRequest, []);

            Func<Task> act = () => sut.Handle(request, CancellationToken.None);

            await Assert.ThrowsAsync<ArgumentException>(act);
        }

        [Fact]
        public async void Handle_AnonymousWorkerLicenceAppRenewCommand_Return_WorkerLicenceCommandResponse()
        {
            Guid licAppId = Guid.NewGuid();
            Guid applicantId = Guid.NewGuid();
            DateTime dateTime = DateTime.UtcNow.AddDays(-1);
            DateOnly expiryDate = new DateOnly(dateTime.Year, dateTime.Month, dateTime.Day);

            LicenceResp licenceResp = fixture.Build<LicenceResp>()
                .With(r => r.ExpiryDate, expiryDate)
                .With(r => r.LicenceTermCode, LicenceTermEnum.NinetyDays)
                .Create();

            mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
                .ReturnsAsync(new LicenceListResp()
                {
                    Items = new List<LicenceResp> { licenceResp }
                });
            mockMapper.Setup(m => m.Map<CreateLicenceApplicationCmd>(It.IsAny<WorkerLicenceAppAnonymousSubmitRequest>()))
                .Returns(new CreateLicenceApplicationCmd() { OriginalApplicationId = licAppId });
            mockMapper.Setup(m => m.Map<CreateDocumentCmd>(It.IsAny<LicAppFileInfo>()))
                .Returns(new CreateDocumentCmd());
            mockLicAppRepo.Setup(m => m.CreateLicenceApplicationAsync(It.Is<CreateLicenceApplicationCmd>(c => c.OriginalApplicationId == licAppId), CancellationToken.None))
                .ReturnsAsync(new LicenceApplicationCmdResp(licAppId, applicantId));
            mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new LicenceFeeListResp());

            WorkerLicenceAppAnonymousSubmitRequest wLAppAnonymousSubmitRequest = workerLicenceFixture.GenerateValidWorkerLicenceAppAnonymousSubmitRequest(ApplicationTypeCode.Renewal, licAppId);
            wLAppAnonymousSubmitRequest.PreviousDocumentIds = null;
            wLAppAnonymousSubmitRequest.HasLegalNameChanged = false;
            wLAppAnonymousSubmitRequest.IsPoliceOrPeaceOfficer = false;
            wLAppAnonymousSubmitRequest.HasNewMentalHealthCondition = false;
            wLAppAnonymousSubmitRequest.IsCanadianCitizen = true;
            wLAppAnonymousSubmitRequest.CategoryCodes = new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.BodyArmourSales };

            LicAppFileInfo canadianCitizenship = new LicAppFileInfo() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianCitizenship };
            LicAppFileInfo proofOfFingerprint = new LicAppFileInfo() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint };
            LicAppFileInfo photoOfYourself = new LicAppFileInfo() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself };
            List<LicAppFileInfo> licAppFileInfos = new List<LicAppFileInfo>() { canadianCitizenship, proofOfFingerprint, photoOfYourself };
            AnonymousWorkerLicenceAppRenewCommand request = new AnonymousWorkerLicenceAppRenewCommand(wLAppAnonymousSubmitRequest, licAppFileInfos);

            var result = await sut.Handle(request, CancellationToken.None);

            Assert.IsType<WorkerLicenceCommandResponse>(result);
            Assert.Equal(licAppId, result.LicenceAppId);
        }
    }
}