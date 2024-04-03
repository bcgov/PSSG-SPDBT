using AutoMapper;
using Moq;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;

namespace Spd.Manager.Licence.UnitTest
{
    public class ApplicantProfileManagerTest
    {
        private Mock<IIdentityRepository> mockIdRepo = new();
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
                mockDocRepo.Object);
        }

        [Fact]
        public async void Handle_GetApplicantProfileQuery_Return_ApplicantProfileResponse()
        {
            GetApplicantProfileQuery request = new(Guid.NewGuid());
            mockContactRepo.Setup(m => m.GetAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ContactResp());

            mockMapper.Setup(m => m.Map<ApplicantProfileResponse>(It.IsAny<ContactResp>()))
                .Returns(new ApplicantProfileResponse());
            mockDocRepo.Setup(m => m.QueryAsync(It.IsAny<DocumentQry>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp());

            var result = await sut.Handle(request, CancellationToken.None);

            Assert.IsType<ApplicantProfileResponse>(result);
        }

        [Fact]
        public async void Handle_ApplicantMergeCommand_Success()
        {
            ////Arrange
            ApplicantMergeCommand cmd = new(Guid.NewGuid(), Guid.NewGuid());
            mockContactRepo.Setup(a => a.MergeContactsAsync(It.IsAny<MergeContactsCmd>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            ////Act
            await sut.Handle(cmd, CancellationToken.None);

            ////Assert
            mockContactRepo.VerifyAll();
        }

    }
}
