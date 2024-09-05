using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.Document;
using Spd.Manager.Licence;
using Spd.Utilities.Shared.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;

namespace Spd.Manager.Licence;
internal class ControllingMemberCrcAppManager :
    LicenceAppManagerBase,
    IRequestHandler<ControllingMemberCrcAppNewCommand, ControllingMemberCrcAppCommandResponse>,
        IRequestHandler<ControllingMemberCrcUpsertCommand, ControllingMemberCrcAppCommandResponse>,
        IRequestHandler<ControllingMemberCrcSubmitCommand, ControllingMemberCrcAppCommandResponse>,
        IRequestHandler<ControllingMemberCrcAppUpdateCommand, ControllingMemberCrcAppCommandResponse>,
    IControllingMemberCrcAppManager
{
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;
    private readonly IContactRepository _contactRepository;
    private readonly ITaskRepository _taskRepository;

    public ControllingMemberCrcAppManager(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceRepository licenceRepository,
        IContactRepository contactRepository,
        ITaskRepository taskRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService,
        IControllingMemberCrcRepository controllingMemberCrcRepository,
        ILicAppRepository licAppRepository) : base(
            mapper,
            documentRepository,
            feeRepository,
            licenceRepository,
            mainFileService,
            transientFileService,
            licAppRepository)
    {
        _taskRepository = taskRepository;

        _contactRepository = contactRepository;
        _controllingMemberCrcRepository = controllingMemberCrcRepository;
    }
    #region anonymous new
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppNewCommand cmd, CancellationToken ct)
    {

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());

        var response = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);

        await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.ControllingMemberCrcAppId, response.ContactId, null, null, null, null, null, ct);
        decimal cost = await CommitApplicationAsync(request, response.ControllingMemberCrcAppId, ct);

        return new ControllingMemberCrcAppCommandResponse
        {
            ControllingMemberAppId = response.ControllingMemberCrcAppId,
            Cost = cost
        };
    }
    #endregion
    #region authenticated
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcUpsertCommand cmd, CancellationToken ct)
    {
        SaveControllingMemberCrcAppCmd saveCmd = _mapper.Map<SaveControllingMemberCrcAppCmd>(cmd.ControllingMemberCrcAppUpsertRequest);

        //TODO: find the purpose, add related enums if needed (ask peggy)
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos);
        saveCmd.WorkerLicenceTypeCode = WorkerLicenceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC;
        var response = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(saveCmd, ct);
        if (cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId == null)
            cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId = response.ControllingMemberCrcAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId,
            (List<Document>?)cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos,
            ct);
        return _mapper.Map<ControllingMemberCrcAppCommandResponse>(response);
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcSubmitCommand cmd, CancellationToken ct)
    {
        var response = await this.Handle((ControllingMemberCrcUpsertCommand)cmd, ct);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync((Guid)cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId, ct);
        decimal cost = await CommitApplicationAsync(cmd.ControllingMemberCrcAppUpsertRequest, cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId.Value, ct, false);
        return new ControllingMemberCrcAppCommandResponse { ControllingMemberAppId = response.ControllingMemberAppId, Cost = cost };
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAnonymousRequest;
        if (cmd.ControllingMemberCrcAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("should be an update request");

        //validation: check if original application meet update condition.
        ControllingMemberCrcApplicationListResp originalCrcApp = await _controllingMemberCrcRepository.QueryAsync(
            new ControllingMemberCrcQry() { ControllingMemberCrcAppId = request.OriginalApplicationId },
            cancellationToken);
        if (originalCrcApp == null || !originalCrcApp.Items.Any())
            throw new ArgumentException("cannot find the application that needs to be updated.");
        
        ControllingMemberCrcApplicationResp originalApp = originalCrcApp.Items.First();
        
        //TODO: should we add expiryDate for crcApp?
        //if (DateTime.UtcNow.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays) > originalCrcApp.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
        //    throw new ArgumentException($"can't request an update within {Constants.LicenceUpdateValidBeforeExpirationInDays} days of expiry date.");


        var existingFiles = await GetExistingFileInfo(cmd.ControllingMemberCrcAnonymousRequest.LatestApplicationId, cmd.ControllingMemberCrcAnonymousRequest.PreviousDocumentIds, cancellationToken);
        await ValidateFilesForRenewUpdateAppAsync(cmd.ControllingMemberCrcAnonymousRequest,
            cmd.LicAppFileInfos.ToList(),
            existingFiles,
            cmd.IsAuthenticated,
            cancellationToken);

        ChangeSpec changes = await MakeChanges(originalApp, request, cmd.LicAppFileInfos, cancellationToken);
        ControllingMemberCrcApplicationCmdResp? createAppResponse = null;

        //update contact directly
        UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
        updateCmd.Id = originalApp.ContactId ?? Guid.Empty;
        await _contactRepository.ManageAsync(updateCmd, cancellationToken);

        //clean up old files
        //TODO: check how to recognizie documents(using applicant or applicationId)? compare to permit app (swl  doesn't have this) 
        DocumentListResp docResp = await _documentRepository.QueryAsync(
            new DocumentQry()
            {
                ApplicationId = originalApp.ControllingMemberCrcAppId,
                
                //which file types should be passed here? 
                //FileType = originalApp.WorkerLicenceTypeCode == WorkerLicenceTypeEnum.BodyArmourPermit ?
                //    DocumentTypeEnum.BodyArmourRationale :
                //    DocumentTypeEnum.ArmouredVehicleRationale
            },
            cancellationToken);

        //TODO: when want to update files, shuld we consider deactivating old files?
        //If yes, PreviousDocumentsIds

        IEnumerable<Guid> removeDocIds = docResp.Items
            .Where(i => request.PreviousDocumentIds == null || !request.PreviousDocumentIds.Any(d => d == i.DocumentUrlId))
            .Select(i => i.DocumentUrlId);
        foreach (var id in removeDocIds)
        {
            await _documentRepository.ManageAsync(new DeactivateDocumentCmd(id), cancellationToken);
        }


        //update application
        await _controllingMemberCrcRepository.ManageAsync(
            new UpdateControllingMemberCrcAppCmd(_mapper.Map<ControllingMemberCrcApplication>(cmd.ControllingMemberCrcAnonymousRequest), (Guid)originalApp.ControllingMemberCrcAppId),
            cancellationToken);

        //upload new files
        await UploadNewDocsAsync(request.DocumentExpiredInfos,
            cmd.LicAppFileInfos,
            createAppResponse?.ControllingMemberCrcAppId,
            originalApp.ContactId,
            changes.PeaceOfficerStatusChangeTaskId,
            changes.MentalHealthStatusChangeTaskId,
            null,
            null,
            null,
            cancellationToken);
        return new ControllingMemberCrcAppCommandResponse() { ControllingMemberAppId = createAppResponse?.ControllingMemberCrcAppId};
    }
    #endregion
    private static void ValidateFilesForNewApp(ControllingMemberCrcAppNewCommand cmd)
    {
        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
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

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }

        if (request.IsCanadianCitizen == false &&
          !fileInfos.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }
    }
    private async Task ValidateFilesForRenewUpdateAppAsync(ControllingMemberCrcAppSubmitRequest request,
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

        if (request.HasNewMentalHealthCondition == true &&
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
    }
    private async Task<ChangeSpec> MakeChanges(ControllingMemberCrcApplicationResp originalApp,
        ControllingMemberCrcAppSubmitRequest newRequest,
        IEnumerable<LicAppFileInfo> newFileInfos,
        CancellationToken ct)
    {
        ChangeSpec changes = new();
      
        //PeaceOfficerStatusChanged: check if Hold a Position with Peace Officer Status changed, create task with high priority, assign to Licensing CS team
        PoliceOfficerRoleCode? originalRoleCode = originalApp.PoliceOfficerRoleCode == null ? null
            : Enum.Parse<PoliceOfficerRoleCode>(originalApp.PoliceOfficerRoleCode.ToString());

        if (newRequest.IsPoliceOrPeaceOfficer != originalApp.IsPoliceOrPeaceOfficer ||
            newRequest.PoliceOfficerRoleCode != originalRoleCode ||
            newRequest.OtherOfficerRole != originalApp.OtherOfficerRole ||
            newFileInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            IEnumerable<string> fileNames = newFileInfos.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict).Select(d => d.FileName);
            changes.PeaceOfficerStatusChanged = true;
            changes.PeaceOfficerStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Applicant have submitted an update that they have a Peace Officer Status update along with the supporting documents : {string.Join(";", fileNames)} ",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Peace Officer Update on  {originalApp.ControllingMemberCrcAppId}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalApp.ContactId,
                //TODO: 
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
            }, ct)).TaskId;
        }

        //MentalHealthStatusChanged: Treated for Mental Health Condition, create task, assign to Licensing RA Coordinator team
        if (newRequest.HasNewMentalHealthCondition == true)
        {
            changes.MentalHealthStatusChanged = true;
            IEnumerable<string> fileNames = newFileInfos.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition).Select(d => d.FileName);
            changes.MentalHealthStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Please see the attached mental health condition form submitted by the applicant : {string.Join(";", fileNames)}  ",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Mental Health Condition Update on {originalApp.ControllingMemberCrcAppId}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
            }, ct)).TaskId;
        }
        //CriminalHistoryChanged: check if criminal charges changes or New Offence Conviction, create task, assign to Licensing RA Coordinator team
        if (newRequest.HasNewCriminalRecordCharge == true)
        {
            changes.CriminalHistoryChanged = true;
            changes.CriminalHistoryStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Please see the criminal charges submitted by the applicant with details as following : {newRequest.CriminalChargeDescription}",
                DueDateTime = DateTimeOffset.Now.AddDays(3), //will change when dynamics agree to calculate biz days on their side.
                Subject = $"Criminal Charges or New Conviction Update on {originalApp.ControllingMemberCrcAppId}",
                TaskPriorityEnum = TaskPriorityEnum.High,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
            }, ct)).TaskId;
        }
        return changes;
    }
    private sealed record ChangeSpec
    {
        public bool PeaceOfficerStatusChanged { get; set; } //task
        public Guid? PeaceOfficerStatusChangeTaskId { get; set; }
        public bool MentalHealthStatusChanged { get; set; } //task
        public Guid? MentalHealthStatusChangeTaskId { get; set; }
        public bool CriminalHistoryChanged { get; set; } //task
        public Guid? CriminalHistoryStatusChangeTaskId { get; set; }
    }

}
