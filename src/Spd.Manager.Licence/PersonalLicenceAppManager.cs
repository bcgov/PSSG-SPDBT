using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;
using Spd.Resource.Applicants.Tasks;
using Spd.Resource.Organizations.Identity;
using Spd.Utilities.Cache;
using Spd.Utilities.Dynamics;
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
        IRequestHandler<AnonymousWorkerLicenceAppNewCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppReplaceCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppRenewCommand, WorkerLicenceAppUpsertResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppUpdateCommand, WorkerLicenceAppUpsertResponse>,
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
    private readonly ITaskRepository _taskRepository;
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
        IDistributedCache cache,
        ITaskRepository taskRepository)
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
        _taskRepository = taskRepository;
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

    // authenticated submit
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
            CreateDocumentCmd fileCmd = _mapper.Map<CreateDocumentCmd>(uploadRequest);
            fileCmd.TempFile = spdTempFile;
            fileCmd.ApplicationId = response.LicenceAppId;
            fileCmd.SubmittedByApplicantId = response.ContactId;
            //create bcgov_documenturl and file
            await _documentRepository.ManageAsync(fileCmd, ct);
        }
        return new WorkerLicenceAppUpsertResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppNewCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequestJson request = cmd.LicenceAnonymousRequest;

        //todo: add checking if all necessary files have been uploaded

        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var appResponse = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);

        //new application, all file keys are in cache
        if (cmd.LicenceAnonymousRequest.DocumentKeyCodes != null && cmd.LicenceAnonymousRequest.DocumentKeyCodes.Any())
        {
            foreach (Guid fileKeyCode in cmd.LicenceAnonymousRequest.DocumentKeyCodes)
            {
                IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString());
                foreach (LicAppFileInfo licAppFile in items)
                {
                    SpdTempFile tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                    CreateDocumentCmd fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                    fileCmd.ExpiryDate = cmd.LicenceAnonymousRequest?
                         .DocumentInfos?
                         .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                         .ExpiryDate;
                    fileCmd.TempFile = tempFile;
                    fileCmd.ApplicationId = appResponse.LicenceAppId;
                    fileCmd.SubmittedByApplicantId = appResponse.ContactId;
                    //create bcgov_documenturl and file
                    await _documentRepository.ManageAsync(fileCmd, ct);
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
        if (DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays) > licences.Items.First().ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
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

    public async Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppRenewCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequestJson request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("should be a renewal request");

        //validation: check if original licence meet replacement condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, ct);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be renewed.");
        LicenceResp originalLic = originalLicences.Items.First();
        if (originalLic.LicenceTermCode == LicenceTermEnum.NinetyDays)
        {
            if (DateTime.UtcNow > originalLic.ExpiryDate.AddDays(-Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
                && DateTime.UtcNow < originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
                throw new ArgumentException($"the licence can only be renewed within {Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays} days of the expiry date.");
        }
        else
        {
            if (DateTime.UtcNow > originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
                && DateTime.UtcNow < originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
                throw new ArgumentException($"the licence can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");
        }

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);

        //add all new files user uploaded
        if (cmd.LicenceAnonymousRequest.DocumentKeyCodes != null && cmd.LicenceAnonymousRequest.DocumentKeyCodes.Any())
        {
            foreach (Guid fileKeyCode in cmd.LicenceAnonymousRequest.DocumentKeyCodes)
            {
                IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString());
                if (items != null && items.Any())
                {
                    foreach (LicAppFileInfo licAppFile in items)
                    {
                        SpdTempFile tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                        CreateDocumentCmd fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                        fileCmd.ExpiryDate = cmd.LicenceAnonymousRequest?
                             .DocumentInfos?
                             .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                             .ExpiryDate;
                        fileCmd.TempFile = tempFile;
                        fileCmd.ApplicationId = response.LicenceAppId;
                        fileCmd.SubmittedByApplicantId = response.ContactId;
                        //create bcgov_documenturl and file
                        await _documentRepository.ManageAsync(fileCmd, ct);
                    }
                }
            }
        }

        //copying all old files to new application in PreviousFileIds 
        if (cmd.LicenceAnonymousRequest.PreviousDocumentIds != null && cmd.LicenceAnonymousRequest.PreviousDocumentIds.Length != 0)
        {
            foreach (var docUrlId in cmd.LicenceAnonymousRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.ContactId),
                    ct);
            }
        }

        //todo: update all expiration date : for some doc type, some file got updated, some are still old files, and expiration data changed.
        bool hasSwl90DayLicence = originalLic.LicenceTermCode == LicenceTermEnum.NinetyDays &&
            originalLic.WorkerLicenceTypeCode == WorkerLicenceTypeEnum.SecurityWorkerLicence;

        await CommitApplicationAsync(request, response.LicenceAppId, ct, hasSwl90DayLicence);

        return new WorkerLicenceAppUpsertResponse { LicenceAppId = response.LicenceAppId };
    }

    public async Task<WorkerLicenceAppUpsertResponse> Handle(AnonymousWorkerLicenceAppUpdateCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequestJson request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("should be a update request");

        //validation: check if original licence meet update condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, ct);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be updated.");
        LicenceResp originalLic = originalLicences.Items.First();
        if (DateTime.UtcNow.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays) > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"can't request an update within {Constants.LicenceUpdateValidBeforeExpirationInDays} days of expiry date.");

        LicenceApplicationResp originalApp = await _licenceAppRepository.GetLicenceApplicationAsync((Guid)cmd.LicenceAnonymousRequest.OriginalApplicationId, ct);
        ChangeSpec changes = GetChanges(originalApp, request);

        if ((request.Reprint != null && request.Reprint.Value) || (changes.CategoriesChanged || changes.DogRestraintsChanged))
        {
            CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);

            //add all new files user uploaded
            if (cmd.LicenceAnonymousRequest.DocumentKeyCodes != null && cmd.LicenceAnonymousRequest.DocumentKeyCodes.Length > 0)
            {
                foreach (Guid fileKeyCode in cmd.LicenceAnonymousRequest.DocumentKeyCodes)
                {
                    IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString());
                    foreach (LicAppFileInfo licAppFile in items)
                    {
                        SpdTempFile tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                        CreateDocumentCmd fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                        fileCmd.ExpiryDate = cmd.LicenceAnonymousRequest?
                             .DocumentInfos?
                             .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                             .ExpiryDate;
                        fileCmd.TempFile = tempFile;
                        fileCmd.ApplicationId = response.LicenceAppId;
                        fileCmd.SubmittedByApplicantId = response.ContactId;
                        //create bcgov_documenturl and file
                        await _documentRepository.ManageAsync(fileCmd, ct);
                    }
                }
            }
            //todo : need to pay $20
            await CommitApplicationAsync(request, response.LicenceAppId, ct);
        }
        else
        {
            //todo: update contact directly
        }

        //check if criminal charges changes or New Offence Conviction, create task, assign to Licensing RA Coordinator team
        if (changes.CriminalHistoryChanged)
            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = "Criminal History has Changed",
                DueDateTime = new DateTimeOffset(2024, 2, 20, 0, 0, 0, new TimeSpan(0, 0, 0)),
                Subject = "Criminal History Changed",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licencing_Risk_Assessment_Coordinator_Team_Guid),
            }, ct);

        // check if Hold a Position with Peace Officer Status changed, create task with high priority, assign to Licensing CS team
        if (changes.PeaceOfficerStatusChanged)
            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = "Peace Officer Status has Changed",
                DueDateTime = new DateTimeOffset(2024, 2, 20, 0, 0, 0, new TimeSpan(0, 0, 0)),
                Subject = "Peace Officer Status Changed",
                TaskPriorityEnum = TaskPriorityEnum.High,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
            }, ct);

        ////Treated for Mental Health Condition, create task, assign to Licensing RA Coordinator team
        if (changes.MentalHealthStatusChanged)
            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = "Mental Health Status has Changed",
                DueDateTime = new DateTimeOffset(2024, 2, 20, 0, 0, 0, new TimeSpan(0, 0, 0)),
                Subject = "Mental Health Status Changed",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licencing_Risk_Assessment_Coordinator_Team_Guid),
            }, ct);

        return new WorkerLicenceAppUpsertResponse();
    }

    #endregion

    private async Task CommitApplicationAsync(WorkerLicenceAppAnonymousSubmitRequestJson request, Guid licenceAppId, CancellationToken ct, bool HasSwl90DayLicence = false)
    {
        //if payment price is 0, directly set to Submitted, or PaymentPending
        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = request.ApplicationTypeCode == null ? null : Enum.Parse<ApplicationTypeEnum>(request.ApplicationTypeCode.ToString()),
            BusinessTypeEnum = request.BusinessTypeCode == null ? null : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
            LicenceTermEnum = request.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(request.LicenceTermCode.ToString()),
            WorkerLicenceTypeEnum = request.WorkerLicenceTypeCode == null ? null : Enum.Parse<WorkerLicenceTypeEnum>(request.WorkerLicenceTypeCode.ToString()),
            HasValidSwl90DayLicence = HasSwl90DayLicence
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
    private ChangeSpec GetChanges(LicenceApplicationResp originalApp, WorkerLicenceAppAnonymousSubmitRequestJson newApp)
    {
        ChangeSpec changes = new ChangeSpec();
        //todo
        //if(newApp.CategoryCodes != originalApp.CategoryData)
        changes.CategoriesChanged = true;
        return changes;
    }

    private record ChangeSpec
    {
        public bool NameChanged { get; set; }
        public bool CategoriesChanged { get; set; }
        public bool DogRestraintsChanged { get; set; }
        public bool ContactInfoChanged { get; set; }
        public bool PeaceOfficerStatusChanged { get; set; }
        public bool MentalHealthStatusChanged { get; set; }
        public bool CriminalHistoryChanged { get; set; }
    }
}
