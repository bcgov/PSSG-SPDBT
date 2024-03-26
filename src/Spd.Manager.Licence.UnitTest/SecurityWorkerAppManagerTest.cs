using AutoFixture;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Spd.Manager.Shared;
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
    }
}
