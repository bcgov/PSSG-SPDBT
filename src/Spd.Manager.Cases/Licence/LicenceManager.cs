using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<CreateLicenceAppDocumentCommand, IEnumerable<LicenceAppDocumentResponse>>,
        IRequestHandler<LicenceLookupQuery, LicenceLookupResponse>,
        IRequestHandler<GetLicenceFeeListQuery, LicenceFeeListResponse>,
        ILicenceManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly ILicenceApplicationRepository _licenceAppRepository;
    private readonly ILicenceFeeRepository _licenceFeeRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDuplicateCheckEngine _duplicateCheckEngine;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<ILicenceManager> _logger;

    public LicenceManager(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        ILicenceFeeRepository licenceFeeRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDuplicateCheckEngine duplicateCheckEngine,
        IDocumentRepository documentUrlRepository,
        ILogger<ILicenceManager> logger)
    {
        _licenceRepository = licenceRepository;
        _licenceAppRepository = licenceAppRepository;
        _licenceFeeRepository = licenceFeeRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _duplicateCheckEngine = duplicateCheckEngine;
        _documentRepository = documentUrlRepository;
        _logger = logger;
    }

    public async Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceUpsertCommand={cmd}");
        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(cmd.LicenceUpsertRequest);
        saveCmd.BcscGuid = cmd.BcscGuid;
        var response = await _licenceAppRepository.SaveLicenceApplicationAsync(saveCmd, ct);
        await UpdateDocumentsAsync(cmd.LicenceUpsertRequest, ct);
        await RemoveDeletedDocumentsAsync(cmd.LicenceUpsertRequest, ct);
        return _mapper.Map<WorkerLicenceAppUpsertResponse>(response);
    }

    public async Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, ct);
        WorkerLicenceResponse result = _mapper.Map<WorkerLicenceResponse>(response);
        await GetDocumentsAsync(query.LicenceApplicationId, result, ct);
        return result;
    }
}
