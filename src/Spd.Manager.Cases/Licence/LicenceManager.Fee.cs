using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager
{
    public async Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery query, CancellationToken ct)
    {
        var fees = await _licenceFeeRepository.GetLicenceFeeAsync((WorkerLicenceTypeEnum)query.WorkerLicenceTypeCode, ct);
        var feeResps = _mapper.Map<IEnumerable<LicenceFeeResponse>>(fees.LicenceFees);

        return new LicenceFeeListResponse
        {
            LicenceFees = feeResps

        };
    }
}
