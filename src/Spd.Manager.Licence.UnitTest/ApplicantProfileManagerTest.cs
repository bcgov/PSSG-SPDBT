using AutoFixture;
using AutoMapper;
using MediatR;
using Moq;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.LicenceFee;

namespace Spd.Manager.Licence.UnitTest
{
    public class ApplicantProfileManagerTest
    {
        private readonly IFixture fixture;
        private Mock<IIdentityRepository> mockIdRepo = new();
        private Mock<IDocumentRepository> mockDocRepo = new();
        private Mock<IContactRepository> mockContactRepo = new();
        private Mock<IMapper> mockMapper = new();
        private ApplicantProfileManager sut;

        public ApplicantProfileManagerTest()
        {
            fixture = new Fixture();
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
            fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());

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

        [Fact]
        public async void Handle_ApplicantUpdateCommand_Success()
        {
            ApplicantUpdateRequest request = fixture.Build<ApplicantUpdateRequest>()
                .With(r => r.IsTreatedForMHC, false)
                .With(r => r.IsPoliceOrPeaceOfficer, false)
                .Without(r => r.PreviousDocumentIds)
                .Create();

            ApplicantUpdateCommand cmd = fixture.Build<ApplicantUpdateCommand>()
                .With(c => c.LicAppFileInfos, [])
                .With(c => c.ApplicantUpdateRequest, request)
                .Create();

            mockContactRepo.Setup(m => m.GetAsync(It.Is<Guid>(g => g.Equals(cmd.ApplicantId)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ContactResp());
            mockMapper.Setup(m => m.Map<UpdateContactCmd>(It.IsAny<ApplicantUpdateRequest>()))
                .Returns(new UpdateContactCmd());
            mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicantId == cmd.ApplicantId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentListResp() { Items = [] });

            var result = await sut.Handle(cmd, CancellationToken.None);

            Assert.IsType<Unit>(result);
        }
    }
}
