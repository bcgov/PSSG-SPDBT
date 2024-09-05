using AutoFixture;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.PortalUser;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;
using System.Text.Json;

namespace Spd.Manager.Licence.UnitTest
{
    public class BizProfileManagerTest
    {
        private readonly IFixture fixture;
        private Mock<IPortalUserRepository> mockPortalUserRepo = new();
        private Mock<IIdentityRepository> mockIdRepo = new();
        private Mock<IBizRepository> mockBizRepo = new();
        private Mock<IAddressRepository> mockAddressRepo = new();
        private Mock<IBCeIDService> mockBceidService = new();
        private Mock<ILogger<IBizProfileManager>> mockLogger = new();
        private BizProfileManager sut;

        public BizProfileManagerTest()
        {
            fixture = new Fixture();
            fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
            fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            fixture.Behaviors.Add(new OmitOnRecursionBehavior());

            var mapperConfig = new MapperConfiguration(x =>
            {
                x.AddProfile<Mappings>();
            });
            var mapper = mapperConfig.CreateMapper();

            sut = new BizProfileManager(mockIdRepo.Object,
                mockBizRepo.Object,
                mockPortalUserRepo.Object,
                mockAddressRepo.Object,
                mockBceidService.Object,
                mapper,
                mockLogger.Object);
        }

