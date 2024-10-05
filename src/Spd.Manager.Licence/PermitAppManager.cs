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
internal class PermitAppManager :
        LicenceAppManagerBase,
        IRequestHandler<GetPermitApplicationQuery, PermitLicenceAppResponse>,
        IRequestHandler<GetLatestPermitApplicationIdQuery, Guid>,
        IRequestHandler<PermitUpsertCommand, PermitAppCommandResponse>,
        IRequestHandler<PermitSubmitCommand, PermitAppCommandResponse>,
        IRequestHandler<PermitAppNewCommand, PermitAppCommandResponse>,
        IRequestHandler<PermitAppReplaceCommand, PermitAppCommandResponse>,
        IRequestHandler<PermitAppRenewCommand, PermitAppCommandResponse>,
        IRequestHandler<PermitAppUpdateCommand, PermitAppCommandResponse>,
        IPermitAppManager
{
    private readonly IPersonLicApplicationRepository _personLicAppRepository;
    private readonly IContactRepository _contactRepository;
    private readonly ITaskRepository _taskRepository;

    public PermitAppManager(
        ILicenceRepository licenceRepository,
        IPersonLicApplicationRepository personLicAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IContactRepository contactRepository,
        ITaskRepository taskRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService,
        ILicAppRepository licAppRepository)
        : base(mapper,
            documentUrlRepository,
            feeRepository,
            licenceRepository,
            mainFileStorageService,
            transientFileStorageService,
            licAppRepository)
    {
        _personLicAppRepository = personLicAppRepository;
        _contactRepository = contactRepository;
        _taskRepository = taskRepository;
    }

    #region for portal
    // Authenticated save
    public async Task<PermitAppCommandResponse> Handle(PermitUpsertCommand cmd, CancellationToken cancellationToken)
    {
        bool hasDuplicate = await HasDuplicates(cmd.PermitUpsertRequest.ApplicantId,
            Enum.Parse<ServiceTypeEnum>(cmd.PermitUpsertRequest.WorkerLicenceTypeCode.ToString()),
            cmd.PermitUpsertRequest.LicenceAppId,
            cancellationToken);

        if (hasDuplicate)
        {
            throw new ApiException(HttpStatusCode.Forbidden, "Applicant already has the same kind of licence or licence application");
        }

        SaveLicenceApplicationCmd saveCmd = _mapper.Map<SaveLicenceApplicationCmd>(cmd.PermitUpsertRequest);
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.PermitUpsertRequest.DocumentInfos);
        var response = await _personLicAppRepository.SaveLicenceApplicationAsync(saveCmd, cancellationToken);
        if (cmd.PermitUpsertRequest.LicenceAppId == null)
            cmd.PermitUpsertRequest.LicenceAppId = response.LicenceAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.PermitUpsertRequest.LicenceAppId,
            (List<Document>?)cmd.PermitUpsertRequest.DocumentInfos,
            cancellationToken);
        return _mapper.Map<PermitAppCommandResponse>(response);
    }

    public async Task<PermitAppCommandResponse> Handle(PermitSubmitCommand cmd, CancellationToken cancellationToken)
    {
        var response = await this.Handle((PermitUpsertCommand)cmd, cancellationToken);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.PermitUpsertRequest.LicenceAppId, cancellationToken);
        decimal cost = await CommitApplicationAsync(cmd.PermitUpsertRequest, cmd.PermitUpsertRequest.LicenceAppId.Value, cancellationToken, false);
        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<Guid> Handle(GetLatestPermitApplicationIdQuery query, CancellationToken cancellationToken)
    {
        if (query.WorkerLicenceTypeCode != ServiceTypeCode.ArmouredVehiclePermit && query.WorkerLicenceTypeCode != ServiceTypeCode.BodyArmourPermit)
            throw new ApiException(HttpStatusCode.BadRequest, $"Invalid WorkerLicenceTypeCode");
        return await GetLatestApplicationId(query.ApplicantId,
            null,
            Enum.Parse<ServiceTypeEnum>(query.WorkerLicenceTypeCode.ToString()),
            cancellationToken);
    }
    #endregion



    public async Task<PermitLicenceAppResponse> Handle(GetPermitApplicationQuery query, CancellationToken cancellationToken)
    {
        var response = await _personLicAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, cancellationToken);
        PermitLicenceAppResponse result = _mapper.Map<PermitLicenceAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), cancellationToken);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();  // Exclude licence document type code that are not defined in the related dictionary
        return result;
    }

    #region anonymous new
    public async Task<PermitAppCommandResponse> Handle(PermitAppNewCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        ValidateFilesForNewApp(cmd);
        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());
        var response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
        await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, cancellationToken);
        decimal cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);
        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }
    #endregion

    public async Task<PermitAppCommandResponse> Handle(PermitAppReplaceCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Replacement)
            throw new ArgumentException("should be a replacement request");

        //validation: check if original licence meet replacement condition.
        LicenceListResp licences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, cancellationToken);
        if (licences == null || !licences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be replaced.");
        if (DateTime.UtcNow.AddDays(Constants.LicenceReplaceValidBeforeExpirationInDays) > licences.Items.First().ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException("the licence cannot be replaced because it will expired soon or already expired");

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

        //add photo file copying here.
        if (cmd.LicenceAnonymousRequest.OriginalApplicationId == null)
            throw new ArgumentException("replacement request must have original application id");

        var photos = await _documentRepository.QueryAsync(
            new DocumentQry(
                ApplicationId: cmd.LicenceAnonymousRequest.OriginalApplicationId,
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
        decimal cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken, false);
        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<PermitAppCommandResponse> Handle(PermitAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("should be a renewal request");

        //validation: check if original licence meet renew condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(
            new LicenceQry() { LicenceId = request.OriginalLicenceId },
            cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be renewed.");
        LicenceResp originalLic = originalLicences.Items.First();

        //check Renew your existing permit before it expires, within 90 days of the expiry date.
        if (DateTime.UtcNow < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
            || DateTime.UtcNow > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"the permit can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");

        var existingFiles = await GetExistingFileInfo(
            cmd.LicenceAnonymousRequest.OriginalApplicationId,
            cmd.LicenceAnonymousRequest.PreviousDocumentIds,
            cancellationToken);
        await ValidateFilesForRenewUpdateAppAsync(cmd.LicenceAnonymousRequest,
            cmd.LicAppFileInfos.ToList(),
            cancellationToken);
       
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, existingFiles);
        LicenceApplicationCmdResp response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

        await UploadNewDocsAsync(request.DocumentExpiredInfos,
                cmd.LicAppFileInfos,
                response?.LicenceAppId,
                response?.ContactId,
                null,
                null,
                null,
                null,
                null,
                cancellationToken);

        if (response?.LicenceAppId == null) throw new ApiException(HttpStatusCode.InternalServerError, "Create a new application failed.");
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
        decimal cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);

        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<PermitAppCommandResponse> Handle(PermitAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("should be an update request");

        //validation: check if original licence meet update condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(
            new LicenceQry() { LicenceId = request.OriginalLicenceId },
            cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be updated.");
        LicenceResp originalLic = originalLicences.Items.First();
        if (DateTime.UtcNow.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays) > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"can't request an update within {Constants.LicenceUpdateValidBeforeExpirationInDays} days of expiry date.");

        ChangeSpec changes = await MakeChanges(originalLic, request, cmd.LicAppFileInfos, cancellationToken);
        LicenceApplicationCmdResp? createLicResponse = null;
        if ((request.Reprint != null && request.Reprint.Value))
        {
            CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());
            createLicResponse = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
            await CommitApplicationAsync(request, createLicResponse.LicenceAppId, cancellationToken);
        }
        else
        {
            //update contact directly
            UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
            updateCmd.Id = originalLic.LicenceHolderId ?? Guid.Empty;
            await _contactRepository.ManageAsync(updateCmd, cancellationToken);
        }

        //clean up old files
        DocumentListResp docResp = await _documentRepository.QueryAsync(
            new DocumentQry()
            {
                LicenceId = originalLic.LicenceId,
                FileType = originalLic.WorkerLicenceTypeCode == ServiceTypeEnum.BodyArmourPermit ?
                    DocumentTypeEnum.BodyArmourRationale :
                    DocumentTypeEnum.ArmouredVehicleRationale
            },
            cancellationToken);
        IEnumerable<Guid> removeDocIds = docResp.Items
            .Where(i => request.PreviousDocumentIds == null || !request.PreviousDocumentIds.Any(d => d == i.DocumentUrlId))
            .Select(i => i.DocumentUrlId);
        foreach (var id in removeDocIds)
        {
            await _documentRepository.ManageAsync(new DeactivateDocumentCmd(id), cancellationToken);
        }


        //update lic
        await _licenceRepository.ManageAsync(
            new UpdateLicenceCmd(_mapper.Map<PermitLicence>(cmd.LicenceAnonymousRequest), (Guid)originalLic.LicenceId),
            cancellationToken);

        //upload new files
        await UploadNewDocsAsync(request.DocumentExpiredInfos,
            cmd.LicAppFileInfos,
            createLicResponse?.LicenceAppId,
            originalLic.LicenceHolderId,
            null,
            null,
            changes.PurposeChangeTaskId,
            originalLic.LicenceId,
            null,
            cancellationToken);
        return new PermitAppCommandResponse() { LicenceAppId = createLicResponse?.LicenceAppId, Cost = 0 };
    }



    private static void ValidateFilesForNewApp(PermitAppNewCommand cmd)
    {
        PermitAppSubmitRequest request = cmd.LicenceAnonymousRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;

        if (request.IsCanadianCitizen == false && request.IsCanadianResident == true)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.CanadianResidencyProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian but you are a resident in canada.");
            }
        }

        if (request.IsCanadianCitizen == false && request.IsCanadianResident == false)
        {
            if (!fileInfos.Any(f => LicenceAppDocumentManager.NonCanadianCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian but you are not a resident in canada.");
            }
        }

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PhotoOfYourself file");
        }
    }

    private async Task<ChangeSpec> MakeChanges(LicenceResp originalLic,
        PermitAppSubmitRequest newRequest,
        IEnumerable<LicAppFileInfo> newFileInfos,
        CancellationToken ct)
    {
        ChangeSpec changes = new();

        // Check if purpose changed
        changes.PurposeChanged = ChangeInPurpose(originalLic, newRequest);

        // Check if rationale changed
        if (!String.Equals(newRequest.Rationale, originalLic.Rationale, StringComparison.OrdinalIgnoreCase) ||
            newFileInfos.Any(n => n.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmouredVehicleRationale || n.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BodyArmourRationale))
            changes.RationaleChanged = true;

        List<string> purposes = GetPurposes(newRequest);

        // Purpose or rationale changed, create a task for Licensing RA team
        if (changes.PurposeChanged || changes.RationaleChanged)
        {
            IEnumerable<string> fileNames = newFileInfos.Where(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmouredVehicleRationale ||
                f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BodyArmourRationale).Select(f => f.FileName);
            changes.PurposeChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Permit holder have requested to update the below provided rationale: \n" +
                $" - Purpose: {string.Join(";", purposes)} \n" +
                $" - Rationale: {newRequest.Rationale} \n" +
                $" - {string.Join(";", fileNames)}",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Rational update for {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        // Criminal history changed, create a task for Licensing RA team
        if (newRequest.HasNewCriminalRecordCharge == true)
        {
            changes.CriminalHistoryChanged = true;
            changes.CriminalHistoryStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Permit holder has updated the self declaration for their criminal history. \n" +
                $" - {newRequest.CriminalChargeDescription}",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Criminal Charges or New Conviction Update on {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.High,
                RegardingContactId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        return changes;

    }

    private async Task ValidateFilesForRenewUpdateAppAsync(PermitAppSubmitRequest request,
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

        if (request.HasLegalNameChanged == true && !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.LegalNameChange))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing LegalNameChange file");
        }

        if (request.IsCanadianResident == true)
        {
            if (!newFileInfos.Any(f => LicenceAppDocumentManager.CanadianResidencyProofCodes.Contains(f.LicenceDocumentTypeCode)) &&
                !existingFileInfos.Any(f => LicenceAppDocumentManager.CanadianResidencyProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are canadian resident.");
            }
        }
        else if (request.IsCanadianCitizen == true)
        {
            if (!newFileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)) &&
                !existingFileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are canadian.");
            }
        }
        else
        {
            if (!newFileInfos.Any(f => LicenceAppDocumentManager.NonCanadianCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)) &&
                !existingFileInfos.Any(f => LicenceAppDocumentManager.NonCanadianCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian.");
            }
        }

        if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PhotoOfYourself file");
        }
    }

    private bool ChangeInEmployerInfo(LicenceResp originalLic, PermitAppSubmitRequest newRequest)
    {
        if (!String.Equals(StringHelper.SanitizeNull(originalLic.EmployerName), StringHelper.SanitizeNull(newRequest.EmployerName), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.SupervisorName), StringHelper.SanitizeNull(newRequest.SupervisorName), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.SupervisorEmailAddress), StringHelper.SanitizeNull(newRequest.SupervisorEmailAddress), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.SupervisorPhoneNumber), StringHelper.SanitizeNull(newRequest.SupervisorPhoneNumber), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.EmployerPrimaryAddress?.AddressLine1), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.AddressLine1), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.EmployerPrimaryAddress?.AddressLine2), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.AddressLine2), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.EmployerPrimaryAddress?.City), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.City), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.EmployerPrimaryAddress?.Country), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.Country), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.EmployerPrimaryAddress?.PostalCode), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.PostalCode), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalLic.EmployerPrimaryAddress?.Province), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.Province), StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return false;
    }

    private List<string> GetPurposes(PermitAppSubmitRequest newRequest)
    {
        List<string> purposes = [];

        if (newRequest.WorkerLicenceTypeCode == ServiceTypeCode.ArmouredVehiclePermit)
        {
            foreach (var reasonCode in newRequest.ArmouredVehiclePermitReasonCodes)
                purposes.Add(reasonCode.ToString());
        }
        else
        {
            foreach (var reasonCode in newRequest.BodyArmourPermitReasonCodes)
                purposes.Add(reasonCode.ToString());
        }

        return purposes;
    }

    private bool ChangeInPurpose(LicenceResp originalLic, PermitAppSubmitRequest newRequest)
    {
        List<PermitPurposeEnum> permitPurposeRequest = [];

        if (newRequest.WorkerLicenceTypeCode == ServiceTypeCode.BodyArmourPermit)
        {
            foreach (BodyArmourPermitReasonCode bodyArmourPermitReason in newRequest.BodyArmourPermitReasonCodes)
            {
                PermitPurposeEnum permitPurpose = Enum.Parse<PermitPurposeEnum>(bodyArmourPermitReason.ToString());
                permitPurposeRequest.Add(permitPurpose);
            }
        }
        else
        {
            foreach (ArmouredVehiclePermitReasonCode armouredVehiclePermitReason in newRequest.ArmouredVehiclePermitReasonCodes)
            {
                PermitPurposeEnum permitPurpose = Enum.Parse<PermitPurposeEnum>(armouredVehiclePermitReason.ToString());
                permitPurposeRequest.Add(permitPurpose);
            }
        }

        // Check if there is a different selection in reasons
        if (permitPurposeRequest.Count != originalLic.PermitPurposeEnums?.Count())
            return true;
        else
        {
            List<PermitPurposeEnum> newList = permitPurposeRequest;
            newList.Sort();
            List<PermitPurposeEnum> originalList = originalLic.PermitPurposeEnums.ToList();
            originalList.Sort();

            if (!newList.SequenceEqual(originalList))
                return true;
        }

        // Check if there is a different reason when selected value is "other"
        if (permitPurposeRequest.Contains(PermitPurposeEnum.Other) &&
            originalLic.PermitPurposeEnums.Contains(PermitPurposeEnum.Other) &&
            !String.Equals(newRequest.PermitOtherRequiredReason, originalLic.PermitOtherRequiredReason, StringComparison.OrdinalIgnoreCase))
            return true;

        // Check if there is a change in employer when selected value is "my employment"
        if (permitPurposeRequest.Contains(PermitPurposeEnum.MyEmployment) &&
            originalLic.PermitPurposeEnums.Contains(PermitPurposeEnum.MyEmployment) &&
            ChangeInEmployerInfo(originalLic, newRequest))
            return true;

        return false;
    }

    private sealed record ChangeSpec
    {
        public bool PurposeChanged { get; set; } //task
        public Guid? PurposeChangeTaskId { get; set; }
        public bool RationaleChanged { get; set; } //task
        public bool CriminalHistoryChanged { get; set; } //task
        public Guid? CriminalHistoryStatusChangeTaskId { get; set; }
    }
}
