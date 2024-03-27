using AutoMapper;
using Moq;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;

namespace Spd.Manager.Licence.UnitTest
{
    public class ApplicantProfileManagerTest
    {
        private Mock<IIdentityRepository> mockIdRepo = new();
        private Mock<ILicenceApplicationRepository> mockLicAppRepo = new();
        private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
        private Mock<IDocumentRepository> mockDocRepo = new();
        private Mock<IContactRepository> mockContactRepo = new();
        private Mock<IMapper> mockMapper = new();
        private ApplicantProfileManager sut;
        public ApplicantProfileManagerTest()
        {
            sut = new ApplicantProfileManager(mockIdRepo.Object,
                mockContactRepo.Object,
                mockMapper.Object,
                null,
                mockDocRepo.Object,
                mockLicFeeRepo.Object,
                mockLicAppRepo.Object);
        }

        [Fact]
        public async void Handle_ApplicantMergeCommand_Success()
        {
            //Arrange
            ApplicantMergeCommand cmd = new ApplicantMergeCommand(Guid.NewGuid(), Guid.NewGuid());
            mockContactRepo.Setup(a => a.MergeContactsAsync(It.IsAny<MergeContactsCmd>(), CancellationToken.None))
                .Verifiable();

            //Act
            Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);
        }


    }
}