        [Fact]
        public async void Handle_BizLoginCommand_WithNoIdentityNoBiz_Return_BizUserLoginResponse()
        {
            // Arrange
            BceidIdentityInfo identityInfo = GetBceidIdentityInfo();
            Guid identityId = Guid.NewGuid();
            Guid bizId = Guid.NewGuid();
            Guid portalUserId = Guid.NewGuid();
            BizLoginCommand bizLogin = new(identityInfo, null);
            mockIdRepo.Setup(m => m.Query(It.Is<IdentityQry>(q => (q.UserGuid == identityInfo.UserGuid.ToString() && q.OrgGuid == identityInfo.BizGuid)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityQueryResult(new List<Identity>()));
            mockIdRepo.Setup(m => m.Manage(It.IsAny<CreateIdentityCmd>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityCmdResult() { Id = identityId });
            mockBizRepo.Setup(m => m.ManageBizAsync(It.Is<CreateBizCmd>(c => c.BizGuid == identityInfo.BizGuid), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult() { Id = bizId });
            mockPortalUserRepo.Setup(a => a.ManageAsync(
                It.Is<CreatePortalUserCmd>(c => c.IdentityId == identityId && c.OrgId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new PortalUserResp() { Id = portalUserId, OrganizationId = bizId });
            mockBceidService.Setup(a => a.HandleQuery(It.Is<BCeIDAccountDetailQuery>(q => q.UserGuid == identityInfo.UserGuid)))
                .ReturnsAsync(
                    new BCeIDUserDetailResult() { MailingAddress = new Utilities.BCeIDWS.Address { AddressLine1 = "test" } });

            // Action
            var result = await sut.Handle(bizLogin, CancellationToken.None);

            // Assert
            Assert.IsType<BizUserLoginResponse>(result);
            Assert.Equal(bizId, result.BizId);
            Assert.Equal(portalUserId, result.BizUserId);
        }

        [Fact]
        public async void Handle_BizLoginCommand_WithNoIdentityBizExists_Return_BizUserLoginResponse()
        {
            // Arrange
            BceidIdentityInfo identityInfo = GetBceidIdentityInfo();
            Guid identityId = Guid.NewGuid();
            Guid bizId = Guid.NewGuid();
            Guid portalUserId = Guid.NewGuid();
            BizLoginCommand bizLogin = new(identityInfo, bizId);
            mockBizRepo.Setup(m => m.GetBizAsync(It.Is<Guid>(c => c == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult()
                {
                    Id = bizId,
                    ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.SecurityBusinessLicence }
                });
            mockBizRepo.Setup(m => m.ManageBizAsync(It.Is<AddBizServiceTypeCmd>(c => c.BizId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult() { Id = bizId });
            mockIdRepo.Setup(m => m.Query(It.Is<IdentityQry>(q => (q.UserGuid == identityInfo.UserGuid.ToString() && q.OrgGuid == identityInfo.BizGuid)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityQueryResult(new List<Identity>()));
            mockIdRepo.Setup(m => m.Manage(It.IsAny<CreateIdentityCmd>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityCmdResult() { Id = identityId });
            mockPortalUserRepo.Setup(a => a.ManageAsync(It.Is<CreatePortalUserCmd>(c => c.IdentityId == identityId && c.OrgId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new PortalUserResp() { Id = portalUserId, OrganizationId = bizId });
            mockBceidService.Setup(a => a.HandleQuery(It.Is<BCeIDAccountDetailQuery>(q => q.UserGuid == identityInfo.UserGuid)))
                .ReturnsAsync(
                    new BCeIDUserDetailResult() { MailingAddress = new Utilities.BCeIDWS.Address { AddressLine1 = "test" } });

            // Action
            var result = await sut.Handle(bizLogin, CancellationToken.None);

            // Assert
            Assert.IsType<BizUserLoginResponse>(result);
            Assert.Equal(bizId, result.BizId);
            Assert.Equal(portalUserId, result.BizUserId);
        }

        [Fact]
        public async void Handle_BizLoginCommand_WithIdentityBizExists_NoPortalUser_Return_BizUserLoginResponse()
        {
            // Arrange
            BceidIdentityInfo identityInfo = GetBceidIdentityInfo();
            Guid identityId = Guid.NewGuid();
            Guid bizId = Guid.NewGuid();
            Guid portalUserId = Guid.NewGuid();
            BizLoginCommand bizLogin = new(identityInfo, bizId);
            mockBizRepo.Setup(m => m.GetBizAsync(It.Is<Guid>(c => c == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult()
                {
                    Id = bizId,
                    ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.SecurityBusinessLicence }
                });
            mockBizRepo.Setup(m => m.ManageBizAsync(It.Is<AddBizServiceTypeCmd>(c => c.BizId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult() { Id = bizId });
            mockIdRepo.Setup(m => m.Query(It.Is<IdentityQry>(q => (q.UserGuid == identityInfo.UserGuid.ToString() && q.OrgGuid == identityInfo.BizGuid)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityQueryResult(new List<Identity>()
                {
                    new(){Id = identityId}
                }));

            mockPortalUserRepo.Setup(a => a.ManageAsync(
                It.Is<CreatePortalUserCmd>(c => c.IdentityId == identityId && c.OrgId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new PortalUserResp() { Id = portalUserId, OrganizationId = bizId });
            mockBceidService.Setup(a => a.HandleQuery(It.Is<BCeIDAccountDetailQuery>(q => q.UserGuid == identityInfo.UserGuid)))
                .ReturnsAsync(
                    new BCeIDUserDetailResult() { MailingAddress = new Utilities.BCeIDWS.Address { AddressLine1 = "test" } });

            // Action
            var result = await sut.Handle(bizLogin, CancellationToken.None);

            // Assert
            Assert.IsType<BizUserLoginResponse>(result);
            Assert.Equal(bizId, result.BizId);
            Assert.Equal(portalUserId, result.BizUserId);
        }

        [Fact]
        public async void Handle_BizLoginCommand_WithIdentityBizExists_CurrentUserIsManager_Return_BizUserLoginResponse()
        {
            // Arrange
            BceidIdentityInfo identityInfo = GetBceidIdentityInfo();
            Guid identityId = Guid.NewGuid();
            Guid bizId = Guid.NewGuid();
            Guid portalUserId = Guid.NewGuid();
            BizLoginCommand bizLogin = new(identityInfo, bizId);
            mockBizRepo.Setup(m => m.GetBizAsync(It.Is<Guid>(c => c == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult()
                {
                    Id = bizId,
                    ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.SecurityBusinessLicence }
                });

            mockBizRepo.Setup(m => m.ManageBizAsync(It.Is<UpdateBizCmd>(c => c.BizGuid == identityInfo.BizGuid), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult()
                {
                    Id = bizId,
                    ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.SecurityBusinessLicence },
                    MailingAddress = new Addr() { AddressLine1 = "address line1" }
                });

            mockPortalUserRepo.Setup(a => a.QueryAsync(
                It.Is<PortalUserQry>(c => c.OrgId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(
                    new PortalUserListResp() { Items = new List<PortalUserResp> { new() } });

            mockIdRepo.Setup(m => m.Query(It.Is<IdentityQry>(q => (q.UserGuid == identityInfo.UserGuid.ToString() && q.OrgGuid == identityInfo.BizGuid)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityQueryResult(new List<Identity>()
                {
                    new(){Id = identityId}
                }));

            mockPortalUserRepo.Setup(a => a.QueryAsync(
                It.Is<PortalUserQry>(c => c.OrgId == bizId && c.IdentityId == identityId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(
                    new PortalUserListResp()
                    {
                        Items = new List<PortalUserResp>
                        {
                            new(){ Id = portalUserId, OrganizationId = bizId, ContactRoleCode = ContactRoleCode.PrimaryBusinessManager}
                        }
                    });

            mockBceidService.Setup(a => a.HandleQuery(It.Is<BCeIDAccountDetailQuery>(q => q.UserGuid == identityInfo.UserGuid)))
                .ReturnsAsync(
                    new BCeIDUserDetailResult() { MailingAddress = new Utilities.BCeIDWS.Address { AddressLine1 = "test" } });

            // Action
            var result = await sut.Handle(bizLogin, CancellationToken.None);

            // Assert
            Assert.IsType<BizUserLoginResponse>(result);
            Assert.Equal(bizId, result.BizId);
            Assert.Equal(portalUserId, result.BizUserId);
        }

        [Fact]
        public async void Handle_BizLoginCommand_WithIdentityBizExists_CurrentUserIsNotManager_Return_DenyAccess()
        {
            // Arrange
            BceidIdentityInfo identityInfo = GetBceidIdentityInfo();
            Guid identityId = Guid.NewGuid();
            Guid bizId = Guid.NewGuid();
            Guid portalUserId = Guid.NewGuid();
            BizLoginCommand bizLogin = new(identityInfo, bizId);
            mockBizRepo.Setup(m => m.GetBizAsync(It.Is<Guid>(c => c == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult()
                {
                    Id = bizId,
                    ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.SecurityBusinessLicence }
                });

            mockPortalUserRepo.Setup(a => a.QueryAsync(
                It.Is<PortalUserQry>(c => c.OrgId == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(
                    new PortalUserListResp() { Items = new List<PortalUserResp> { new() } });

            mockIdRepo.Setup(m => m.Query(It.Is<IdentityQry>(q => (q.UserGuid == identityInfo.UserGuid.ToString() && q.OrgGuid == identityInfo.BizGuid)), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new IdentityQueryResult(new List<Identity>()
                {
                    new(){Id = identityId}
                }));

            mockPortalUserRepo.Setup(a => a.QueryAsync(
                It.Is<PortalUserQry>(c => c.OrgId == bizId && c.IdentityId == identityId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(
                    new PortalUserListResp()
                    {
                        Items = new List<PortalUserResp> { }
                    });

            mockBceidService.Setup(a => a.HandleQuery(It.Is<BCeIDAccountDetailQuery>(q => q.UserGuid == identityInfo.UserGuid)))
                .ReturnsAsync(
                    new BCeIDUserDetailResult() { MailingAddress = new Utilities.BCeIDWS.Address { AddressLine1 = "test" } });

            // Action
            Func<Task> act = () => sut.Handle(bizLogin, CancellationToken.None);

            // Assert
            await Assert.ThrowsAsync<ApiException>(act);
        }

        [Fact]
        public async void Handle_GetBizsQuery_Success()
        {
            // Arrange
            Guid bizGuid = Guid.NewGuid();
            GetBizsQuery qry = new(bizGuid);
            mockBizRepo.Setup(a => a.QueryBizAsync(It.Is<BizsQry>(q => q.BizGuid == bizGuid), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BizResult> { new() { BizGuid = bizGuid, BizLegalName = "test" } });

            // Act
            var result = await sut.Handle(qry, CancellationToken.None);

            // Assert
            mockBizRepo.VerifyAll();
            Assert.NotNull(result);
            Assert.Equal("test", result.FirstOrDefault().BizLegalName);
            Assert.Equal(bizGuid, result.FirstOrDefault().BizGuid);
            Assert.True(result.Any());
        }

        [Fact]
        public async void Handle_BizTermAgreeCommand_Success()
        {
            // Arrange
            Guid bizUserId = Guid.NewGuid();
            BizTermAgreeCommand cmd = new(Guid.NewGuid(), bizUserId);
            mockPortalUserRepo.Setup(a => a.ManageAsync(
                It.Is<UpdatePortalUserCmd>(c => c.Id == bizUserId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new PortalUserResp());

            // Action
            var result = await sut.Handle(cmd, CancellationToken.None);

            // Assert
            Assert.IsType<Unit>(result);
        }

        [Fact]
        public async void Handle_GetBizProfileQuery_Success()
        {
            // Arrange
            Guid bizId = Guid.NewGuid();
            GetBizProfileQuery qry = new(bizId);
            mockBizRepo.Setup(a => a.GetBizAsync(It.Is<Guid>(g => g == bizId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new BizResult() { Id = bizId, BizName = "test" });

            // Action
            var result = await sut.Handle(qry, CancellationToken.None);

            // Assert
            Assert.IsType<BizProfileResponse>(result);
            Assert.Equal("test", result.BizTradeName);
            Assert.Equal(bizId, result.BizId);
        }

        [Fact]
        public async void Handle_BizProfileUpdateCommand_Success()
        {
            // Arrange
            Guid bizId = Guid.NewGuid();
            Guid bizUserId = Guid.NewGuid();
            Address address = fixture.Build<Address>()
                .With(a => a.AddressLine1, "address 1")
                .With(a => a.AddressLine1, "address 2")
                .With(a => a.PostalCode, "abc123")
                .Create();

            Address branchAddress = fixture.Build<Address>()
                .With(a => a.AddressLine1, "address 1")
                .With(a => a.AddressLine1, "address 2")
                .With(a => a.PostalCode, "abc123")
                .Create();

            BranchInfo existingBranch = fixture.Build<BranchInfo>()
                .With(a => a.BranchId, Guid.NewGuid())
                .With(a => a.BranchPhoneNumber, "90000000")
                .With(a => a.BranchAddress, branchAddress)
                .Create();

            BranchInfo newBranch = fixture.Build<BranchInfo>()
                .With(a => a.BranchPhoneNumber, "90000000")
                .With(a => a.BranchAddress, branchAddress)
                .Without(a => a.BranchId)
                .Create();

            BizProfileUpdateRequest request = fixture.Build<BizProfileUpdateRequest>()
                .With(c => c.BizTypeCode, BizTypeCode.NonRegisteredPartnership)
                .With(c => c.Branches, new List<BranchInfo>() { existingBranch, newBranch })
                .With(c => c.BizBCAddress, address)
                .Create();

            AddressResp addressResp = new()
            {
                BranchId = existingBranch.BranchId,
                BranchEmailAddr = existingBranch.BranchEmailAddr,
                BranchManager = existingBranch.BranchManager,
                BranchPhoneNumber = existingBranch.BranchPhoneNumber,
                AddressLine1 = existingBranch.BranchAddress.AddressLine1,
                AddressLine2 = existingBranch.BranchAddress.AddressLine2,
                PostalCode = existingBranch.BranchAddress.PostalCode,
                City = existingBranch.BranchAddress.City,
                Country = existingBranch.BranchAddress.Country,
                Province = existingBranch.BranchAddress.Province
            };

            BizProfileUpdateCommand cmd = new(bizId, request);
            mockAddressRepo.Setup(a => a.QueryAsync(
                It.Is<AddressQry>(q => q.OrganizationId == bizId && q.Type == AddressTypeEnum.Branch), It.IsAny<CancellationToken>()))
                    .ReturnsAsync(new List<AddressResp>() { addressResp });

            // Action
            var result = await sut.Handle(cmd, CancellationToken.None);

            // Assert
            Assert.IsType<Unit>(result);
        }

        private BceidIdentityInfo GetBceidIdentityInfo()
        {
            string test = @"{
                ""BCeIDUserName"": ""VictoriaTEST"",
                ""DisplayName"": ""TESTTester"",
                ""FirstName"": ""TestTester"",
                ""LastName"": """",
                ""PreferredUserName"": ""846597a702244ba0884bdc3ac8cb21b5@bceidbusiness"",
                ""UserGuid"": ""77777777-7777-7777-7777-777777777777"",
                ""BizGuid"": ""77777777-7777-7777-7777-777777777777"",
                ""BizName"": ""Victoria TEST"",
                ""Issuer"": ""https://dev.loginproxy.gov.bc.ca/auth/realms/standard"",
                ""EmailVerified"": false,
                ""Email"": ""test@test.com""
            }";
            return JsonSerializer.Deserialize<BceidIdentityInfo>(test);
        }
    }
}
