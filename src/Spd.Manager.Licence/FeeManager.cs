using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.LicenceFee;

namespace Spd.Manager.Licence;
internal class FeeManager :
        IRequestHandler<GetLicenceFeeListQuery, LicenceFeeListResponse>,
        IFeeManager
{
    private readonly ILicenceFeeRepository _licenceFeeRepository;
    private readonly ILogger<IFeeManager> _logger;
    private readonly IMapper _mapper;

    public FeeManager(
        ILicenceFeeRepository licenceFeeRepository,
        ILogger<IFeeManager> logger,
        IMapper mapper)
    {
        _licenceFeeRepository = licenceFeeRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery query, CancellationToken ct)
    {
        LicenceFeeQry qry = new LicenceFeeQry() { WorkerLicenceTypeEnum = (WorkerLicenceType?)query.WorkerLicenceTypeCode };
        var fees = await _licenceFeeRepository.QueryAsync(qry, ct);
        var feeResps = _mapper.Map<IEnumerable<LicenceFeeResponse>>(fees.LicenceFees);

        return new LicenceFeeListResponse
        {
            LicenceFees = feeResps
        };
    }
}
