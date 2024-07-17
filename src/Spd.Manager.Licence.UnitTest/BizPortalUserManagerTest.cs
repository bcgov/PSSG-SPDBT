using AutoFixture;
using Moq;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Biz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

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
    public async void Handle_BizPortalUserListQuery_Return_BizPortalUserResponse()
    {
        // Arrange
        Guid bizId = Guid.NewGuid();
        BizPortalUserListQuery qry = new(bizId);
        PortalUserResp portalUserResp = new() { OrganizationId = bizId};
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
}
