using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;
using Spd.Resource.Organizations.Identity;
using Spd.Utilities.Cache;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Licence;
internal partial class PersonalLicenceAppManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<WorkerLicenceSubmitCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<CreateLicenceAppDocumentCommand, IEnumerable<LicenceAppDocumentResponse>>,
        IRequestHandler<GetWorkerLicenceAppListQuery, IEnumerable<WorkerLicenceAppListResponse>>,
        IRequestHandler<AnonymousWorkerLicenceSubmitCommand, WorkerLicenceAppUpsertResponse>,//not used
        IRequestHandler<AnonymousWorkerLicenceAppSubmitCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppReplaceCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<CreateDocumentInCacheCommand, IEnumerable<LicAppFileInfo>>,
        IPersonalLicenceAppManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly ILicenceApplicationRepository _licenceAppRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IIdentityRepository _identityRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<IPersonalLicenceAppManager> _logger;
    private readonly ILicenceFeeRepository _feeRepository;
    private readonly IDistributedCache _cache;

    public PersonalLicenceAppManager(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IIdentityRepository identityRepository,
        IDocumentRepository documentUrlRepository,
        ILogger<IPersonalLicenceAppManager> logger,
        ILicenceFeeRepository feeRepository,
        IDistributedCache cache)
    {
        _licenceRepository = licenceRepository;
        _licenceAppRepository = licenceAppRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _identityRepository = identityRepository;
        _documentRepository = documentUrlRepository;
        _logger = logger;
        _feeRepository = feeRepository;
        _cache = cache;
    }

    #region for portal
    //authenticated save
    public async Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceUpsertCommand={cmd}");
        var identityResult = await _identityRepository.Query(new IdentityQry(cmd.BcscGuid, null, Resource.Organizations.Registration.IdentityProviderTypeEnum.BcServicesCard), ct);
        if (identityResult.Items.Any())
        {
            Guid contactId = (Guid)identityResult.Items.First().ContactId;
            _logger.LogInformation("find the contact, do duplicate check.");
            bool hasDuplicate = await HasDuplicates(contactId,
                Enum.Parse<WorkerLicenceTypeEnum>(cmd.LicenceUpsertRequest.WorkerLicenceTypeCode.ToString()),
                cmd.LicenceUpsertRequest.LicenceAppId,
                ct);
            if (hasDuplicate)
            {
                throw new ApiException(System.Net.HttpStatusCode.Forbidden, "Applicant already has the same kind of licence or licence application");
            }
        }

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
        //await _licenceAppRepository.SubmitLicenceApplicationAsync((Guid)cmd.LicenceUpsertRequest.LicenceAppId, ct);

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

    #endregion

    #region anonymous
    //deprecated
    public async Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceSubmitCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        ICollection<UploadFileRequest> fileRequests = cmd.UploadFileRequests;

        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.SaveLicenceApplicationAsync(saveCmd, ct);

        foreach (UploadFileRequest uploadRequest in fileRequests)
        {
            SpdTempFile spdTempFile = _mapper.Map<SpdTempFile>(uploadRequest);
            DocumentTypeEnum? docType1 = GetDocumentType1Enum(uploadRequest.FileTypeCode);
            DocumentTypeEnum? docType2 = GetDocumentType2Enum(uploadRequest.FileTypeCode);
            //create bcgov_documenturl and file
            await _documentRepository.ManageAsync(new CreateDocumentCmd
            {
                TempFile = spdTempFile,
                ApplicationId = response.LicenceAppId,
                DocumentType = docType1,
                DocumentType2 = docType2,
                SubmittedByApplicantId = response.ContactId
            }, ct);
        }
        return new WorkerLicenceAppUpsertResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppSubmitCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequestJson request = cmd.LicenceAnonymousRequest;

        //todo: add checking if all necessary files have been uploaded

        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var appResponse = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);

        //new application, all file keys are in cache
        if (cmd.LicenceAnonymousRequest.FileKeyCodes != null && cmd.LicenceAnonymousRequest.FileKeyCodes.Any())
        {
            foreach (Guid fileKeyCode in cmd.LicenceAnonymousRequest.FileKeyCodes)
            {
                IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString());
                foreach (LicAppFileInfo licAppFile in items)
                {
                    DocumentTypeEnum? docType1 = GetDocumentType1Enum(licAppFile.LicenceDocumentTypeCode);
                    DocumentTypeEnum? docType2 = GetDocumentType2Enum(licAppFile.LicenceDocumentTypeCode);
                    //create bcgov_documenturl and file
                    await _documentRepository.ManageAsync(new CreateDocumentCmd
                    {
                        TempFile = _mapper.Map<SpdTempFile>(licAppFile),
                        ApplicationId = appResponse.LicenceAppId,
                        DocumentType = docType1,
                        DocumentType2 = docType2,
                        SubmittedByApplicantId = appResponse.ContactId
                    }, ct);
                }
            }
        }

        await CommitApplicationAsync(request, appResponse.LicenceAppId, ct);
        return new WorkerLicenceAppUpsertResponse { LicenceAppId = appResponse.LicenceAppId };
    }

    public async Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppReplaceCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequestJson request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Replacement)
            throw new ArgumentException("should be a replacement request");

        //validation: check if original licence meet replacement condition.
        LicenceListResp licences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, ct);
        if (licences == null || !licences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be replaced.");
        if (DateTime.UtcNow.AddDays(Constants.LICENCE_REPLACE_VALID_BEFORE_EXPIRATION_IN_DAYS) > licences.Items.First().ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException("the licence cannot be replaced because it will expired soon or already expired");

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);

        //add photo file copying here.
        if (cmd.LicenceAnonymousRequest.OriginalApplicationId == null)
            throw new ArgumentException("replacement request must have original application id");
        var photos = await _documentRepository.QueryAsync(
            new DocumentQry(
                ApplicationId: cmd.LicenceAnonymousRequest.OriginalApplicationId,
                FileType: DocumentTypeEnum.Photograph),
            ct);
        if (photos.Items.Any())
        {
            foreach (var photo in photos.Items)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(photo.DocumentUrlId, response.LicenceAppId, response.ContactId),
                    ct);
            }
        }

        await CommitApplicationAsync(request, response.LicenceAppId, ct);
        return new WorkerLicenceAppUpsertResponse { LicenceAppId = response.LicenceAppId };
    }
    #endregion

    private async Task CommitApplicationAsync(WorkerLicenceAppAnonymousSubmitRequestJson request, Guid licenceAppId, CancellationToken ct)
    {
        //if payment price is 0, directly set to Submitted, or PaymentPending
        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = ApplicationTypeEnum.New,
            BusinessTypeEnum = request.BusinessTypeCode == null ? null : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
            LicenceTermEnum = request.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(request.LicenceTermCode.ToString()),
            WorkerLicenceTypeEnum = request.WorkerLicenceTypeCode == null ? null : Enum.Parse<WorkerLicenceTypeEnum>(request.WorkerLicenceTypeCode.ToString())
        }, ct);
        if (price.LicenceFees.FirstOrDefault() == null || price.LicenceFees.FirstOrDefault()?.Amount == 0)
            await _licenceAppRepository.CommitLicenceApplicationAsync(licenceAppId, ApplicationStatusEnum.Submitted, ct);
        else
            await _licenceAppRepository.CommitLicenceApplicationAsync(licenceAppId, ApplicationStatusEnum.PaymentPending, ct);
    }
    private async Task<bool> HasDuplicates(Guid applicantId, WorkerLicenceTypeEnum workerLicenceType, Guid? existingLicAppId, CancellationToken ct)
    {
        LicenceAppQuery q = new LicenceAppQuery
        (
            applicantId,
            new List<WorkerLicenceTypeEnum>
            {
                workerLicenceType
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
                ApplicationPortalStatusEnum.VerifyIdentity,
            }
        );
        var response = await _licenceAppRepository.QueryAsync(q, ct);
        if (response.Any())
        {
            if (existingLicAppId != null)
            {
                if (response.Any(l => l.LicenceAppId != existingLicAppId))
                    return true;
            }
            else
            {
                return true;
            }
        }

        var licResponse = await _licenceRepository.QueryAsync(
            new LicenceQry
            {
                ContactId = applicantId,
                Type = workerLicenceType,
                IsExpired = false
            }, ct);

        if (licResponse.Items.Any())
        {
            return true;
        }
        return false;
    }
}
