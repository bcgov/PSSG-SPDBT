using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Net;

namespace Spd.Manager.Licence;
internal class SecurityWorkerAppManager :
        LicenceAppManagerBase,
        IRequestHandler<WorkerLicenceUpsertCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceSubmitCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<GetWorkerLicenceQuery, WorkerLicenceAppResponse>,
        IRequestHandler<GetLatestWorkerLicenceApplicationIdQuery, Guid>,
        IRequestHandler<GetLicenceAppListQuery, IEnumerable<LicenceAppListResponse>>,
        IRequestHandler<WorkerLicenceAppNewCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceAppReplaceCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceAppRenewCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceAppUpdateCommand, WorkerLicenceCommandResponse>,
        ISecurityWorkerAppManager
{
    private readonly IPersonLicApplicationRepository _personLicAppRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IContactRepository _contactRepository;

    public SecurityWorkerAppManager(
        ILicenceRepository licenceRepository,
        IPersonLicApplicationRepository personLicAppRepository,
        ILicAppRepository licAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ITaskRepository taskRepository,
        ILicenceFeeRepository feeRepository,
        IContactRepository contactRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService) : base(
            mapper,
            documentUrlRepository,
            feeRepository,
            licenceRepository,
            mainFileStorageService,
            transientFileStorageService,
            licAppRepository)
    {
        _personLicAppRepository = personLicAppRepository;
        _taskRepository = taskRepository;
        _contactRepository = contactRepository;
    }

    #region for portal
    //authenticated save
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpsertCommand cmd, CancellationToken cancellationToken)
    {
        bool hasDuplicate = await HasDuplicates(cmd.LicenceUpsertRequest.ApplicantId,
            Enum.Parse<ServiceTypeEnum>(cmd.LicenceUpsertRequest.ServiceTypeCode.ToString()),
            cmd.LicenceUpsertRequest.LicenceAppId,
            cancellationToken);

        if (hasDuplicate)
        {
            throw new ApiException(HttpStatusCode.Forbidden, "Applicant already has the same kind of licence or licence application");
        }

        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(cmd.LicenceUpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.LicenceUpsertRequest.DocumentInfos);
        var response = await _personLicAppRepository.SaveLicenceApplicationAsync(saveCmd, cancellationToken);
        if (cmd.LicenceUpsertRequest.LicenceAppId == null)
            cmd.LicenceUpsertRequest.LicenceAppId = response.LicenceAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.LicenceUpsertRequest.LicenceAppId,
            (List<Document>?)cmd.LicenceUpsertRequest.DocumentInfos,
            cancellationToken);
        return _mapper.Map<WorkerLicenceCommandResponse>(response);
    }

    // authenticated submit
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceSubmitCommand cmd, CancellationToken cancellationToken)
    {
        var response = await this.Handle((WorkerLicenceUpsertCommand)cmd, cancellationToken);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.LicenceUpsertRequest.LicenceAppId, cancellationToken);
        await UpdateApplicantProfile(cmd.LicenceUpsertRequest, cmd.LicenceUpsertRequest.ApplicantId, cancellationToken);
        decimal? cost = await CommitApplicationAsync(cmd.LicenceUpsertRequest, cmd.LicenceUpsertRequest.LicenceAppId.Value, cancellationToken, false);
        return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<IEnumerable<LicenceAppListResponse>> Handle(GetLicenceAppListQuery query, CancellationToken cancellationToken)
    {
        List<ServiceTypeEnum> serviceTypes = query.ScopeCode == AppScopeCode.PersonalSecurityLicenceApp ?
            new List<ServiceTypeEnum>() {
                ServiceTypeEnum.ArmouredVehiclePermit,
                ServiceTypeEnum.BodyArmourPermit,
                ServiceTypeEnum.SecurityWorkerLicence} :
            new List<ServiceTypeEnum>() {
                ServiceTypeEnum.DogTrainerCertification,
                ServiceTypeEnum.GDSDTeamCertification,
                ServiceTypeEnum.RetiredServiceDogCertification};
        LicenceAppQuery q = new(
            query.ApplicantId,
            null,
            serviceTypes,
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
        var response = await _licAppRepository.QueryAsync(q, cancellationToken);
        return _mapper.Map<IEnumerable<LicenceAppListResponse>>(response);
    }

    #endregion

    public async Task<WorkerLicenceAppResponse> Handle(GetWorkerLicenceQuery query, CancellationToken cancellationToken)
    {
        var response = await _personLicAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, cancellationToken);
        WorkerLicenceAppResponse result = _mapper.Map<WorkerLicenceAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), cancellationToken);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList(); // Exclude licence document type code that are not defined in the related dictionary
        return result;
    }

    public async Task<Guid> Handle(GetLatestWorkerLicenceApplicationIdQuery query, CancellationToken cancellationToken)
    {
        //get the latest app id
        return await GetLatestApplicationId(query.ApplicantId,
                null,
                Enum.Parse<ServiceTypeEnum>(ServiceTypeEnum.SecurityWorkerLicence.ToString()),
                cancellationToken);
    }

    #region anonymous new
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppNewCommand cmd, CancellationToken cancellationToken)
    {
        WorkerLicenceAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());
        var response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
        await UploadNewDocsAsync(request.DocumentRelatedInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, cancellationToken);
        if (IsSoleProprietorComboApp(request)) //for sole proprietor, we only commit application until user submit the biz liz app. spdbt-2936 item 3
        {
            return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = 0 };
        }
        else
        {
            decimal? cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken, false);
            return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
        }
    }
    #endregion

    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppReplaceCommand cmd, CancellationToken cancellationToken)
    {
        WorkerLicenceAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Replacement)
            throw new ArgumentException("Should be a replacement request");
        if (cmd.LicenceAnonymousRequest.OriginalLicenceId == null)
            throw new ArgumentException("Original licence cannot be null in replace process.");

        //validation: check if original licence meet replacement condition.
        LicenceResp? originalLic = await _licenceRepository.GetAsync(request.OriginalLicenceId.Value, cancellationToken);
        if (originalLic == null)
            throw new ArgumentException("Cannot find the licence that needs to be renewed.");

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

        //add photo file copying here.
        if (cmd.LicenceAnonymousRequest.LatestApplicationId == null)
            throw new ArgumentException("replacement request must have original application id");
        var photos = await _documentRepository.QueryAsync(
            new DocumentQry(
                ApplicationId: cmd.LicenceAnonymousRequest.LatestApplicationId,
                FileType: DocumentTypeEnum.Photograph),
            cancellationToken);
        if (photos.Items.Any())
        {
            foreach (var photo in photos.Items)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(photo.DocumentUrlId, response.LicenceAppId, response.ContactId),
                    cancellationToken);
            }
        }

        decimal? cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken, false);
        return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    /// <summary>
    /// create spd_application with the same content as renewed app with type=renew, 
    ///  put original licence id to spd_currentexpiredlicenseid.
    ///  if mailing address changed, set the new mailing address to the new created application address1, 
    ///  update the contact mailing address, put old mailing address to spd_address.
    /// copy all the old files(except the file types of new uploaded files) to the new application.
    /// </summary>
    /// <param name="cmd"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        WorkerLicenceAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("Should be a renewal request");
        if (cmd.LicenceAnonymousRequest.OriginalLicenceId == null)
            throw new ArgumentException("Original licence cannot be null in renew process.");

        //validation: check if original licence meet renew condition.
        LicenceResp? originalLic = await _licenceRepository.GetAsync(request.OriginalLicenceId.Value, cancellationToken);
        if (originalLic == null)
            throw new ArgumentException("cannot find the licence that needs to be renewed.");
        DateOnly currentDate = DateOnlyHelper.GetCurrentPSTDate();
        if (originalLic.LicenceTermCode == LicenceTermEnum.NinetyDays)
        {
            if (currentDate < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays)
                || currentDate > originalLic.ExpiryDate)
                throw new ArgumentException($"the licence can only be renewed within {Constants.LicenceWith90DaysRenewValidBeforeExpirationInDays} days of the expiry date.");
        }
        else
        {
            if (currentDate < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays)
                || currentDate > originalLic.ExpiryDate)
                throw new ArgumentException($"the licence can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");
        }
        var existingFiles = await GetExistingFileInfo(cmd.LicenceAnonymousRequest.PreviousDocumentIds, cancellationToken);
        //spdbt-4076
        //await ValidateFilesForRenewUpdateAppAsync(cmd.LicenceAnonymousRequest,
        //    cmd.LicAppFileInfos.ToList(),
        //    existingFiles.ToList(),
        //    cmd.IsAuthenticated,
        //    cancellationToken);

        CreateLicenceApplicationCmd? createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, existingFiles);
        var response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
        await UploadNewDocsAsync(request.DocumentRelatedInfos,
                cmd.LicAppFileInfos,
                response?.LicenceAppId,
                response?.ContactId,
                null,
                null,
                null,
                null,
                null,
                cancellationToken);

        if (response == null)
            throw new ApiException(HttpStatusCode.InternalServerError, "Create security worker licence application failed.");

        //copying all old files to new application in PreviousFileIds 
        if (cmd.LicenceAnonymousRequest.PreviousDocumentIds != null && cmd.LicenceAnonymousRequest.PreviousDocumentIds.Any())
        {
            foreach (var docUrlId in cmd.LicenceAnonymousRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.ContactId),
                    cancellationToken);
            }
        }

        if (IsSoleProprietorComboApp(request)) //for sole proprietor, we only commit application until user submit the biz liz app
        {
            return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = 0 };
        }
        else
        {
            //todo: update all expiration date : for some doc type, some file got updated, some are still old files, and expiration data changed.
            bool hasSwl90DayLicence = originalLic.LicenceTermCode == LicenceTermEnum.NinetyDays &&
                originalLic.ServiceTypeCode == ServiceTypeEnum.SecurityWorkerLicence;

            decimal? cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken, hasSwl90DayLicence);

            return new WorkerLicenceCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
        }
    }

    /// <summary>
    /// Only Name Changed, reprint = yes, => openshift create a new application with Update type, the application spd_currentexpiredlicenseid with be the selected old licenced. Do not need to copy old files to the new application.
    /// Only Name Changed, reprint = No => openshift update the contact directly, no need to create application or task.
    /// Only Photo Changed, reprint = yes, => openshift create a new application with Update type, the application spd_currentexpiredlicenseid with be the selected old licenced.Do not need to copy old files to the new application.
    /// Only Name Changed, reprint = No => openshift update the contact directly, no need to create application or task.
    /// If license categories or Dog constraints changed, (no matter if reprint is true or false), openshift needs to create a new application with Update type, the application spd_currentexpiredlicenseid with be the selected old licenced.Do not need to copy old files to the new application.
    /// If only contact info, address changed, openshift directly update contact.
    /// If Criminal Charges, or New Offence Conviction, or treated for mental Health changed, created task, assign to Licesing RA team
    /// If only hold a position with peace officer changed, create a task for license cs team., link peace officer document to this task and contact.
    /// If mental health changed, create a task for license to licensing team, link mental document to this task and contact
    /// If any changes that needs creating tasks and also need creating application, then do both.
    /// </summary>
    /// <param name="cmd"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        WorkerLicenceAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("Should be a update request");
        if (cmd.LicenceAnonymousRequest.OriginalLicenceId == null)
            throw new ArgumentException("Original licence cannot be null in update process.");

        //validation: check if original licence meet update condition.
        LicenceResp? originalLic = await _licenceRepository.GetAsync(request.OriginalLicenceId.Value, cancellationToken);
        if (originalLic == null)
            throw new ArgumentException("cannot find the licence that needs to be updated.");

        DateOnly currentDate = DateOnlyHelper.GetCurrentPSTDate();
        if (currentDate.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays) > originalLic.ExpiryDate)
            throw new ArgumentException($"can't request an update within {Constants.LicenceUpdateValidBeforeExpirationInDays} days of expiry date.");

        var existingFiles = await GetExistingFileInfo(cmd.LicenceAnonymousRequest.PreviousDocumentIds, cancellationToken);
        //spdbt-4076
        //await ValidateFilesForRenewUpdateAppAsync(cmd.LicenceAnonymousRequest,
        //    cmd.LicAppFileInfos.ToList(),
        //    existingFiles,
        //    cmd.IsAuthenticated,
        //    cancellationToken);

        ContactResp contactResp = await _contactRepository.GetAsync(originalLic.LicenceHolderId.Value, cancellationToken);
        ChangeSpec changes = await MakeChanges(request, cmd.LicAppFileInfos, originalLic, contactResp, cancellationToken);

        LicenceApplicationCmdResp? createLicResponse = null;
        decimal? cost = 0;
        if ((request.Reprint != null && request.Reprint.Value) || (changes.CategoriesChanged || changes.DogRestraintsChanged))
        {
            CreateLicenceApplicationCmd? createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            createApp.ChangeSummary = changes.ChangeSummary;
            createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());
            createLicResponse = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
            //copying all old files to new application in PreviousFileIds 
            if (cmd.LicenceAnonymousRequest.PreviousDocumentIds != null && cmd.LicenceAnonymousRequest.PreviousDocumentIds.Any())
            {
                foreach (var docUrlId in cmd.LicenceAnonymousRequest.PreviousDocumentIds)
                {
                    await _documentRepository.ManageAsync(
                        new CopyDocumentCmd(docUrlId, createLicResponse.LicenceAppId, createLicResponse.ContactId),
                        cancellationToken);
                }
            }
            cost = await CommitApplicationAsync(request, createLicResponse.LicenceAppId, cancellationToken, false);
        }
        else
        {
            //update contact directly
            await UpdateApplicantProfile(request, originalLic.LicenceHolderId.Value, cancellationToken);
        }

        await UploadNewDocsAsync(request.DocumentRelatedInfos,
            cmd.LicAppFileInfos,
            createLicResponse?.LicenceAppId,
            originalLic.LicenceHolderId,
            changes.PeaceOfficerStatusChangeTaskId,
            changes.MentalHealthStatusChangeTaskId,
            null,
            null,
            null,
            cancellationToken);
        return new WorkerLicenceCommandResponse() { LicenceAppId = createLicResponse?.LicenceAppId, Cost = cost };

    }
    private async Task UpdateApplicantProfile(WorkerLicenceAppBase r, Guid contactId, CancellationToken ct)
    {
        UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(r);
        updateCmd.Id = contactId;
        await _contactRepository.ManageAsync(updateCmd, ct);
    }

    private async Task<ChangeSpec> MakeChanges(
        WorkerLicenceAppSubmitRequest newRequest,
        IEnumerable<LicAppFileInfo> newFileInfos,
        LicenceResp originalLic,
        ContactResp contactResp,
        CancellationToken ct)
    {
        ChangeSpec changes = new();
        //categories changed
        if (newRequest.CategoryCodes.Count() != originalLic.CategoryCodes.Count())
            changes.CategoriesChanged = true;
        else
        {
            List<WorkerCategoryTypeCode> newList = newRequest.CategoryCodes.ToList();
            newList.Sort();
            List<WorkerCategoryTypeCode> originalList = originalLic.CategoryCodes.Select(c => Enum.Parse<WorkerCategoryTypeCode>(c.ToString())).ToList();
            originalList.Sort();
            if (!newList.SequenceEqual(originalList)) changes.CategoriesChanged = true;
        }

        string? docChangedSummary = null;
        //if any new doc contains category document, we think categorieschanged.
        if (!changes.CategoriesChanged && newFileInfos != null)
        {
            docChangedSummary = string.Join("\r\n",
                newFileInfos.Select(d => $"New {d.LicenceDocumentTypeCode} documents uploaded")
            );
            //document changes won't be treated as categories change.
            //changes.CategoriesChanged = !string.IsNullOrWhiteSpace(docChangedSummary);
        }

        //DogRestraintsChanged - this check only matters if the new and original requests both contain SecurityGuard, otherwise 'CategoriesChanged' will catch the change.
        if (newRequest.CategoryCodes.Any(d => d == WorkerCategoryTypeCode.SecurityGuard) && originalLic.CategoryCodes.Any(d => d == WorkerCategoryTypeEnum.SecurityGuard))
        {
            if (newRequest.UseDogs != originalLic.UseDogs ||
                newRequest.CarryAndUseRestraints != originalLic.CarryAndUseRestraints ||
                newRequest.IsDogsPurposeProtection != originalLic.IsDogsPurposeProtection ||
                newRequest.IsDogsPurposeDetectionDrugs != originalLic.IsDogsPurposeDetectionDrugs ||
                newRequest.IsDogsPurposeDetectionExplosives != originalLic.IsDogsPurposeDetectionExplosives)
            {
                changes.DogRestraintsChanged = true;
            }
        }

        //PeaceOfficerStatusChanged: check if Hold a Position with Peace Officer Status changed, create task with high priority, assign to Licensing CS team
        PoliceOfficerRoleCode? originalRoleCode = contactResp.PoliceOfficerRoleCode == null ? null
            : Enum.Parse<PoliceOfficerRoleCode>(contactResp.PoliceOfficerRoleCode.ToString());

        if (newRequest.IsPoliceOrPeaceOfficer != contactResp.IsPoliceOrPeaceOfficer ||
            newRequest.PoliceOfficerRoleCode != originalRoleCode ||
            newRequest.OtherOfficerRole != contactResp.OtherOfficerRole ||
            newFileInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            IEnumerable<string> fileNames = newFileInfos.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict).Select(d => d.FileName);
            changes.PeaceOfficerStatusChanged = true;
            changes.PeaceOfficerStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Licensee have submitted an update that they have a Peace Officer Status update along with the supporting documents : {string.Join(";", fileNames)} ",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Peace Officer Update on  {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        //MentalHealthStatusChanged: Treated for Mental Health Condition, create task, assign to Licensing RA Coordinator team
        if (newRequest.IsTreatedForMHC == true)
        {
            changes.MentalHealthStatusChanged = true;
            IEnumerable<string> fileNames = newFileInfos.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition).Select(d => d.FileName);
            changes.MentalHealthStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Please see the attached mental health condition form submitted by the Licensee : {string.Join(";", fileNames)}  ",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Mental Health Condition Update on {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        //CriminalHistoryChanged: check if criminal charges changes or New Offence Conviction, create task, assign to Licensing RA Coordinator team
        if (newRequest.HasCriminalHistory == true)
        {
            changes.CriminalHistoryChanged = true;
            changes.CriminalHistoryStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Please see the criminal charges submitted by the licensee with details as following : {newRequest.CriminalChargeDescription}",
                DueDateTime = DateTimeOffset.Now.AddDays(3), //will change when dynamics agree to calculate biz days on their side.
                Subject = $"Criminal Charges or New Conviction Update on {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.High,
                RegardingContactId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        var newData = _mapper.Map<SecureWorkerLicenceAppCompareEntity>(newRequest);
        var oldData = _mapper.Map<SecureWorkerLicenceAppCompareEntity>(originalLic);
        _mapper.Map<ContactResp, SecureWorkerLicenceAppCompareEntity>(contactResp, oldData);
        var summary = PropertyComparer.GetPropertyDifferences(oldData, newData);
        changes.ChangeSummary = string.Join("\r\n", summary);
        if (!string.IsNullOrWhiteSpace(docChangedSummary))
            changes.ChangeSummary += "\r\n" + string.Join("\r\n", docChangedSummary);
        if (newRequest.IsPoliceOrPeaceOfficer.HasValue)
        {
            // If any police officer data has changed, just add one change summary message
            // IsPoliceOrPeaceOfficer changed from true -> false or vice versa
            if (contactResp.IsPoliceOrPeaceOfficer == null || contactResp.IsPoliceOrPeaceOfficer.Value != newRequest.IsPoliceOrPeaceOfficer.Value)
            {
                changes.ChangeSummary += "\r\nPeace Officer has been updated";
            }
            // PoliceOfficerRoleCode or OtherOfficerRole changed. Only need to check if IsPoliceOrPeaceOfficer is true
            else if (newRequest.IsPoliceOrPeaceOfficer.Value &&
                (((newRequest.PoliceOfficerRoleCode != null || contactResp.PoliceOfficerRoleCode != null) && !Equals(newRequest.PoliceOfficerRoleCode.Value.ToString(), contactResp.PoliceOfficerRoleCode.Value.ToString())) ||
                    ((newRequest.OtherOfficerRole != null || contactResp.OtherOfficerRole != null) && !Equals(newRequest.OtherOfficerRole, contactResp.OtherOfficerRole))))
            {
                changes.ChangeSummary += "\r\nPeace Officer has been updated";
            }
        }
        if (newRequest.IsTreatedForMHC.HasValue && newRequest.IsTreatedForMHC.Value)
        {
            changes.ChangeSummary += "\r\nMental Health Condition has been updated";
        }
        if (newRequest.HasCriminalHistory.HasValue && newRequest.HasCriminalHistory.Value)
        {
            changes.ChangeSummary += "\r\nSelf Disclosure has been updated";
        }
        return changes;
    }

    private static void ValidateFilesForNewApp(WorkerLicenceAppNewCommand cmd)
    {
        WorkerLicenceAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;
        if (request.IsPoliceOrPeaceOfficer == true &&
            !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PoliceBackgroundLetterOfNoConflict file");
        }

        if (request.IsTreatedForMHC == true &&
            !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing MentalHealthCondition file");
        }

        if (request.IsCanadianCitizen == false &&
            !fileInfos.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian.");
        }

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PhotoOfYourself file");
        }

        foreach (WorkerCategoryTypeCode code in request.CategoryCodes)
        {
            if (!LicenceAppDocumentManager.WorkerCategoryTypeCode_NoNeedDocument.Contains(code))
            {
                if (!fileInfos.Any(f => Mappings.GetDocumentType2Enum(f.LicenceDocumentTypeCode) == Enum.Parse<DocumentTypeEnum>(code.ToString())))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, $"Missing file for {code}");
                }
            }
        }
    }

    private async Task ValidateFilesForRenewUpdateAppAsync(WorkerLicenceAppSubmitRequest request,
        IList<LicAppFileInfo> newFileInfos,
        IList<LicAppFileInfo> existingFileInfos,
        bool isAuthenticated,
        CancellationToken ct)
    {
        if (request.HasLegalNameChanged == true && !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.LegalNameChange))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing LegalNameChange file");
        }

        if (request.IsPoliceOrPeaceOfficer == true && isAuthenticated == false)
        {
            if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict) &&
                !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing PoliceBackgroundLetterOfNoConflict file");
            }
        }

        if (request.IsTreatedForMHC == true &&
            isAuthenticated == false &&
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing MentalHealthCondition file");
        }

        if (request.IsCanadianCitizen == false)
        {
            if (!newFileInfos.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains(f.LicenceDocumentTypeCode)) &&
                !existingFileInfos.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian.");
            }
        }
        else
        {
            if (!newFileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)) &&
                !existingFileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are canadian.");
            }
        }

        if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }

        if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself)
            && !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PhotoOfYourself file");
        }

        foreach (WorkerCategoryTypeCode code in request.CategoryCodes)
        {
            if (!LicenceAppDocumentManager.WorkerCategoryTypeCode_NoNeedDocument.Contains(code))
            {
                if (!newFileInfos.Any(f => Mappings.GetDocumentType2Enum(f.LicenceDocumentTypeCode) == Enum.Parse<DocumentTypeEnum>(code.ToString()))
                    && !existingFileInfos.Any(f => Mappings.GetDocumentType2Enum(f.LicenceDocumentTypeCode) == Enum.Parse<DocumentTypeEnum>(code.ToString())))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, $"Missing file for {code}");
                }
            }
        }

    }

    private static bool IsSoleProprietorComboApp(LicenceAppBase app)
    {
        return app.ServiceTypeCode == ServiceTypeCode.SecurityWorkerLicence &&
            (app.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || app.BizTypeCode == BizTypeCode.RegisteredSoleProprietor);

    }

    private sealed record ChangeSpec
    {
        public bool CategoriesChanged { get; set; } //full update
        public bool DogRestraintsChanged { get; set; } //full update
        public bool PeaceOfficerStatusChanged { get; set; } //task
        public Guid? PeaceOfficerStatusChangeTaskId { get; set; }
        public bool MentalHealthStatusChanged { get; set; } //task
        public Guid? MentalHealthStatusChangeTaskId { get; set; }
        public bool CriminalHistoryChanged { get; set; } //task
        public Guid? CriminalHistoryStatusChangeTaskId { get; set; }
        public string ChangeSummary { get; set; }
    }
}


