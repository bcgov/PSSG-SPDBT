using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<CreateLicenceAppDocumentCommand, IEnumerable<LicenceAppDocumentResponse>>,
        IRequestHandler<GetLicenceLookupQuery, LicenceLookupResponse>,
        IRequestHandler<GetLicenceFeeListQuery, LicenceFeeListResponse>,
        ILicenceManager
{
    private readonly ILicenceApplicationRepository _licenceAppRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDuplicateCheckEngine _duplicateCheckEngine;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<ILicenceManager> _logger;

    public LicenceManager(ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDuplicateCheckEngine duplicateCheckEngine,
        IDocumentRepository documentUrlRepository,
        ILogger<ILicenceManager> logger)
    {
        _licenceAppRepository = licenceAppRepository;
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

    public async Task<LicenceLookupResponse> Handle(GetLicenceLookupQuery query, CancellationToken ct)
    {
        var response = await _licenceAppRepository.GetLicenceLookupAsync(query.LicenceNumber, ct);

        LicenceLookupResponse result = _mapper.Map<LicenceLookupResponse>(response);
        return result;
    }

    public async Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery query, CancellationToken ct)
    {
        var fees = await _licenceAppRepository.GetLicenceFeeAsync((WorkerLicenceTypeEnum)query.WorkerLicenceTypeCode, ct);
        var feeResps = _mapper.Map<IEnumerable<LicenceFeeResponse>>(fees.LicenceFees);

        return new LicenceFeeListResponse
        {
            LicenceFees = feeResps

        };
    }
}
