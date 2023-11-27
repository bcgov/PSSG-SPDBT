using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Application;
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
        IRequestHandler<GetWorkerLicenceAppListQuery, IEnumerable<WorkerLicenceAppListResponse>>,
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

    //authenticated save
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

    //authenticated submit
    public async Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceSubmitCommand cmd, CancellationToken ct)
    {
        var response = await this.Handle((WorkerLicenceUpsertCommand)cmd, ct);
        //check if payment is done
        //todo

        //set status to submitted
        await _licenceAppRepository.SubmitLicenceApplicationAsync((Guid)cmd.LicenceUpsertRequest.LicenceAppId, ct);

        //move the file from temp file repo to formal file repo.
        //todo

        return _mapper.Map<WorkerLicenceAppUpsertResponse>(response);
    }
    public async Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, ct);
        WorkerLicenceResponse result = _mapper.Map<WorkerLicenceResponse>(response);
        await GetDocumentsAsync(query.LicenceApplicationId, result, ct);
        return result;
    }

    public async Task<IEnumerable<WorkerLicenceAppListResponse>> Handle(GetWorkerLicenceAppListQuery query, CancellationToken ct)
    {
        LicenceAppQuery q = new LicenceAppQuery
        (
            query.ApplicantId,
            new List<WorkerLicenceTypeEnum>
            {
                WorkerLicenceTypeEnum.ArmouredVehiclePermit,
                WorkerLicenceTypeEnum.BodyArmourPermit,
                WorkerLicenceTypeEnum.SecurityWorkerLicence,
            },
            new List<ApplicationPortalStatusEnum>
            {
                ApplicationPortalStatusEnum.Draft,
                ApplicationPortalStatusEnum.AwaitingThirdParty,
                ApplicationPortalStatusEnum.AwaitingPayment,
                ApplicationPortalStatusEnum.Incomplete,
                ApplicationPortalStatusEnum.InProgress,
                ApplicationPortalStatusEnum.AwaitingApplicant,
                ApplicationPortalStatusEnum.UnderAssessment,
                ApplicationPortalStatusEnum.VerifyIdentity
            }
        );
        var response = await _licenceAppRepository.QueryAsync(q, ct);
        return _mapper.Map<IEnumerable<WorkerLicenceAppListResponse>>(response);
    }
}
