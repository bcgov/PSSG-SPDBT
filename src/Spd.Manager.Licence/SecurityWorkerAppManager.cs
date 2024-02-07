using AutoMapper;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Cache;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Licence;
internal partial class SecurityWorkerAppManager :
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceSubmitCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceResponse>,
        IRequestHandler<GetWorkerLicenceAppListQuery, IEnumerable<WorkerLicenceAppListResponse>>,
        IRequestHandler<AnonymousWorkerLicenceAppNewCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppReplaceCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppRenewCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<AnonymousWorkerLicenceAppUpdateCommand, WorkerLicenceCommandResponse>,
        ISecurityWorkerAppManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly ILicenceApplicationRepository _licenceAppRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IIdentityRepository _identityRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly ILogger<ISecurityWorkerAppManager> _logger;
    private readonly ILicenceFeeRepository _feeRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IContactRepository _contactRepository;
    private readonly IDistributedCache _cache;

    public SecurityWorkerAppManager(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IIdentityRepository identityRepository,
        IDocumentRepository documentUrlRepository,
        ILogger<ISecurityWorkerAppManager> logger,
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
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken ct)
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

        //await UpdateDocumentsAsync(cmd.LicenceUpsertRequest, ct);
        //await RemoveDeletedDocumentsAsync(cmd.LicenceUpsertRequest, ct);
        return _mapper.Map<WorkerLicenceCommandResponse>(response);
    }

    // authenticated submit
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceSubmitCommand cmd, CancellationToken ct)
    {
        var response = await this.Handle((WorkerLicenceUpsertCommand)cmd, ct);
        //check if payment is done
        //todo

        //set status to submitted
        //await _licenceAppRepository.SubmitLicenceApplicationAsync((Guid)cmd.LicenceUpsertRequest.LicenceAppId, ct);

        //move the file from temp file repo to formal file repo.
        //todo

        return _mapper.Map<WorkerLicenceCommandResponse>(response);
    }
    public async Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, ct);
        WorkerLicenceResponse result = _mapper.Map<WorkerLicenceResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), ct);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items);
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

    public async Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppNewCommand cmd, CancellationToken ct)
    {
        WorkerLicenceAppAnonymousSubmitRequestJson request = cmd.LicenceAnonymousRequest;

        //todo: add checking if all necessary files have been uploaded

        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);
        await UploadNewDocs(request, response.LicenceAppId, response.ContactId, ct);

        //if payment price is 0, directly set to Submitted, or PaymentPending
        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = request.ApplicationTypeCode == null ? null : Enum.Parse<ApplicationTypeEnum>(request.ApplicationTypeCode.ToString()),
            BusinessTypeEnum = request.BusinessTypeCode == null ? BusinessTypeEnum.None : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
            LicenceTermEnum = request.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(request.LicenceTermCode.ToString()),
            WorkerLicenceTypeEnum = WorkerLicenceTypeEnum.SecurityWorkerLicence,
            HasValidSwl90DayLicence = false
        }, ct);
        if (price.LicenceFees.FirstOrDefault() == null || price.LicenceFees.FirstOrDefault()?.Amount == 0)
            await _licenceAppRepository.CommitLicenceApplicationAsync(response.LicenceAppId, ApplicationStatusEnum.Submitted, ct);
        else
            await _licenceAppRepository.CommitLicenceApplicationAsync(response.LicenceAppId, ApplicationStatusEnum.PaymentPending, ct);

        return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = price.LicenceFees.FirstOrDefault()?.Amount };
    }

    public async Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppReplaceCommand cmd, CancellationToken ct)
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

        //if payment price is 0, directly set to Submitted, or PaymentPending
        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = ApplicationTypeEnum.Replacement,
            BusinessTypeEnum = request.BusinessTypeCode == null ? BusinessTypeEnum.None : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
            LicenceTermEnum = request.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(request.LicenceTermCode.ToString()),
            WorkerLicenceTypeEnum = WorkerLicenceTypeEnum.SecurityWorkerLicence,
            HasValidSwl90DayLicence = false
        }, ct);
        if (price.LicenceFees.FirstOrDefault() == null || price.LicenceFees.FirstOrDefault()?.Amount == 0)
            await _licenceAppRepository.CommitLicenceApplicationAsync(response.LicenceAppId, ApplicationStatusEnum.Submitted, ct);
        else
            await _licenceAppRepository.CommitLicenceApplicationAsync(response.LicenceAppId, ApplicationStatusEnum.PaymentPending, ct);

        return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = price.LicenceFees.FirstOrDefault()?.Amount };
    }

    public async Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppRenewCommand cmd, CancellationToken ct)
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
            if (DateTime.UtcNow < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
                || DateTime.UtcNow > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
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

        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = ApplicationTypeEnum.Renewal,
            BusinessTypeEnum = request.BusinessTypeCode == null ? BusinessTypeEnum.None : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
            LicenceTermEnum = request.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(request.LicenceTermCode.ToString()),
            WorkerLicenceTypeEnum = WorkerLicenceTypeEnum.SecurityWorkerLicence,
            HasValidSwl90DayLicence = hasSwl90DayLicence
        }, ct);
        if (price.LicenceFees.FirstOrDefault() == null || price.LicenceFees.FirstOrDefault()?.Amount == 0)
            await _licenceAppRepository.CommitLicenceApplicationAsync(response.LicenceAppId, ApplicationStatusEnum.Submitted, ct);
        else
            await _licenceAppRepository.CommitLicenceApplicationAsync(response.LicenceAppId, ApplicationStatusEnum.PaymentPending, ct);

        return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = price.LicenceFees.FirstOrDefault()?.Amount };
    }

    public async Task<WorkerLicenceCommandResponse> Handle(AnonymousWorkerLicenceAppUpdateCommand cmd, CancellationToken ct)
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
        ChangeSpec changes = await MakeChanges(originalApp, request, originalLic, ct);

        LicenceApplicationCmdResp? createLicResponse = null;
        if ((request.Reprint != null && request.Reprint.Value) || (changes.CategoriesChanged || changes.DogRestraintsChanged))
        {
            CreateLicenceApplicationCmd? createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            createLicResponse = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, ct);
            //add all new files user uploaded
            if (request.DocumentKeyCodes != null && request.DocumentKeyCodes.Any())
            {
                IEnumerable<LicAppFileInfo> items = await GetAllNewDocsInfo(request.DocumentKeyCodes, ct);

                foreach (LicAppFileInfo licAppFile in items)
                {
                    SpdTempFile? tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                    CreateDocumentCmd? fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                    fileCmd.ApplicantId = createLicResponse.ContactId;
                    if (licAppFile.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict)
                    {
                        fileCmd.TaskId = changes.PeaceOfficerStatusChangeTaskId;
                    }
                    else if (licAppFile.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition)
                    {
                        fileCmd.TaskId = changes.MentalHealthStatusChangeTaskId;
                    }
                    else
                    {
                        fileCmd.ApplicationId = createLicResponse.LicenceAppId;
                    }
                    fileCmd.ExpiryDate = request?
                            .DocumentExpiredInfos?
                            .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                            .ExpiryDate;
                    fileCmd.TempFile = tempFile;
                    fileCmd.SubmittedByApplicantId = createLicResponse.ContactId;
                    //create bcgov_documenturl and file
                    await _documentRepository.ManageAsync(fileCmd, ct);
                }
            }
            var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
            {
                ApplicationTypeEnum = ApplicationTypeEnum.Update,
                BusinessTypeEnum = request.BusinessTypeCode == null ? BusinessTypeEnum.None : Enum.Parse<BusinessTypeEnum>(request.BusinessTypeCode.ToString()),
                LicenceTermEnum = request.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(request.LicenceTermCode.ToString()),
                WorkerLicenceTypeEnum = WorkerLicenceTypeEnum.SecurityWorkerLicence,
                HasValidSwl90DayLicence = false
            }, ct);
            if (price.LicenceFees.FirstOrDefault() == null || price.LicenceFees.FirstOrDefault()?.Amount == 0)
                await _licenceAppRepository.CommitLicenceApplicationAsync(createLicResponse.LicenceAppId, ApplicationStatusEnum.Submitted, ct);
            else
                await _licenceAppRepository.CommitLicenceApplicationAsync(createLicResponse.LicenceAppId, ApplicationStatusEnum.PaymentPending, ct);

            return new WorkerLicenceCommandResponse()
            {
                LicenceAppId = createLicResponse.LicenceAppId,
                Cost = price.LicenceFees.FirstOrDefault()?.Amount
            };
        }
        else
        {
            //update contact directly
            UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
            updateCmd.Id = originalApp.ContactId ?? Guid.Empty;
            await _contactRepository.ManageAsync(updateCmd, ct);
            return new WorkerLicenceCommandResponse() { LicenceAppId = createLicResponse?.LicenceAppId, Cost = 0 };
        }
    }

    #endregion
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
    private async Task<ChangeSpec> MakeChanges(LicenceApplicationResp originalApp, WorkerLicenceAppAnonymousSubmitRequestJson newApp, LicenceResp originalLic, CancellationToken ct)
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
            if (!newList.SequenceEqual(originalList)) changes.CategoriesChanged = true;
        }

        IEnumerable<LicAppFileInfo> items = await GetAllNewDocsInfo(newApp.DocumentKeyCodes, ct);
        //if any new doc contains category document, we think categorieschanged.
        if (!changes.CategoriesChanged)
        {
            changes.CategoriesChanged = items.Any(i => i.LicenceDocumentTypeCode.ToString().StartsWith("Category"));
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

        //PeaceOfficerStatusChanged: check if Hold a Position with Peace Officer Status changed, create task with high priority, assign to Licensing CS team
        PoliceOfficerRoleCode? originalRoleCode = originalApp.PoliceOfficerRoleCode == null ? null
            : Enum.Parse<PoliceOfficerRoleCode>(originalApp.PoliceOfficerRoleCode.ToString());

        if (newApp.IsPoliceOrPeaceOfficer != originalApp.IsPoliceOrPeaceOfficer ||
            newApp.PoliceOfficerRoleCode != originalRoleCode ||
            newApp.OtherOfficerRole != originalApp.OtherOfficerRole ||
            items.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            IEnumerable<string> fileNames = items.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict).Select(d => d.FileName);
            changes.PeaceOfficerStatusChanged = true;
            changes.PeaceOfficerStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Licensee have submitted an update that they have a Peace Officer Status update along with the supporting documents : {string.Join(";", fileNames)} ",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Peace Officer Update on  {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        //MentalHealthStatusChanged: Treated for Mental Health Condition, create task, assign to Licensing RA Coordinator team
        if (newApp.IsTreatedForMHC != originalApp.IsTreatedForMHC ||
            items.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            changes.MentalHealthStatusChanged = true;
            IEnumerable<string> fileNames = items.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition).Select(d => d.FileName);
            changes.MentalHealthStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Please see the attached mental health condition form submitted by the Licensee : {string.Join(";", fileNames)}  ",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Mental Health Condition Update on {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        //CriminalHistoryChanged: check if criminal charges changes or New Offence Conviction, create task, assign to Licensing RA Coordinator team
        if (newApp.HasCriminalHistory != originalApp.HasCriminalHistory)
        {
            changes.CriminalHistoryChanged = true;
            changes.CriminalHistoryStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = "Please see the criminal charges submitted by the licensee in the documents attached.",
                DueDateTime = DateTimeOffset.Now.AddDays(3), //will change when dynamics agree to calculate biz days on their side.
                Subject = $"Criminal Charges or New Conviction Update on {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.High,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }
        return changes;
    }
    private async Task UploadNewDocs(WorkerLicenceAppAnonymousSubmitRequestJson request, Guid? licenceAppId, Guid? contactId, CancellationToken ct)
    {
        if (request.DocumentKeyCodes != null && request.DocumentKeyCodes.Any())
        {
            IEnumerable<LicAppFileInfo> items = await GetAllNewDocsInfo(request.DocumentKeyCodes, ct);

            foreach (LicAppFileInfo licAppFile in items)
            {
                SpdTempFile tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                CreateDocumentCmd fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                fileCmd.ApplicantId = contactId;
                fileCmd.ApplicationId = licenceAppId;
                fileCmd.ExpiryDate = request?
                        .DocumentExpiredInfos?
                        .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                        .ExpiryDate;
                fileCmd.TempFile = tempFile;
                fileCmd.SubmittedByApplicantId = contactId;
                //create bcgov_documenturl and file
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
    }

    private async Task<IEnumerable<LicAppFileInfo>> GetAllNewDocsInfo(IEnumerable<Guid> docKeyCodes, CancellationToken ct)
    {
        if (docKeyCodes == null || !docKeyCodes.Any()) return Enumerable.Empty<LicAppFileInfo>();
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
        public Guid? PeaceOfficerStatusChangeTaskId { get; set; }
        public bool MentalHealthStatusChanged { get; set; } //task
        public Guid? MentalHealthStatusChangeTaskId { get; set; }
        public bool CriminalHistoryChanged { get; set; } //task
        public Guid? CriminalHistoryStatusChangeTaskId { get; set; }
    }
}
