using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager
{
    public async Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery request, CancellationToken ct)
    {
        var fees = await _licenceFeeRepository.GetLicenceFeeAsync((WorkerLicenceTypeEnum)request.WorkerLicenceTypeCode, ct);
        var feeResps = _mapper.Map<IEnumerable<LicenceFeeResponse>>(fees.LicenceFees);

        return new LicenceFeeListResponse
        {
            LicenceFees = feeResps

        };
    }
}
