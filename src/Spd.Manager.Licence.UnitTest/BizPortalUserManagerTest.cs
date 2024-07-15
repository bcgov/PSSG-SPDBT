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

namespace Spd.Manager.Licence.UnitTest;
public class BizPortalUserManagerTest
{
    private readonly IFixture fixture;
    private Mock<IPortalUserRepository> mockPortalUserRepo = new();
    private Mock<IOrgRepository> mockOrgRepo = new();

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
    }

    [Fact]
    public async void Handle_BizPortalUserCreateCommand_Return_BizPortalUserResponse()
    {

    }
}
