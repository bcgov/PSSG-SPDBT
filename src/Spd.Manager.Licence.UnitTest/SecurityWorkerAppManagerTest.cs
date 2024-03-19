using AutoMapper;
using Moq;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;

namespace Spd.Manager.Licence.UnitTest
{
    public class SecurityWorkerAppManagerTest
    {
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
            sut = new SecurityWorkerAppManager(mockLicRepo.Object,
                mockLicAppRepo.Object,
                mockMapper.Object,
                mockDocRepo.Object,
                mockTaskAppRepo.Object,
                mockLicFeeRepo.Object,
                mockContactRepo.Object);
        }

        [Fact]
        public async void Handle_WorkerLicenceUpsertCommand_Return_WorkerLicenceCommandResponse()
        {
            //Arrange
            WorkerLicenceAppUpsertRequest request = new WorkerLicenceAppUpsertRequest();

            //Act
            var viewResult = await sut.Handle(new WorkerLicenceUpsertCommand(request), CancellationToken.None);

            //Assert
            //Assert.IsType<OkResult>(viewResult);
            //mockService.Verify();
        }
    }
}
