using AutoFixture;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.UnitTest.Controller
{
    public class ApplicantProfileControllerTest
    {
        private readonly IFixture fixture;
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
            fixture = new Fixture();
            fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());

            mockMediator.Setup(m => m.Send(It.IsAny<GetApplicantProfileQuery>(), CancellationToken.None))
                .ReturnsAsync(new ApplicantProfileResponse());
            mockDpProvider.Setup(m => m.CreateProtector(It.IsAny<string>()))
                .Returns(new Mock<ITimeLimitedDataProtector>().Object);

            var validationResults = fixture.Build<ValidationResult>()
                .With(r => r.Errors, [])
                .Create();
            mockValidator.Setup(x => x.ValidateAsync(It.IsAny<ApplicantUpdateRequest>(), CancellationToken.None))
                .ReturnsAsync(validationResults);

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

        [Fact]
        public async void MergeApplicants_Return_Ok()
        {
            //Arrange
            mockMediator.Setup(m => m.Send(It.IsAny<ApplicantMergeCommand>(), CancellationToken.None))
                .ReturnsAsync(new Unit());

            //Act
            var viewResult = await sut.MergeApplicants(Guid.NewGuid(), Guid.NewGuid());

            //Assert
            Assert.IsType<OkResult>(viewResult);
            mockMediator.Verify();
        }

        [Fact]
        public async void Put_UpdateApplicant_Return_Guid()
        {
            ApplicantUpdateRequest request = new();
            string applicantId = Guid.NewGuid().ToString();
            mockMediator.Setup(m => m.Send(It.IsAny<ApplicantUpdateCommand>(), CancellationToken.None))
                .ReturnsAsync(new Unit());

            var result = await sut.UpdateApplicant(applicantId, request, CancellationToken.None);

            Assert.IsType<Guid>(result);
            Assert.Equal(applicantId, result.ToString());
            mockMediator.Verify();
        }

        [Fact]
        public async void Put_UpdateApplicant_With_Invalid_Guid_Throw_Exception()
        {
            ApplicantUpdateRequest request = new();

            _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.UpdateApplicant("123", request, CancellationToken.None));
        }

        [Fact]
        public async void Put_UpdateApplicant_With_Invalid_Request_Throw_Exception()
        {
            ApplicantUpdateRequest request = new();
            var validationResults = fixture.Create<ValidationResult>();
            mockValidator.Setup(x => x.ValidateAsync(It.IsAny<ApplicantUpdateRequest>(), CancellationToken.None))
                .ReturnsAsync(validationResults);

            _ = await Assert.ThrowsAsync<ApiException>(async () => await sut.UpdateApplicant(Guid.NewGuid().ToString(), request, CancellationToken.None));
        }
    }
}
