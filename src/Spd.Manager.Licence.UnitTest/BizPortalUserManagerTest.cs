using AutoFixture;
using Moq;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Org;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Spd.Resource.Repository.Biz;

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
            BizId = bizId,
            ContactAuthorizationTypeCode = Shared.ContactAuthorizationTypeCode.PrimaryBusinessManager,
            FirstName = "test",
            LastName = "test",
            Email = "test@test.com",
            JobTitle = "dev",
            PhoneNumber = "9001234567"
        };
        BizPortalUserUpdateCommand cmd = new(userId, bizPortalUserUpdateRequest);
        PortalUserResp portalUserResp = new() { OrganizationId = bizId, ContactRoleCode = Resource.Repository.ContactRoleCode.PrimaryBusinessManager };
        PortalUserListResp portalUserListResp = new()
        {
            Items = new List<PortalUserResp>() { portalUserResp }
        };
    }
}
