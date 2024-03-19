
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.UnitTest.Controller
{
    public class ApplicantProfileControllerTest
    {
        private Mock<IPrincipal> mockUser = new();
        private Mock<IMediator> mockMediator = new();
        private Mock<IConfiguration> mockConfig = new();
        private Mock<IValidator<ApplicantUpdateRequest>> mockValidator = new();
        private Mock<IDistributedCache> mockCache = new();
        private Mock<IDataProtectionProvider> mockDpProvider = new();
        private Mock<IRecaptchaVerificationService> mockRecaptch = new();
        private ApplicantProfileController sut;
        public ApplicantProfileControllerTest()
        {
            mockMediator.Setup(m => m.Send(It.IsAny<GetApplicantProfileQuery>(), CancellationToken.None))
                .ReturnsAsync(new ApplicantProfileResponse());
            mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);
            sut = new ApplicantProfileController(null,
                mockUser.Object,
                mockMediator.Object,
                mockConfig.Object,
                mockValidator.Object,
                mockCache.Object,
                mockDpProvider.Object,
                mockRecaptch.Object);
        }

        [Fact]
        public async void Get_ApplicantInfo_Return_ApplicantProfileResponse()
        {
            //Act
            var viewResult = await sut.ApplicantInfo(Guid.NewGuid());

            //Assert
            Assert.IsType<ApplicantProfileResponse>(viewResult);
            mockMediator.Verify();
        }

    }
}
