using Spd.Resource.Applicants.Licence;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager
{
    public async Task<LicenceLookupResponse?> Handle(LicenceLookupQuery query, CancellationToken ct)
    {
        var response = await _licenceRepository.QueryAsync(new LicenceQry(null, query.LicenceNumber), ct);

        if (!response.Items.Any())
        {
            return null;
        }

        LicenceLookupResponse result = _mapper.Map<LicenceLookupResponse>(response.Items.First());
        return result;
    }
}
