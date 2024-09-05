using AutoFixture;
using AutoMapper;
using MediatR;
using Moq;
using Spd.Manager.Screening;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Users;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence.UnitTest;
public class BizPortalUserManagerTest
{
    private readonly IFixture fixture;
    private Mock<IPortalUserRepository> mockPortalUserRepo = new();
    private Mock<IBizRepository> mockBizRepo = new();

    private BizPortalUserManager sut;

    public BizPortalUserManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<BizPortalUserMapping>();
        });
        var mapper = mapperConfig.CreateMapper();

        sut = new BizPortalUserManager(mapper, mockPortalUserRepo.Object, mockBizRepo.Object);
    }

    [Fact]
    public async void Handle_BizPortalUserCreateCommand_Return_BizPortalUserResponse()
    {   
    }

    [Fact]
    public async void Handle_BizPortalUserUpdateCommand_Return_BizPortalUserResponse()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();
        BizPortalUserUpdateRequest bizPortalUserUpdateRequest = new()
        {
            Id = userId,
            BizId = bizId,
            ContactAuthorizationTypeCode = Shared.ContactAuthorizationTypeCode.PrimaryBusinessManager,
            FirstName = "test",
            LastName = "test",
            Email = "user@test.com",
            JobTitle = "dev",
            PhoneNumber = "9001234567"
        };
        BizPortalUserUpdateCommand cmd = new(userId, bizPortalUserUpdateRequest);
        PortalUserResp portalUserResp1 = new() 
        {   
            Id = userId,
            OrganizationId = bizId, 
            ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager,
            UserEmail = "test1@test.com"
        };
        PortalUserResp portalUserResp2 = new()
        {
            Id = Guid.NewGuid(),
            OrganizationId = bizId,
            ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager,
            UserEmail = "test2@test.com"
        };

        PortalUserListResp portalUserListResp = new()
        {
            Items = new List<PortalUserResp>() { portalUserResp1, portalUserResp2 }
        };
        PortalUserResp updatedPortalUserResp = new()
        {
            Id = userId,
            OrganizationId = bizId,
            ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager,
            UserEmail = "user@test.com"
        };

        mockPortalUserRepo.Setup(m => m.QueryAsync(It.Is<PortalUserQry>(q => q.OrgId == bizId), CancellationToken.None))
            .ReturnsAsync(portalUserListResp);
        mockBizRepo.Setup(m => m.GetBizAsync(It.Is<Guid>(g => g == bizId), CancellationToken.None))
            .ReturnsAsync(new BizResult());
        mockPortalUserRepo.Setup(m => m.ManageAsync(It.Is<UpdatePortalUserCmd>(q => q.Id == userId && q.OrgId == bizId), CancellationToken.None))
            .ReturnsAsync(updatedPortalUserResp);

        // Act
        var result = await sut.Handle(cmd, CancellationToken.None);

        Assert.IsType<BizPortalUserResponse>(result);
        Assert.Equal(updatedPortalUserResp.Id.ToString(), result.Id.ToString());
        Assert.Equal(updatedPortalUserResp.OrganizationId.ToString(), result.BizId.ToString());
        Assert.Equal(updatedPortalUserResp.UserEmail, result.Email);
    }

    [Fact]
    public async void Handle_BizPortalUserUpdateCommand_WithDuplicatedEmail_ShouldThrowException()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();
        BizPortalUserUpdateRequest bizPortalUserUpdateRequest = new()
        {
            Id = userId,
            BizId = bizId,
            ContactAuthorizationTypeCode = Shared.ContactAuthorizationTypeCode.PrimaryBusinessManager,
            FirstName = "test",
            LastName = "test",
            Email = "test@test.com"
        };
        PortalUserResp portalUserResp1 = new()
        {
            Id = userId,
            OrganizationId = bizId,
            ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager,
            UserEmail = "test1@test.com"
        };
        PortalUserResp portalUserResp2 = new()
        {
            Id = Guid.NewGuid(),
            OrganizationId = bizId,
            ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager,
            UserEmail = "test@test.com"
        };
        PortalUserListResp portalUserListResp = new()
        {
            Items = new List<PortalUserResp>() { portalUserResp1, portalUserResp2 }
        };

        mockPortalUserRepo.Setup(m => m.QueryAsync(It.Is<PortalUserQry>(q => q.OrgId == bizId), CancellationToken.None))
            .ReturnsAsync(portalUserListResp);

        // Act
        Func<Task> act = () => sut.Handle(new BizPortalUserUpdateCommand(userId, bizPortalUserUpdateRequest), CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<DuplicateException>(act);
    }

    [Fact]
    public async void Handle_BizPortalUserUpdateCommand_UserNotFound_ShouldThrowException()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();
        BizPortalUserUpdateRequest bizPortalUserUpdateRequest = new()
        {
            Id = userId,
            BizId = bizId,
            ContactAuthorizationTypeCode = Shared.ContactAuthorizationTypeCode.PrimaryBusinessManager,
            FirstName = "test",
            LastName = "test",
            Email = "user@test.com"
        };
        PortalUserResp portalUserResp = new()
        {
            Id = Guid.NewGuid(),
            OrganizationId = bizId,
            ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager,
            UserEmail = "test@test.com"
        };
        PortalUserListResp portalUserListResp = new()
        {
            Items = new List<PortalUserResp>() { portalUserResp }
        };

        mockPortalUserRepo.Setup(m => m.QueryAsync(It.Is<PortalUserQry>(q => q.OrgId == bizId), CancellationToken.None))
            .ReturnsAsync(portalUserListResp);

        // Act
        Func<Task> act = () => sut.Handle(new BizPortalUserUpdateCommand(userId, bizPortalUserUpdateRequest), CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<NotFoundException>(act);
    }

    [Fact]
    public async void Handle_BizPortalUserListQuery_Return_BizPortalUserResponse()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        BizPortalUserListQuery qry = new(bizId);
        PortalUserResp portalUserResp = new() { OrganizationId = bizId, ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager };
        PortalUserListResp portalUserListResp = new()
        {
            Items = new List<PortalUserResp>() { portalUserResp }
        };

        mockPortalUserRepo.Setup(m => m.QueryAsync(It.Is<PortalUserQry>(q => q.OrgId == bizId), CancellationToken.None))
            .ReturnsAsync(portalUserListResp);
        mockBizRepo.Setup(m => m.GetBizAsync(It.Is<Guid>(q => q == bizId), CancellationToken.None))
            .ReturnsAsync(new BizResult());

        // Act
        var result = await sut.Handle(qry, CancellationToken.None);

        // Assert
        Assert.IsType<BizPortalUserListResponse>(result);
        Assert.True(result.Users.Any(u => u.BizId == bizId));
    }
    [Fact]
    public async void Handle_BizPortalUserGetQuery_Return_BizPortalUserResponse()
    {
        // Arrange
        Guid userId = Guid.NewGuid();
        BizPortalUserGetQuery qry = new(userId);
        PortalUserResp portalUserResp = new() { Id = userId, ContactRoleCode = ContactRoleCode.PrimaryBusinessManager };
       
        mockPortalUserRepo.Setup(m => m.QueryAsync(It.Is<PortalUserByIdQry>(q => q.UserId == userId), CancellationToken.None))
            .ReturnsAsync(portalUserResp);
        // Act
        var result = await sut.Handle(qry, CancellationToken.None);

        // Assert
        Assert.IsType<BizPortalUserResponse>(result);
        Assert.True(result.Id == userId);
    }
    [Fact]
    public async void Handle_BizPortalUserDeleteCommand_Return_Correct_BizPortalUserResponse()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();
        PortalUserResp existingUser = new() { ContactRoleCode = ContactRoleCode.PrimaryBusinessManager };
        PortalUserResp userToDelete = fixture.Build<PortalUserResp>()
            .With(u => u.OrganizationId, bizId)
            .With(u => u.ContactRoleCode, ContactRoleCode.PrimaryBusinessManager)
            .With(u => u.Id, userId)
            .Create();
        List<PortalUserResp> userResults = new() { userToDelete, existingUser };
        BizResult bizResult = new() { Id = bizId};
        List<BizResult> biz = new() { bizResult };

        mockPortalUserRepo.Setup(u => u.QueryAsync(It.Is<PortalUserQry>(s => s.OrgId == bizId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PortalUserListResp() { Items = userResults });
        mockBizRepo.Setup(o => o.QueryBizAsync(It.Is<BizsQry>(q => q.BizGuid == bizId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(biz);

        BizPortalUserDeleteCommand cmd = new(userId, bizId);

        // Act
        var result = await sut.Handle(cmd, CancellationToken.None);

        // Assert
        Assert.IsType<Unit>(result);
    }
}
