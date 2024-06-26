using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.User;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Screening.UnitTest;

public class OrgUserManagerTest
{
    private readonly IFixture fixture;
    private Mock<IOrgUserRepository> mockOrgUserRepo = new();
    private Mock<IOrgRepository> mockOrgRepo = new();
    private Mock<IIdentityRepository> mockIdRepo = new();
    private OrgUserManager sut;

    public OrgUserManagerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<OrgUserMappings>();
        });
        var mapper = mapperConfig.CreateMapper();

        sut = new OrgUserManager(mockOrgUserRepo.Object,
            mapper,
            mockOrgRepo.Object,
            mockIdRepo.Object);
    }

    [Fact]
    public async void Handle_RegisterBceidPrimaryUser_WithIdentityExist_NotInOrg_CanHavePrimary_Return_Correct_OrgUserResponse()
    {
        //Arrange
        Guid userGuid = Guid.NewGuid();
        Guid orgGuid = Guid.NewGuid();
        Guid orgId = Guid.NewGuid();
        mockIdRepo.Setup(id => id.Query(
                It.Is<IdentityQry>(i => i.UserGuid == userGuid.ToString() && i.OrgGuid == orgGuid && i.IdentityProviderType == Resource.Repository.Registration.IdentityProviderTypeEnum.BusinessBceId),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new IdentityQueryResult(new List<Identity> { new() }));
        mockOrgUserRepo.Setup(u => u.QueryOrgUserAsync(
                It.IsAny<OrgUsersSearch>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((OrgUsersResult)null);
        mockOrgUserRepo.Setup(m => m.ManageOrgUserAsync(
                It.IsAny<UserCreateCmd>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OrgUserManageResult(fixture.Create<UserResult>()));
        mockOrgRepo.Setup(org => org.ManageOrgAsync(
            It.IsAny<OrgGuidUpdateCmd>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(fixture.Create<OrgManageResult>());
        var bceid = fixture.Build<BceidIdentityInfo>()
            .With(b => b.UserGuid, userGuid)
            .With(b => b.BizGuid, orgGuid)
            .Create();
        RegisterBceidPrimaryUserCommand cmd = new(orgId, bceid);

        //Act
        var result = await sut.Handle(cmd, CancellationToken.None);

        //Assert
        Assert.IsType<OrgUserResponse>(result);
    }

    [Fact]
    public async void Handle_RegisterBceidPrimaryUser_WithIdentityNonExist_NotInOrg_CanHavePrimary_Return_Correct_OrgUserResponseWithIdentityCreated()
    {
        //Arrange
        Guid userGuid = Guid.NewGuid();
        Guid orgGuid = Guid.NewGuid();
        Guid orgId = Guid.NewGuid();
        mockIdRepo.Setup(id => id.Query(
                It.Is<IdentityQry>(i => i.UserGuid == userGuid.ToString() && i.OrgGuid == orgGuid && i.IdentityProviderType == Resource.Repository.Registration.IdentityProviderTypeEnum.BusinessBceId),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((IdentityQueryResult)null);
        mockIdRepo.Setup(id => id.Manage(
                It.IsAny<CreateIdentityCmd>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(fixture.Create<IdentityCmdResult>());
        mockOrgRepo.Setup(org => org.ManageOrgAsync(
            It.IsAny<OrgGuidUpdateCmd>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(fixture.Create<OrgManageResult>());
        mockOrgUserRepo.Setup(u => u.QueryOrgUserAsync(
                It.IsAny<OrgUsersSearch>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((OrgUsersResult)null);
        mockOrgUserRepo.Setup(m => m.ManageOrgUserAsync(
                It.IsAny<UserCreateCmd>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OrgUserManageResult(fixture.Create<UserResult>()));
        
        var bceid = fixture.Build<BceidIdentityInfo>()
            .With(b => b.UserGuid, userGuid)
            .With(b => b.BizGuid, orgGuid)
            .Create();
        RegisterBceidPrimaryUserCommand cmd = new(orgId, bceid);

        //Act
        var result = await sut.Handle(cmd, CancellationToken.None);

        //Assert
        Assert.IsType<OrgUserResponse>(result);
    }

    [Fact]
    public async void Handle_RegisterBceidPrimaryUser_WithUserInOrg_ThrowArgument()
    {
        //Arrange
        Guid userGuid = Guid.NewGuid();
        Guid orgGuid = Guid.NewGuid();
        Guid orgId = Guid.NewGuid();

        UserResult userResult = fixture.Build<UserResult>().With(u => u.UserGuid, userGuid).Create();
        var orgUserResults = fixture.Build<OrgUsersResult>()
            .With(o => o.UserResults, new List<UserResult> { userResult })
            .Create();
        mockIdRepo.Setup(id => id.Query(
                It.Is<IdentityQry>(i => i.UserGuid == userGuid.ToString() && i.OrgGuid == orgGuid && i.IdentityProviderType == Resource.Repository.Registration.IdentityProviderTypeEnum.BusinessBceId),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new IdentityQueryResult(new List<Identity> { new() }));
        mockOrgUserRepo.Setup(u => u.QueryOrgUserAsync(
                It.IsAny<OrgUsersSearch>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(orgUserResults);
        var bceid = fixture.Build<BceidIdentityInfo>()
            .With(b => b.UserGuid, userGuid)
            .With(b => b.BizGuid, orgGuid)
            .Create();
        RegisterBceidPrimaryUserCommand cmd = new(orgId, bceid);

        //Act
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_RegisterBceidPrimaryUser_WithUserNotInOrgNoPrimaryRoleAvailable_ThrowArgument()
    {
        //Arrange
        Guid userGuid = Guid.NewGuid();
        Guid orgGuid = Guid.NewGuid();
        Guid orgId = Guid.NewGuid();

        UserResult userResult1 = fixture.Build<UserResult>().With(u => u.ContactAuthorizationTypeCode, ContactRoleCode.Primary).Create();
        UserResult userResult2 = fixture.Build<UserResult>().With(u => u.ContactAuthorizationTypeCode, ContactRoleCode.Primary).Create();
        var orgUserResults = fixture.Build<OrgUsersResult>()
            .With(o => o.UserResults, new List<UserResult> { userResult1, userResult2 })
            .Create();
        mockIdRepo.Setup(id => id.Query(
                It.Is<IdentityQry>(i => i.UserGuid == userGuid.ToString() && i.OrgGuid == orgGuid && i.IdentityProviderType == Resource.Repository.Registration.IdentityProviderTypeEnum.BusinessBceId),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new IdentityQueryResult(new List<Identity> { new() }));
        mockOrgUserRepo.Setup(u => u.QueryOrgUserAsync(
                It.IsAny<OrgUsersSearch>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(orgUserResults);
        var bceid = fixture.Build<BceidIdentityInfo>()
            .With(b => b.UserGuid, userGuid)
            .With(b => b.BizGuid, orgGuid)
            .Create();
        RegisterBceidPrimaryUserCommand cmd = new(orgId, bceid);

        //Act
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

}