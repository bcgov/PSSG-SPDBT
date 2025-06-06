using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
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
using System.Text;

namespace Spd.Manager.Licence;
internal class BizLicAppManager :
        LicenceAppManagerBase,
        IRequestHandler<GetBizLicAppQuery, BizLicAppResponse>,
        IRequestHandler<GetLatestBizLicenceAppQuery, BizLicAppResponse>,
        IRequestHandler<BizLicAppUpsertCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppSubmitCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppReplaceCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppRenewCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppUpdateCommand, BizLicAppCommandResponse>,
        IRequestHandler<GetBizLicAppListQuery, IEnumerable<LicenceAppListResponse>>,
        IRequestHandler<BrandImageQuery, FileResponse>,
        IRequestHandler<CancelDraftApplicationCommand, Unit>,
        IBizLicAppManager
{
    private readonly IBizLicApplicationRepository _bizLicApplicationRepository;
    private readonly IBizContactRepository _bizContactRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IBizRepository _bizRepository;
    private readonly IPersonLicApplicationRepository _personLicApplicationRepository;

    public BizLicAppManager(
        ILicenceRepository licenceRepository,
        ILicAppRepository licAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        IBizContactRepository bizContactRepository,
        IBizLicApplicationRepository bizApplicationRepository,
        ITaskRepository taskRepository,
        IBizRepository bizRepository,
        IPersonLicApplicationRepository personLicApplicationRepository)
    : base(mapper,
        documentUrlRepository,
        feeRepository,
        licenceRepository,
        mainFileStorageService,
        transientFileStorageService,
        licAppRepository)
    {
        _bizLicApplicationRepository = bizApplicationRepository;
        _bizContactRepository = bizContactRepository;
        _taskRepository = taskRepository;
        _bizRepository = bizRepository;
        _personLicApplicationRepository = personLicApplicationRepository;
    }

    public async Task<BizLicAppResponse> Handle(GetBizLicAppQuery query, CancellationToken cancellationToken)
    {
        var response = await _bizLicApplicationRepository.GetBizLicApplicationAsync(query.LicenceApplicationId, cancellationToken);
        BizLicAppResponse result = _mapper.Map<BizLicAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), cancellationToken);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();
        return result;
    }

    public async Task<BizLicAppResponse> Handle(GetLatestBizLicenceAppQuery query, CancellationToken cancellationToken)
    {
        //get the latest app id
        Guid latestAppId = await GetLatestApplicationId(null, query.BizId, ServiceTypeEnum.SecurityBusinessLicence, cancellationToken);
        return await Handle(new GetBizLicAppQuery(latestAppId), cancellationToken);
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand cmd, CancellationToken cancellationToken)
    {
        bool hasDuplicate = await HasDuplicates(cmd.BizLicAppUpsertRequest.BizId,
            Enum.Parse<ServiceTypeEnum>(cmd.BizLicAppUpsertRequest.ServiceTypeCode.Value.ToString()),
            cmd.BizLicAppUpsertRequest.LicenceAppId,
            cancellationToken);

        if (hasDuplicate)
            throw new ApiException(HttpStatusCode.Forbidden, "Business already has the same kind of licence or licence application");

        SaveBizLicApplicationCmd saveCmd = _mapper.Map<SaveBizLicApplicationCmd>(cmd.BizLicAppUpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos);
        var response = await _bizLicApplicationRepository.SaveBizLicApplicationAsync(saveCmd, cancellationToken);

        if (cmd.BizLicAppUpsertRequest.SoleProprietorSWLAppId != null)//this is a biz lic app from swl as sole proprietor
        {
            await _personLicApplicationRepository.UpdateSwlSoleProprietorApplicationAsync((Guid)cmd.BizLicAppUpsertRequest.SoleProprietorSWLAppId, response.LicenceAppId, cancellationToken);
        }

        if (cmd.BizLicAppUpsertRequest.LicenceAppId == null)
            cmd.BizLicAppUpsertRequest.LicenceAppId = response.LicenceAppId;

        if (cmd.BizLicAppUpsertRequest.DocumentInfos != null && cmd.BizLicAppUpsertRequest.DocumentInfos.Any())
            await UpdateDocumentsAsync(
                (Guid)cmd.BizLicAppUpsertRequest.LicenceAppId,
                (List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos,
                cancellationToken);

        //link biz members to this application
        await _bizContactRepository.ManageBizContactsAsync(
            new BizContactsLinkBizAppCmd(cmd.BizLicAppUpsertRequest.BizId, response.LicenceAppId),
            cancellationToken);
        return _mapper.Map<BizLicAppCommandResponse>(response);
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppSubmitCommand cmd, CancellationToken cancellationToken)
    {
        if (cmd.BizLicAppUpsertRequest.LicenceAppId == null)
            throw new ApiException(HttpStatusCode.BadRequest, "LicenceAppId cannot be null");
        var response = await this.Handle((BizLicAppUpsertCommand)cmd, cancellationToken);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.BizLicAppUpsertRequest.LicenceAppId, cancellationToken);

        decimal cost = await CommitApplicationAsync(cmd.BizLicAppUpsertRequest,
            cmd.BizLicAppUpsertRequest.LicenceAppId.Value,
            cancellationToken,
            HasSwl90DayLicence: false,
            cmd.BizLicAppUpsertRequest.SoleProprietorSWLAppId,
            cmd.BizLicAppUpsertRequest.SoleProprietorSWLAppOriginTypeCode);
        return new BizLicAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppReplaceCommand cmd, CancellationToken cancellationToken)
    {
        BizLicAppSubmitRequest request = cmd.LicenceRequest;
        if (cmd.LicenceRequest.ApplicationTypeCode != ApplicationTypeCode.Replacement)
            throw new ArgumentException("should be a replacement request");
        if (cmd.LicenceRequest.OriginalLicenceId == null)
            throw new ArgumentException("Original Licence Id cannot be empty");

        // Validation: check if original licence meet update condition.
        LicenceResp? originalLic = await _licenceRepository.GetAsync((Guid)request.OriginalLicenceId, cancellationToken);
        if (originalLic == null)
            throw new ArgumentException("cannot find the licence that needs to be replaced.");

        // Create new app
        CreateBizLicApplicationCmd createApp = _mapper.Map<CreateBizLicApplicationCmd>(request);
        createApp = await SetBizManagerInfo((Guid)originalLic.LicenceHolderId, createApp, (bool)request.ApplicantIsBizManager, request.ApplicantContactInfo, cancellationToken);
        BizLicApplicationCmdResp response = await _bizLicApplicationRepository.CreateBizLicApplicationAsync(createApp, cancellationToken);

        //link biz members to this application
        //await _bizContactRepository.ManageBizContactsAsync(
        //    new BizContactsLinkBizAppCmd(response.AccountId, response.LicenceAppId),
        //    cancellationToken);
        decimal cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);

        return new BizLicAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        BizLicAppSubmitRequest request = cmd.LicenceRequest;
        if (cmd.LicenceRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("should be a renewal request");
        if (cmd.LicenceRequest.OriginalLicenceId == null)
            throw new ArgumentException("Original Licence Id cannot be empty");

        // Validation: check if original licence meet renew condition.
        LicenceResp? originalLic = await _licenceRepository.GetAsync((Guid)request.OriginalLicenceId, cancellationToken);
        if (originalLic == null)
            throw new ArgumentException("cannot find the licence that needs to be renewed.");

        // Check Renew your licence before it expires, within 90 days of the expiry date.
        DateOnly currentDate = DateOnlyHelper.GetCurrentPSTDate();
        if (currentDate < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays)
            || currentDate > originalLic.ExpiryDate)
            throw new ArgumentException($"the application can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");

        var existingFiles = await GetExistingFileInfo(
            cmd.LicenceRequest.PreviousDocumentIds,
            cancellationToken);
        //spdbt-4076
        //ValidateFilesForRenewUpdateApp(cmd.LicenceRequest,
        //    cmd.LicAppFileInfos.ToList(),
        //    existingFiles.ToList());

        // Create new app
        CreateBizLicApplicationCmd createApp = _mapper.Map<CreateBizLicApplicationCmd>(request);
        createApp = await SetBizManagerInfo((Guid)originalLic.LicenceHolderId, createApp, (bool)request.ApplicantIsBizManager, request.ApplicantContactInfo, cancellationToken);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, existingFiles);
        BizLicApplicationCmdResp response = await _bizLicApplicationRepository.CreateBizLicApplicationAsync(createApp, cancellationToken);
        if (response == null) throw new ApiException(HttpStatusCode.InternalServerError, "create biz application failed.");

        if (cmd.LicenceRequest.SoleProprietorSWLAppId != null)//this is renew biz lic app from swl as sole proprietor
        {
            await _personLicApplicationRepository.UpdateSwlSoleProprietorApplicationAsync((Guid)cmd.LicenceRequest.SoleProprietorSWLAppId, response.LicenceAppId, cancellationToken);
        }

        // Upload new files
        await UploadNewDocsAsync(null,
                cmd.LicAppFileInfos,
                response.LicenceAppId,
                null,
                null,
                null,
                null,
                null,
                response.AccountId,
                cancellationToken);

        // Copying all old files to new application in PreviousFileIds 
        if (cmd.LicenceRequest.PreviousDocumentIds != null && cmd.LicenceRequest.PreviousDocumentIds.Any())
        {
            foreach (var docUrlId in cmd.LicenceRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.AccountId),
                    cancellationToken);
            }
        }

        //link biz members to this application
        await _bizContactRepository.ManageBizContactsAsync(
            new BizContactsLinkBizAppCmd(response.AccountId, response.LicenceAppId),
            cancellationToken);

        decimal cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);

        return new BizLicAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        BizLicAppSubmitRequest request = cmd.LicenceRequest;
        if (cmd.LicenceRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("Should be an update request");
        if (cmd.LicenceRequest.OriginalLicenceId == null)
            throw new ArgumentException("Original Licence Id cannot be empty");

        // Validation: check if original licence meet update condition.
        LicenceResp? originalLic = await _licenceRepository.GetAsync((Guid)request.OriginalLicenceId, cancellationToken);
        if (originalLic == null)
            throw new ArgumentException("cannot find the licence that needs to be updated.");

        ChangeSpec changes = await MakeChanges(request, cmd.LicAppFileInfos, originalLic, cancellationToken);
        BizLicApplicationCmdResp? response = null;
        decimal? cost = 0;

        // Create new app, else update existing one
        if ((request.Reprint != null && request.Reprint.Value) || changes.CategoriesChanged || changes.UseDogsChanged)
        {
            var existingFiles = await GetExistingFileInfo(
                cmd.LicenceRequest.PreviousDocumentIds,
                cancellationToken);
            CreateBizLicApplicationCmd createApp = _mapper.Map<CreateBizLicApplicationCmd>(request);
            createApp = await SetBizManagerInfo((Guid)originalLic.LicenceHolderId, createApp, (bool)request.ApplicantIsBizManager, request.ApplicantContactInfo, cancellationToken);
            createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, existingFiles);
            createApp.ChangeSummary = changes.ChangeSummary;
            response = await _bizLicApplicationRepository.CreateBizLicApplicationAsync(createApp, cancellationToken);

            if (response == null) throw new ApiException(HttpStatusCode.InternalServerError, "Create biz application failed.");

            // Upload new files
            await UploadNewDocsAsync(null,
                    cmd.LicAppFileInfos,
                    response.LicenceAppId,
                    null,
                    null,
                    null,
                    null,
                    null,
                    response.AccountId,
                    cancellationToken);

            // Copying all old files to new application in PreviousFileIds 
            if (cmd.LicenceRequest.PreviousDocumentIds != null && cmd.LicenceRequest.PreviousDocumentIds.Any())
            {
                foreach (var docUrlId in cmd.LicenceRequest.PreviousDocumentIds)
                {
                    await _documentRepository.ManageAsync(
                        new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.AccountId),
                        cancellationToken);
                }
            }

            cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);
        }

        return new BizLicAppCommandResponse { LicenceAppId = response?.LicenceAppId, Cost = cost };
    }

    public async Task<IEnumerable<LicenceAppListResponse>> Handle(GetBizLicAppListQuery query, CancellationToken cancellationToken)
    {
        LicenceAppQuery q = new(
            null,
            query.BizId,
            new List<ServiceTypeEnum>
            {
                ServiceTypeEnum.SecurityBusinessLicence,
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
        var response = await _licAppRepository.QueryAsync(q, cancellationToken);
        return _mapper.Map<IEnumerable<LicenceAppListResponse>>(response);
    }

    public async Task<FileResponse> Handle(BrandImageQuery qry, CancellationToken ct)
    {
        DocumentResp docResp = await _documentRepository.GetAsync(qry.DocumentId, ct);
        if (docResp == null)
            return new FileResponse();
        if (docResp.DocumentType != DocumentTypeEnum.CompanyBranding)
            throw new ApiException(HttpStatusCode.BadRequest, "the document is not branding image.");
        try
        {
            FileQueryResult? fileResult = null;
            if (docResp.ApplicationId != null)
            {
                BizLicApplicationResp appResp = await _bizLicApplicationRepository.GetBizLicApplicationAsync((Guid)docResp.ApplicationId, ct);
                if (appResp != null
                    && appResp.ApplicationTypeCode == Resource.Repository.ApplicationTypeEnum.New
                    && (appResp.ApplicationPortalStatus == ApplicationPortalStatusEnum.Draft || appResp.ApplicationPortalStatus == ApplicationPortalStatusEnum.Incomplete))
                {
                    fileResult = (FileQueryResult)await _transientFileService.HandleQuery(
                        new FileQuery { Key = docResp.DocumentUrlId.ToString(), Folder = docResp.Folder },
                        ct);
                }
            }

            if (fileResult == null)
                fileResult = (FileQueryResult)await _mainFileService.HandleQuery(
                    new FileQuery { Key = docResp.DocumentUrlId.ToString(), Folder = docResp.Folder },
                    ct);
            return new FileResponse
            {
                Content = fileResult.File.Content,
                ContentType = fileResult.File.ContentType,
                FileName = fileResult.File.FileName
            };
        }
        catch
        {
            //todo: add more logging
            return new FileResponse(); //error in S3, probably cannot find the file
        }
    }
    public async Task<Unit> Handle(CancelDraftApplicationCommand cmd, CancellationToken ct)
    {
        try
        {
            await _bizLicApplicationRepository.CancelDraftApplicationAsync(cmd.ApplicationId, ct);
        }
        catch (ArgumentException e)
        {
            throw new ApiException(HttpStatusCode.Forbidden, e.Message);
        }
        ;
        return default;
    }

    private static void ValidateFilesForRenewUpdateApp(BizLicAppSubmitRequest request,
        IList<LicAppFileInfo> newFileInfos,
        IList<LicAppFileInfo> existingFileInfos)
    {
        if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing business insurance file.");
        }

        if (newFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) +
            existingFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) > 1)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "No more than 1 business insurance document is allowed.");
        }

        if (request.NoBranding == false &&
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing branding file.");
        }

        if (request.NoBranding == false &&
            (newFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) +
            existingFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) > 10))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Maximum of 10 documents allowed for branding was exceeded.");
        }

        if (request.UseDogs == true &&
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing security dog certificate file.");
        }

        if (request.UseDogs == true &&
            (newFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) +
            existingFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) > 10))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Maximum of 10 documents allowed for dog certificate was exceeded.");
        }

        if (request.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard) &&
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing armoured car guard registrar file.");
        }

        if (request.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard) &&
            (newFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) +
            existingFileInfos.Count(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) > 1))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "No more than 1 armoured car guard registrar document is allowed.");
        }
    }

    private async Task<ChangeSpec> MakeChanges(
        BizLicAppSubmitRequest newRequest,
        IEnumerable<LicAppFileInfo> newFileInfos,
        LicenceResp originalLic,
        CancellationToken ct)
    {
        ChangeSpec changes = new();

        // Categories changed
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

        //UseDogs changed
        if (newRequest.UseDogs != originalLic.UseDogs ||
            newRequest.IsDogsPurposeProtection != originalLic.IsDogsPurposeProtection ||
            newRequest.IsDogsPurposeDetectionDrugs != originalLic.IsDogsPurposeDetectionDrugs ||
            newRequest.IsDogsPurposeDetectionExplosives != originalLic.IsDogsPurposeDetectionExplosives)
        {
            changes.UseDogsChanged = true;
        }

        if (changes.CategoriesChanged)
        {
            StringBuilder previousCategories = new();
            StringBuilder updatedCategories = new();

            foreach (WorkerCategoryTypeCode category in originalLic.CategoryCodes)
                previousCategories.AppendLine(category.ToString());

            foreach (WorkerCategoryTypeCode category in newRequest.CategoryCodes)
                updatedCategories.AppendLine(category.ToString());

            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Request to update the licence category applicable on the {originalLic.LicenceNumber} \n " +
                    $"Previous Categories: {previousCategories} \n " +
                    $"Updated Categories: {updatedCategories}",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Licence Category update {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingAccountId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct);
        }

        if (changes.UseDogsChanged)
        {
            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Below Dog's Handlers information needs to be updated in the business licence {originalLic.LicenceNumber} \n " +
                    $"Use of dog : Explosives detection / Drug detection / Protection (As described in the DSV certificate) \n " +
                    $"DSV Certificate Number \n " +
                    $"Expiry Date \n" +
                    $"DSV certificate (Attachment)",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Dog validation information to be updated for Business Licence {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingAccountId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct);
        }

        changes.ChangeSummary = GetChangeSummary<BizLicenceAppCompareEntity>(newFileInfos, originalLic, null, newRequest);
        return changes;
    }

    private async Task<CreateBizLicApplicationCmd> SetBizManagerInfo(
        Guid bizId,
        CreateBizLicApplicationCmd createApp,
        bool applicantIsBizManager,
        ContactInfo? applicantContactInfo,
        CancellationToken ct)
    {
        BizResult bizResult = await _bizRepository.GetBizAsync(bizId, ct);

        createApp.ManagerGivenName = bizResult?.BizManagerContactInfo?.GivenName;
        createApp.ManagerSurname = bizResult?.BizManagerContactInfo?.Surname;
        createApp.ManagerMiddleName1 = bizResult?.BizManagerContactInfo?.MiddleName1;
        createApp.ManagerMiddleName2 = bizResult?.BizManagerContactInfo?.MiddleName2;
        createApp.ManagerEmailAddress = bizResult?.BizManagerContactInfo?.EmailAddress;
        createApp.ManagerPhoneNumber = bizResult?.BizManagerContactInfo?.PhoneNumber;

        if (applicantIsBizManager)
        {
            createApp.GivenName = bizResult?.BizManagerContactInfo?.GivenName;
            createApp.Surname = bizResult?.BizManagerContactInfo?.Surname;
            createApp.MiddleName1 = bizResult?.BizManagerContactInfo?.MiddleName1;
            createApp.MiddleName2 = bizResult?.BizManagerContactInfo?.MiddleName2;
            createApp.EmailAddress = bizResult?.BizManagerContactInfo?.EmailAddress;
            createApp.PhoneNumber = bizResult?.BizManagerContactInfo?.PhoneNumber;
        }
        else
        {
            createApp.GivenName = applicantContactInfo?.GivenName;
            createApp.Surname = applicantContactInfo?.Surname;
            createApp.MiddleName1 = applicantContactInfo?.MiddleName1;
            createApp.MiddleName2 = applicantContactInfo?.MiddleName2;
            createApp.EmailAddress = applicantContactInfo?.EmailAddress;
            createApp.PhoneNumber = applicantContactInfo?.PhoneNumber;
        }

        return createApp;
    }

    private sealed record ChangeSpec
    {
        public bool CategoriesChanged { get; set; }
        public bool UseDogsChanged { get; set; }
        public string? ChangeSummary { get; set; }
    }
}