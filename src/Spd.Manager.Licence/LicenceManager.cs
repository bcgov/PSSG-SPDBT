using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Applicants.Licence;

namespace Spd.Manager.Licence;

internal class LicenceManager :
        IRequestHandler<LicenceLookupQuery, LicenceLookupResponse>,
        ILicenceManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly ILogger<ILicenceManager> _logger;
    private readonly IMapper _mapper;

    public LicenceManager(
        ILicenceRepository licenceRepository,
        ILogger<ILicenceManager> logger,
        IMapper mapper)
    {
        _licenceRepository = licenceRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<LicenceLookupResponse?> Handle(LicenceLookupQuery query, CancellationToken ct)
    {
        var response = await _licenceRepository.QueryAsync(
            new LicenceQry
            {
                LicenceNumber = query.LicenceNumber,
                AccessCode = query.AccessCode
            }, ct);

        if (!response.Items.Any())
        {
            _logger.LogDebug("No licence found.");
            return null;
        }

        LicenceLookupResponse result = _mapper.Map<LicenceLookupResponse>(response.Items.First());
        return result;
    }
}
