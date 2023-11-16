namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager
{
    public async Task<LicenceLookupResponse> Handle(GetLicenceLookupQuery query, CancellationToken ct)
    {
        var response = await _licenceRepository.GetLicenceLookupAsync(query.LicenceNumber, ct);

        LicenceLookupResponse result = _mapper.Map<LicenceLookupResponse>(response);
        return result;
    }
}
