using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Resource.Repository.Identity;
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
    private readonly IContactRepository _contactRepository;
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
        ITaskRepository taskRepository,
        IContactRepository contactRepository)
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
        _contactRepository = contactRepository;
    }

    #region for portal
    //authenticated save
    public async Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
    {
        _logger.LogDebug($"manager get WorkerLicenceUpsertCommand={cmd}");
        var identityResult = await _identityRepository.Query(new IdentityQry(cmd.BcscGuid, null, Resource.Repository.Registration.IdentityProviderTypeEnum.BcServicesCard), ct);
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
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);
        await UploadNewDocs(request, response.LicenceAppId, response.ContactId, ct);
        await CommitApplicationAsync(request, response.LicenceAppId, ct);
        return new WorkerLicenceAppUpsertResponse { LicenceAppId = response.LicenceAppId };
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
        await UploadNewDocs(request, response.LicenceAppId, response.ContactId, ct);

        //copying all old files to new application in PreviousFileIds 
        if (cmd.LicenceAnonymousRequest.PreviousDocumentIds != null && cmd.LicenceAnonymousRequest.PreviousDocumentIds.Any())
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
        ChangeSpec changes = await GetChanges(originalApp, request, ct);

        if ((request.Reprint != null && request.Reprint.Value) || (changes.CategoriesChanged || changes.DogRestraintsChanged))
        {
            CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);
            //add all new files user uploaded
            await UploadNewDocs(request, response.LicenceAppId, response.ContactId, ct);
            await CommitApplicationAsync(request, response.LicenceAppId, ct);
        }
        else
        {
            //update contact directly
            await _contactRepository.ManageAsync(_mapper.Map<UpdateContactCmd>(request), ct);
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
            BusinessTypeEnum = request.BusinessTypeCode == null ? BusinessTypeEnum.None : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
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
    private async Task<ChangeSpec> GetChanges(LicenceApplicationResp originalApp, WorkerLicenceAppAnonymousSubmitRequestJson newApp, CancellationToken ct)
    {
        ChangeSpec changes = new ChangeSpec();
        //categories changed
        if (newApp.CategoryCodes.Count() != originalApp.CategoryCodes.Length)
            changes.CategoriesChanged = true;
        else
        {
            List<WorkerCategoryTypeCode> newList = newApp.CategoryCodes.ToList();
            newList.Sort();
            List<WorkerCategoryTypeCode> originalList = originalApp.CategoryCodes.Select(c => Enum.Parse<WorkerCategoryTypeCode>(c.ToString())).ToList();
            originalList.Sort();
            if (newList.SequenceEqual(originalList)) changes.CategoriesChanged = true;
        }

        //DogRestraintsChanged
        if (newApp.UseDogs != originalApp.UseDogs ||
            newApp.CarryAndUseRestraints != originalApp.CarryAndUseRestraints ||
            newApp.IsDogsPurposeProtection != originalApp.IsDogsPurposeProtection ||
            newApp.IsDogsPurposeDetectionDrugs != originalApp.IsDogsPurposeDetectionDrugs ||
            newApp.IsDogsPurposeDetectionExplosives != originalApp.IsDogsPurposeDetectionExplosives)
        {
            changes.DogRestraintsChanged = true;
        }

        IEnumerable<LicAppFileInfo> items = await GetAllNewDocsInfo(newApp.DocumentKeyCodes, ct);

        //PeaceOfficerStatusChanged
        PoliceOfficerRoleCode? originalRoleCode = originalApp.PoliceOfficerRoleCode == null ? null
            : Enum.Parse<PoliceOfficerRoleCode>(originalApp.PoliceOfficerRoleCode.ToString());

        if (newApp.IsPoliceOrPeaceOfficer != originalApp.IsPoliceOrPeaceOfficer ||
            newApp.PoliceOfficerRoleCode != originalRoleCode ||
            newApp.OtherOfficerRole != originalApp.OtherOfficerRole ||
            items.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            changes.PeaceOfficerStatusChanged = true;
        }

        //MentalHealthStatusChanged
        if (newApp.IsTreatedForMHC != originalApp.IsTreatedForMHC ||
            items.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            changes.MentalHealthStatusChanged = true;
        }

        //CriminalHistoryChanged
        if (newApp.HasCriminalHistory != originalApp.HasCriminalHistory)
        {
            changes.CriminalHistoryChanged = true;
        }
        return changes;
    }
    private async Task UploadNewDocs(WorkerLicenceAppAnonymousSubmitRequestJson request, Guid licenceAppId, Guid contactId, CancellationToken ct)
    {
        if (request.DocumentKeyCodes != null && request.DocumentKeyCodes.Any())
        {
            IEnumerable<LicAppFileInfo> items = await GetAllNewDocsInfo(request.DocumentKeyCodes, ct);

            foreach (LicAppFileInfo licAppFile in items)
            {
                SpdTempFile tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                CreateDocumentCmd fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                fileCmd.ExpiryDate = request?
                        .DocumentExpiredInfos?
                        .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                        .ExpiryDate;
                fileCmd.TempFile = tempFile;
                fileCmd.ApplicationId = licenceAppId;
                fileCmd.SubmittedByApplicantId = contactId;
                //create bcgov_documenturl and file
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
    }

    private async Task<IEnumerable<LicAppFileInfo>> GetAllNewDocsInfo(IEnumerable<Guid> docKeyCodes, CancellationToken ct)
    {
        if(docKeyCodes==null || !docKeyCodes.Any()) return Enumerable.Empty<LicAppFileInfo>();
        List<LicAppFileInfo> results = new List<LicAppFileInfo>();
        foreach (Guid docKeyCode in docKeyCodes)
        {
            IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(docKeyCode.ToString());
            if (items != null)
                results.AddRange(items);
        }
        return results;
    }

    private record ChangeSpec
    {
        public bool CategoriesChanged { get; set; } //full update
        public bool DogRestraintsChanged { get; set; } //full update
        public bool PeaceOfficerStatusChanged { get; set; } //task
        public bool MentalHealthStatusChanged { get; set; } //task
        public bool CriminalHistoryChanged { get; set; } //task
    }
}
