using AutoFixture;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Controllers;
using System.Security.Claims;

namespace Spd.Presentation.Licensing.UnitTest.Controller
{
    public class LoginControllerTest
    {
        private readonly IFixture fixture;
        private Mock<IMediator> mockMediator = new();
        private LoginController sut;
        private Guid bizGuid = Guid.NewGuid();
        private Guid bizUserGuid = Guid.NewGuid();

        public LoginControllerTest()
        {
            fixture = new Fixture();
            fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());

            var user = new ClaimsPrincipal(new ClaimsIdentity(
                [
                    new Claim("bceid_user_guid", bizUserGuid.ToString()),
                    new Claim("bceid_business_guid", bizGuid.ToString()),
                ], "mock"));
            sut = new LoginController(null,
                user,
                mockMediator.Object);
        }

        [Fact]
        public async void Get_BizLicencePortalLogin_Return_LoginResponse()
        {
            //Arrange
            Guid bizId = Guid.NewGuid();
            mockMediator.Setup(m => m.Send(It.Is<BizLoginCommand>(q => q.BizId == bizId), CancellationToken.None))
                .ReturnsAsync(new BizUserLoginResponse() { BizId = bizId, BizUserId = Guid.NewGuid() });

            //Act
            var result = await sut.BizLicencePortalLogin(bizId);

            //Assert
            Assert.IsType<BizUserLoginResponse>(result);
            Assert.Equal(bizId, result.BizId);
            mockMediator.Verify();
        }

        [Fact]
        public async void Get_BizList_Return_AllBiz()
        {
            //Arrange
            Guid bizId = Guid.NewGuid();
            mockMediator.Setup(m => m.Send(It.Is<GetBizsQuery>(q => q.BizGuid == this.bizGuid), CancellationToken.None))
                .ReturnsAsync(new List<BizListResponse>() { new() { BizId = bizId, BizLegalName = "test" } });

            //Act
            var list = await sut.BizList();

            //Assert
            Assert.IsType<List<BizListResponse>>(list);
            Assert.Equal(bizId, list.First().BizId);
            mockMediator.Verify();
        }

        [Fact]
        public async void Get_BizLicencePortalTermAgree_Return_Ok()
        {
            //Arrange
            Guid bizId = Guid.NewGuid();
            mockMediator.Setup(m => m.Send(It.Is<BizTermAgreeCommand>(q => q.BizId == bizId), CancellationToken.None))
                .ReturnsAsync(new Unit());

            //Act
            ActionResult r = await sut.BizLicencePortalTermAgree(bizId, Guid.NewGuid());

            //Assert
            Assert.IsType<OkResult>(r);
            mockMediator.Verify();
        }
    }
}
