using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Manager.Shared;
using Spd.Resource.Repository.LicenceFee;

namespace Spd.Manager.Licence.UnitTest;
public class FeeManagerTest
{
    private readonly IFixture fixture;
    private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
    private Mock<IMapper> mockMapper = new();

    private FeeManager sut;

    public FeeManagerTest()
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var licenceFee = fixture.Create<LicenceFeeResp>();
        LicenceFeeResponse licenceFeeResponse = new()
        {
            WorkerLicenceTypeCode = (ServiceTypeCode?)licenceFee.WorkerLicenceTypeCode,
            BizTypeCode = (BizTypeCode?)licenceFee.BizTypeCode,
            ApplicationTypeCode = (Shared.ApplicationTypeCode?)licenceFee.ApplicationTypeCode,
            LicenceTermCode = (Shared.LicenceTermCode?)licenceFee.LicenceTermCode,
            HasValidSwl90DayLicence = licenceFee.HasValidSwl90DayLicence,
            Amount = (int?)licenceFee.Amount
        };
        List<LicenceFeeResp> licenceFeeList = new List<LicenceFeeResp>() { licenceFee };
        List<LicenceFeeResponse> licenceFeeResponses = new List<LicenceFeeResponse>()
        {
             licenceFeeResponse
        };

        mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceFeeListResp() { LicenceFees = licenceFeeList });

        mockMapper.Setup(m => m.Map<IEnumerable<LicenceFeeResponse>>(It.IsAny<List<LicenceFeeResp>>()))
            .Returns(licenceFeeResponses);

        sut = new FeeManager(mockLicFeeRepo.Object, null, mockMapper.Object);
    }

    [Fact]
    public async void Handle_GetLicenceFeeListQuery_Return_LicenceFeeListResponse()
    {
        GetLicenceFeeListQuery request = fixture.Create<GetLicenceFeeListQuery>();

        var result = await sut.Handle(request, CancellationToken.None);

        Assert.IsType<LicenceFeeListResponse>(result);
    }
}
