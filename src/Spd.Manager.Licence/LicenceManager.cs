using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Applicants.Licence;

namespace Spd.Manager.Licence;

internal class LicenceManager :
        IRequestHandler<LicenceQuery, LicenceResponse>,
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

    public async Task<LicenceResponse?> Handle(LicenceQuery query, CancellationToken ct)
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

        LicenceResponse result = _mapper.Map<LicenceResponse>(response.Items.First());
        return result;
    }
}
