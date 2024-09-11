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
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository;
using Spd.Resource.Repository.ControllingMemberInvite;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Alias;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;

namespace Spd.Manager.Licence;
internal class ControllingMemberCrcAppManager :
    LicenceAppManagerBase,
    IRequestHandler<ControllingMemberCrcAppNewCommand, ControllingMemberCrcAppCommandResponse>,
    IRequestHandler<ControllingMemberCrcUpsertCommand, ControllingMemberCrcAppCommandResponse>,
    IRequestHandler<ControllingMemberCrcSubmitCommand, ControllingMemberCrcAppCommandResponse>,
    IRequestHandler<GetControllingMemberCrcApplicationQuery, ControllingMemberCrcAppResponse>,
    IRequestHandler<ControllingMemberCrcAppUpdateCommand, ControllingMemberCrcAppCommandResponse>,
    IControllingMemberCrcAppManager
{
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;
    private readonly IControllingMemberInviteRepository _cmInviteRepository;
    private readonly IContactRepository _contactRepository;
    private readonly ITaskRepository _taskRepository;

    public ControllingMemberCrcAppManager(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceRepository licenceRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService,
        IControllingMemberCrcRepository controllingMemberCrcRepository,
        IControllingMemberInviteRepository cmInviteRepository,
        IContactRepository contactRepository,
        ITaskRepository taskRepository,
        ILicAppRepository licAppRepository) : base(
            mapper,
            documentRepository,
            feeRepository,
            licenceRepository,
            mainFileService,
            transientFileService,
            licAppRepository)
    {
        _controllingMemberCrcRepository = controllingMemberCrcRepository;
        _cmInviteRepository = cmInviteRepository;
        _contactRepository = contactRepository;
        _taskRepository = taskRepository;
    }
    public async Task<ControllingMemberCrcAppResponse> Handle(GetControllingMemberCrcApplicationQuery query, CancellationToken ct)
    {
        var response = await _controllingMemberCrcRepository.GetCrcApplicationAsync(query.ControllingMemberApplicationId, ct);
        ControllingMemberCrcAppResponse result = _mapper.Map<ControllingMemberCrcAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.ControllingMemberApplicationId), ct);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();  // Exclude licence document type code that are not defined in the related dictionary
        result.HasPreviousNames = result.Aliases.Any();
        return result;
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppUpdateCommand cmd, CancellationToken ct)
    {
        ControllingMemberCrcAppUpdateRequest request = cmd.ControllingMemberCrcAppRequest;
        if (cmd.ControllingMemberCrcAppRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("should be a update request");

        var existingFiles = await GetExistingFileInfo(cmd.ControllingMemberCrcAppRequest.ControllingMemberAppId, cmd.ControllingMemberCrcAppRequest.PreviousDocumentIds, ct);
        //check validation
        ValidateFilesForUpdateAppAsync(cmd.ControllingMemberCrcAppRequest,
            cmd.LicAppFileInfos.ToList(),
            existingFiles,
            ct);
        SaveControllingMemberCrcAppCmd saveCmd = _mapper.Map<SaveControllingMemberCrcAppCmd>(request);
        saveCmd.IsPartialSaving = false;
        ControllingMemberCrcApplicationResp originalApp =
            await _controllingMemberCrcRepository.GetCrcApplicationAsync((Guid)cmd.ControllingMemberCrcAppRequest.ControllingMemberAppId, ct);

        ChangeSpec changes = await AddDynamicTasks(originalApp, request, cmd.LicAppFileInfos, ct);
        
        //update application
        var response = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(saveCmd, ct);

        //update contact directly
        UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
        updateCmd.Id = originalApp.ContactId ?? Guid.Empty;
        await _contactRepository.ManageAsync(updateCmd, ct);

        await UploadNewDocsAsync(request.DocumentExpiredInfos,
            cmd.LicAppFileInfos,
            response.ControllingMemberAppId,
            response.ContactId,
            changes.PeaceOfficerStatusChangeTaskId,
            changes.MentalHealthStatusChangeTaskId,
            null,
            null,
            null,
            ct);
        await _licAppRepository.CommitLicenceApplicationAsync(response.ControllingMemberAppId, ApplicationStatusEnum.Submitted, ct);
        return _mapper.Map<ControllingMemberCrcAppCommandResponse>(response);
    }
    #region anonymous new
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppNewCommand cmd, CancellationToken ct)
    {
        await ValidateInviteIdAsync(cmd.ControllingMemberCrcAppSubmitRequest.InviteId,
            cmd.ControllingMemberCrcAppSubmitRequest.BizContactId,
            ct);
        ValidateFilesForNewApp(cmd);

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;

        //create contact for applicant
        CreateContactCmd contactCmd = _mapper.Map<CreateContactCmd>(request);
        ContactResp contact = await _contactRepository.ManageAsync(contactCmd, ct);
        request.ApplicantId = contact.Id;
       
        //save the application
        SaveControllingMemberCrcAppCmd createApp = _mapper.Map<SaveControllingMemberCrcAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());

        var response = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(createApp, ct);

        await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.ControllingMemberAppId, response.ContactId, null, null, null, null, null, ct);

        //commit app
        await _licAppRepository.CommitLicenceApplicationAsync(response.ControllingMemberAppId, ApplicationStatusEnum.Submitted, ct);
        await DeactiveInviteAsync(cmd.ControllingMemberCrcAppSubmitRequest.InviteId, ct);

        return _mapper.Map<ControllingMemberCrcAppCommandResponse>(response);
    }
    #endregion
    #region authenticated
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcUpsertCommand cmd, CancellationToken ct)
    {
        await ValidateInviteIdAsync(cmd.ControllingMemberCrcAppUpsertRequest.InviteId,
            cmd.ControllingMemberCrcAppUpsertRequest.BizContactId, ct);

        SaveControllingMemberCrcAppCmd saveCmd = _mapper.Map<SaveControllingMemberCrcAppCmd>(cmd.ControllingMemberCrcAppUpsertRequest);
        saveCmd.IsPartialSaving = true;
        saveCmd.UploadedDocumentEnums = GetUploadedDocumentEnumsFromDocumentInfo((List<Document>?)cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos);
        var response = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(saveCmd, ct);
        if (cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId == null)
            cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId = response.ControllingMemberAppId;
        await UpdateDocumentsAsync(
            (Guid)cmd.ControllingMemberCrcAppUpsertRequest.ControllingMemberAppId,
            (List<Document>?)cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos,
            ct);
        return _mapper.Map<ControllingMemberCrcAppCommandResponse>(response);
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcSubmitCommand cmd, CancellationToken ct)
    {
        ValidateFilesForNewAppAuthenticated(cmd);
        var response = await this.Handle((ControllingMemberCrcUpsertCommand)cmd, ct);
        //move files from transient bucket to main bucket when app status changed to Submitted.
        await MoveFilesAsync(response.ControllingMemberAppId, ct);
        await _licAppRepository.CommitLicenceApplicationAsync(response.ControllingMemberAppId, ApplicationStatusEnum.Submitted, ct);
        await DeactiveInviteAsync(cmd.ControllingMemberCrcAppUpsertRequest.InviteId, ct);
        return new ControllingMemberCrcAppCommandResponse { ControllingMemberAppId = response.ControllingMemberAppId };
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
    private static void ValidateFilesForNewAppAuthenticated(ControllingMemberCrcSubmitCommand cmd)
    {
        ControllingMemberCrcAppUpsertRequest request = cmd.ControllingMemberCrcAppUpsertRequest;
        IEnumerable<Document>? fileInfos = cmd.ControllingMemberCrcAppUpsertRequest.DocumentInfos;
        if (fileInfos == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing Document Infos.");
        }
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
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }
        if (request.IsCanadianCitizen == false &&
          !fileInfos.Any(f => LicenceAppDocumentManager.WorkProofCodes.Contains((LicenceDocumentTypeCode)f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian.");
        }
        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }
    }

    private async Task ValidateInviteIdAsync(Guid inviteId, Guid bizContactId, CancellationToken ct)
    {
        ControllingMemberInviteResp? invite = null;
        //check if invite is still valid
        if (inviteId != null)
        {
            var invites = await _cmInviteRepository.QueryAsync(
                new ControllingMemberInviteQuery(bizContactId), ct);
            invite = invites.Where(i => i.Id == inviteId).SingleOrDefault();
            if (invite == null)
            {
                throw new ArgumentException("Invite not found.");
            }
            if (invite != null && (invite.Status == ApplicationInviteStatusEnum.Completed ||
                invite.Status == ApplicationInviteStatusEnum.Cancelled || invite.Status == ApplicationInviteStatusEnum.Expired))
                throw new ArgumentException("Invalid Invite status.");
        }
    }
    private async Task DeactiveInviteAsync(Guid? inviteId, CancellationToken ct)
    {
        //inactivate invite
        if (inviteId != null)
        {
            await _cmInviteRepository.ManageAsync(
                new ControllingMemberInviteUpdateCmd()
                {
                    ApplicationInviteStatusEnum = ApplicationInviteStatusEnum.Completed,
                    ControllingMemberInviteId = (Guid)inviteId
                }, ct);
        }
    }
    private async Task<ChangeSpec> AddDynamicTasks(ControllingMemberCrcApplicationResp originalApp,
        ControllingMemberCrcAppUpdateRequest newRequest,
        IEnumerable<LicAppFileInfo> newFileInfos,
        CancellationToken ct)
    {
        ChangeSpec changes = new();

        //MentalHealthStatusChanged: Treated for Mental Health Condition, create task, assign to Licensing RA Coordinator team
        if (newRequest.HasNewMentalHealthCondition == true)
        {
            changes.MentalHealthStatusChanged = true;
            IEnumerable<string> fileNames = newFileInfos.Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition).Select(d => d.FileName);
            changes.MentalHealthStatusChangeTaskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Please see the attached mental health condition form submitted by the controlling member : {string.Join(";", fileNames)}  ",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Mental Health Condition Update on {originalApp.CaseNumber}",
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
                Description = $"Please see the criminal charges submitted by the licensee with details as following : {newRequest.CriminalHistoryDetail}",
                DueDateTime = DateTimeOffset.Now.AddDays(3), //will change when dynamics agree to calculate biz days on their side.
                Subject = $"Criminal Charges or New Conviction Update on {originalApp.CaseNumber}",
                TaskPriorityEnum = TaskPriorityEnum.High,
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalApp.ControllingMemberAppId
            }, ct)).TaskId;
        }
        return changes;
    }
    private static void ValidateFilesForUpdateAppAsync(ControllingMemberCrcAppUpdateRequest request,
        IList<LicAppFileInfo> newFileInfos,
        IList<LicAppFileInfo> existingFileInfos,
        CancellationToken ct)
    {
        if (request.HasLegalNameChanged == true && !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.LegalNameChange))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing LegalNameChange file");
        }

        if (request.IsPoliceOrPeaceOfficer == true)
        {
            if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict) &&
                !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing PoliceBackgroundLetterOfNoConflict file");
            }
        }

        if (request.HasNewMentalHealthCondition == true &&
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
    
}
