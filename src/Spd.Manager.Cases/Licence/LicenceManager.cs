using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Incident;
using Spd.Resource.Applicants.Licence;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases.Licence;
internal class LicenceManager :
        IRequestHandler<WorkerLicenceCreateCommand, WorkerLicenceCreateResponse>,
        ILicenceManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDuplicateCheckEngine _duplicateCheckEngine;
    private readonly IDocumentRepository _documentRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IIncidentRepository _incidentRepository;
    private readonly ILogger<ILicenceManager> _logger;

    public LicenceManager(ILicenceRepository licenceRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDuplicateCheckEngine duplicateCheckEngine,
        IDocumentRepository documentUrlRepository,
        IFileStorageService fileStorageService,
        IIncidentRepository incidentRepository,
        ILogger<ILicenceManager> logger)
    {
        _licenceRepository = licenceRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _duplicateCheckEngine = duplicateCheckEngine;
        _documentRepository = documentUrlRepository;
        _fileStorageService = fileStorageService;
        _incidentRepository = incidentRepository;
        _logger = logger;
    }

    public async Task<WorkerLicenceCreateResponse> Handle(WorkerLicenceCreateCommand request, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceCreateCommand={request}");
        var response = _licenceRepository.ManageAsync(_mapper.Map<SaveLicenceCmd>(request), ct);

        return _mapper.Map<WorkerLicenceCreateResponse>(response);
    }
}
