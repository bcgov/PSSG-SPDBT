using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class BizLicAppMananger :
        LicenceAppManagerBase,
        IRequestHandler<GetBizLicAppQuery, BizLicAppResponse>,
        IRequestHandler<BizLicAppUpsertCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppSubmitCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppReplaceCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppRenewCommand, BizLicAppCommandResponse>,
        IRequestHandler<BizLicAppUpdateCommand, BizLicAppCommandResponse>,
        IRequestHandler<GetBizMembersQuery, Members>,
        IRequestHandler<UpsertBizMembersCommand, Unit>,
        IRequestHandler<GetBizLicAppListQuery, IEnumerable<LicenceAppListResponse>>,
        IBizLicAppManager
{
    private readonly IBizLicApplicationRepository _bizLicApplicationRepository;
    private readonly IBizContactRepository _bizContactRepository;

    public BizLicAppMananger(
        ILicenceRepository licenceRepository,
        ILicAppRepository licAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        IBizContactRepository bizContactRepository,
        IBizLicApplicationRepository bizApplicationRepository)
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
    }

    public async Task<BizLicAppResponse> Handle(GetBizLicAppQuery query, CancellationToken cancellationToken)
    {
        var response = await _bizLicApplicationRepository.GetBizLicApplicationAsync(query.LicenceApplicationId, cancellationToken);
        BizLicAppResponse result = _mapper.Map<BizLicAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), cancellationToken);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();

        if (result.BizId != null)
            result.Members = await Handle(new GetBizMembersQuery((Guid)result.BizId, result.LicenceAppId), cancellationToken);

        return result;
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand cmd, CancellationToken cancellationToken)
    {
        bool hasDuplicate = await HasDuplicates(cmd.BizLicAppUpsertRequest.BizId,
            Enum.Parse<WorkerLicenceTypeEnum>(cmd.BizLicAppUpsertRequest.WorkerLicenceTypeCode.ToString()),
            cmd.BizLicAppUpsertRequest.LicenceAppId,
            cancellationToken);

        if (hasDuplicate)
            throw new ApiException(HttpStatusCode.Forbidden, "Biz already has the same kind of licence or licence application");

        SaveBizLicApplicationCmd saveCmd = _mapper.Map<SaveBizLicApplicationCmd>(cmd.BizLicAppUpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos);
        var response = await _bizLicApplicationRepository.SaveBizLicApplicationAsync(saveCmd, cancellationToken);

        if (cmd.BizLicAppUpsertRequest.LicenceAppId == null)
            cmd.BizLicAppUpsertRequest.LicenceAppId = response.LicenceAppId;

        if (cmd.BizLicAppUpsertRequest.Members != null && cmd.BizLicAppUpsertRequest.BizId != null)
            await UpdateMembersAsync(cmd.BizLicAppUpsertRequest.Members,
                cmd.BizLicAppUpsertRequest.BizId,
                (Guid)cmd.BizLicAppUpsertRequest.LicenceAppId,
                cancellationToken);

        if (cmd.BizLicAppUpsertRequest.DocumentInfos != null && cmd.BizLicAppUpsertRequest.DocumentInfos.Any())
            await UpdateDocumentsAsync(
                (Guid)cmd.BizLicAppUpsertRequest.LicenceAppId,
                (List<Document>?)cmd.BizLicAppUpsertRequest.DocumentInfos,
                cancellationToken);

        return _mapper.Map<BizLicAppCommandResponse>(response);
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppSubmitCommand cmd, CancellationToken cancellationToken)
    {
        var response = await this.Handle((BizLicAppUpsertCommand)cmd, cancellationToken);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.BizLicAppUpsertRequest.LicenceAppId, cancellationToken);
        decimal cost = await CommitApplicationAsync(cmd.BizLicAppUpsertRequest, cmd.BizLicAppUpsertRequest.LicenceAppId.Value, cancellationToken, false);
        return new BizLicAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppReplaceCommand cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        BizLicAppSubmitRequest request = cmd.LicenceRequest;
        if (cmd.LicenceRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("should be a renewal request");

        // Validation: check if original licence meet renew condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(
            new LicenceQry() { LicenceId = request.OriginalLicenceId },
            cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be renewed.");
        LicenceResp originalLic = originalLicences.Items.First();

        // Check Renew your existing application before it expires, within 90 days of the expiry date.
        if (DateTime.UtcNow < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
            || DateTime.UtcNow > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"the application can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");

        var existingFiles = await GetExistingFileInfo(
            cmd.LicenceRequest.OriginalApplicationId,
            cmd.LicenceRequest.PreviousDocumentIds,
            cancellationToken);
        await ValidateFilesForRenewUpdateAppAsync(cmd.LicenceRequest,
            cmd.LicAppFileInfos.ToList(),
            cancellationToken);

        CreateBizLicApplicationCmd createApp = _mapper.Map<CreateBizLicApplicationCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, existingFiles);
        BizLicApplicationCmdResp response = await _bizLicApplicationRepository.CreateBizLicApplicationAsync(createApp, cancellationToken);

        await UploadNewDocsAsync(null,
                cmd.LicAppFileInfos,
                response?.LicenceAppId,
                response?.ContactId,
                null,
                null,
                null,
                null,
                cancellationToken);

        if (response?.LicenceAppId == null) throw new ApiException(HttpStatusCode.InternalServerError, "Create a new application failed.");
        // Copying all old files to new application in PreviousFileIds 
        if (cmd.LicenceRequest.PreviousDocumentIds != null && cmd.LicenceRequest.PreviousDocumentIds.Any())
        {
            foreach (var docUrlId in cmd.LicenceRequest.PreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.ContactId),
                    cancellationToken);
            }
        }
        decimal cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);

        return new BizLicAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<BizLicAppCommandResponse> Handle(BizLicAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<Members> Handle(GetBizMembersQuery qry, CancellationToken ct)
    {
        var bizMembers = await _bizContactRepository.GetBizAppContactsAsync(new BizContactQry(qry.BizId, qry.ApplicationId), ct);
        Members members = new();
        members.SwlControllingMembers = bizMembers.Where(c => c.ContactId != null && c.LicenceId != null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.ControllingMember)
            .Select(c => new SwlContactInfo()
            {
                BizContactId = c.BizContactId,
                LicenceId = c.LicenceId,
                ContactId = c.ContactId,
            });
        members.NonSwlControllingMembers = bizMembers.Where(c => c.ContactId == null && c.LicenceId == null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.ControllingMember)
            .Select(c => _mapper.Map<NonSwlContactInfo>(c));
        members.Employees = bizMembers.Where(c => c.ContactId != null && c.LicenceId != null)
            .Where(c => c.BizContactRoleCode == BizContactRoleEnum.Employee)
            .Select(c => _mapper.Map<SwlContactInfo>(c));
        return members;
    }

    public async Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct)
    {
        await UpdateMembersAsync(cmd.Members, cmd.BizId, cmd.ApplicationId, ct);
        if (cmd.LicAppFileInfos.Any(f => f.LicenceDocumentTypeCode != LicenceDocumentTypeCode.CorporateRegistryDocument))
            throw new ApiException(HttpStatusCode.BadRequest, "Can only Upload Corporate Registry Document for management of controlling member.");

        if (cmd.LicAppFileInfos != null && cmd.LicAppFileInfos.Any())
        {
            foreach (LicAppFileInfo licAppFile in cmd.LicAppFileInfos)
            {
                SpdTempFile? tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                CreateDocumentCmd? fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                fileCmd.AccountId = cmd.BizId;
                fileCmd.ApplicationId = cmd.ApplicationId;
                fileCmd.TempFile = tempFile;
                //create bcgov_documenturl and file
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
        return default;
    }

    public async Task<IEnumerable<LicenceAppListResponse>> Handle(GetBizLicAppListQuery query, CancellationToken cancellationToken)
    {
        LicenceAppQuery q = new(
            null,
            query.BizId,
            new List<WorkerLicenceTypeEnum>
            {
                WorkerLicenceTypeEnum.SecurityBusinessLicence,
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

    private async Task<Unit> UpdateMembersAsync(Members members, Guid bizId, Guid appId, CancellationToken ct)
    {
        List<BizContactResp> contacts = _mapper.Map<List<BizContactResp>>(members.NonSwlControllingMembers);
        contacts.AddRange(_mapper.Map<IList<BizContactResp>>(members.SwlControllingMembers));
        IList<BizContactResp> employees = _mapper.Map<IList<BizContactResp>>(members.Employees);
        foreach (var e in employees)
        {
            e.BizContactRoleCode = BizContactRoleEnum.Employee;
        }
        contacts.AddRange(employees);
        BizContactUpsertCmd upsertCmd = new(bizId, appId, contacts);
        await _bizContactRepository.ManageBizContactsAsync(upsertCmd, ct);
        return default;
    }

    private async Task ValidateFilesForRenewUpdateAppAsync(BizLicAppSubmitRequest request,
        IList<LicAppFileInfo> newFileInfos,
        CancellationToken ct)
    {
        DocumentListResp docListResps = await _documentRepository.QueryAsync(new DocumentQry(request.OriginalApplicationId), ct);
        IList<LicAppFileInfo> existingFileInfos = Array.Empty<LicAppFileInfo>();

        if (request.PreviousDocumentIds != null)
        {
            existingFileInfos = docListResps.Items.Where(d => request.PreviousDocumentIds.Contains(d.DocumentUrlId) && d.DocumentType2 != null)
            .Select(f => new LicAppFileInfo()
            {
                FileName = f.FileName ?? String.Empty,
                LicenceDocumentTypeCode = (LicenceDocumentTypeCode)Mappings.GetLicenceDocumentTypeCode(f.DocumentType, f.DocumentType2),
            }).ToList();
        }

        if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizInsurance))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing business insurance file");
        }

        if (request.NoBranding == false && 
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizBranding))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing branding file");
        }

        if (request.UseDogs == true && 
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BizSecurityDogCertificate))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing security dog certificate file");
        }

        if (request.CategoryCodes.Contains(WorkerCategoryTypeCode.ArmouredCarGuard) &&
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmourCarGuardRegistrar))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing armoured car guard registrar file");
        }
    }
}