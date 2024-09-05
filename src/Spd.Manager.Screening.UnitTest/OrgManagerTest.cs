using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Org;

namespace Spd.Manager.Screening.UnitTest;

public class OrgManagerTest
{
    private Mock<IOrgRepository> mockOrgRepo = new();
    private Mock<IDataProtectionProvider> mockDataProtection = new();
    private Mock<IMapper> mockMapper = new();
    private Mock<IDistributedCache> mockCache = new();
    private string encodedOrgId;
    private Guid orgId;

    private OrgManager sut;

    public OrgManagerTest()
    {
        mockDataProtection.Setup(d => d.CreateProtector(It.IsAny<string>()))
           .Returns(DataProtectionProvider.Create(nameof(OrgInvitationLinkCreateCommand)).CreateProtector("test").ToTimeLimitedDataProtector());

        sut = new OrgManager(mockOrgRepo.Object,
            mockMapper.Object,
            mockCache.Object,
            mockDataProtection.Object);
    }

    [Fact]
    public async void Handle_OrgInvitationLinkCreateCommand_Return_CorrectLinkResponse()
    {
        //Arrange
        Guid orgId = Guid.NewGuid();
        mockOrgRepo.Setup(m => m.QueryOrgAsync(It.Is<OrgByIdentifierQry>(q => q.OrgId == orgId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OrgQryResult(new OrgResult() { ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.CRRP_EMPLOYEE } }));
        OrgInvitationLinkCreateCommand cmd = new(orgId, "localhost");

        //Act
        var result = await sut.Handle(cmd, CancellationToken.None);

        //Assert
        Assert.IsType<OrgInvitationLinkResponse>(result);
        Assert.StartsWith("localhost/", result.OrgInvitationLinkUrl);
        this.encodedOrgId = result.OrgInvitationLinkUrl.Split("/")[1];
        this.orgId = orgId;
    }

    [Fact]
    public async void Handle_OrgInvitationLinkVerifyCommand_Return_CorrectVerifyResponse()
    {
        //Arrange
        if (this.encodedOrgId == null)
        {
            Handle_OrgInvitationLinkCreateCommand_Return_CorrectLinkResponse();
        }
        mockOrgRepo.Setup(m => m.QueryOrgAsync(It.Is<OrgByIdentifierQry>(q => q.OrgId == this.orgId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OrgQryResult(new OrgResult() { ServiceTypes = new List<ServiceTypeCode> { ServiceTypeCode.CRRP_EMPLOYEE } }));
        OrgInvitationLinkVerifyCommand cmd = new(this.encodedOrgId);

        //Act
        var result = await sut.Handle(cmd, CancellationToken.None);

        //Assert
        Assert.IsType<OrgInviteVerifyResponse>(result);
        Assert.True(result.LinkIsValid);
    }
}