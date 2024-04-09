using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest
{
    public class ApplicantProfileManagerTest
    {
        private readonly IFixture fixture;
        private Mock<ILicenceApplicationRepository> mockLicAppRepo = new();
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
                mockDocRepo.Object,
                mockLicAppRepo.Object);
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
        public async void Handle_ApplicantUpdateCommand_WithAppInProgress_ShouldThrowException()
        {
            //Arrange
            ApplicantUpdateCommand cmd = new(Guid.NewGuid(), fixture.Create<ApplicantUpdateRequest>(), fixture.Create<IEnumerable<LicAppFileInfo>>());
            mockLicAppRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixture.Create<IEnumerable<LicenceAppListResp>>);

            //Act
            Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

            //Assert
            await Assert.ThrowsAsync<ApiException>(act);
        }
    }
}
