using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Incident;
using Spd.Resource.Applicants.Application;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;
using Spd.Resource.Organizations.Identity;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceUpsertResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<CreateLicenceAppFileCommand, IEnumerable<LicenceAppFileCreateResponse>>,
        ILicenceManager
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDuplicateCheckEngine _duplicateCheckEngine;
    private readonly IDocumentRepository _documentRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IIdentityRepository _identityRepository;
    private readonly ILogger<ILicenceManager> _logger;

    public LicenceManager(IApplicationRepository applicationRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDuplicateCheckEngine duplicateCheckEngine,
        IDocumentRepository documentUrlRepository,
        IFileStorageService fileStorageService,
        IIdentityRepository identityRepository,
        ILogger<ILicenceManager> logger)
    {
        _applicationRepository = applicationRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _duplicateCheckEngine = duplicateCheckEngine;
        _documentRepository = documentUrlRepository;
        _fileStorageService = fileStorageService;
        _identityRepository = identityRepository;
        _logger = logger;
    }

    public async Task<WorkerLicenceUpsertResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceUpsertCommand={cmd}");
        var response = await _applicationRepository.SaveLicenceApplicationAsync(_mapper.Map<SaveLicenceApplicationCmd>(cmd.LicenceUpsertRequest), ct);

        return _mapper.Map<WorkerLicenceUpsertResponse>(response);
    }

    public async Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct)
    {
        var response = await _applicationRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, ct);

        return _mapper.Map<WorkerLicenceResponse>(response);
    }



}
