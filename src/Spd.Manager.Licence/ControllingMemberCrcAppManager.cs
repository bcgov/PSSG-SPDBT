using AutoMapper;
using MediatR;
using Spd.Resource.Repository;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.ControllingMemberInvite;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Text;

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
    private readonly IBizContactRepository _bizContactRepository;
    private readonly IContactRepository _contactRepository;
    private readonly ITaskRepository _taskRepository;

    public ControllingMemberCrcAppManager(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceRepository licenceRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService,
        IControllingMemberCrcRepository controllingMemberCrcRepository,
        IBizContactRepository bizContactRepository,
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
        _bizContactRepository = bizContactRepository;
    }
    public async Task<ControllingMemberCrcAppResponse> Handle(GetControllingMemberCrcApplicationQuery query, CancellationToken ct)
    {
        var response = await _controllingMemberCrcRepository.GetCrcApplicationAsync(query.ControllingMemberApplicationId, ct);
        ControllingMemberCrcAppResponse result = _mapper.Map<ControllingMemberCrcAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.ControllingMemberApplicationId), ct);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();  // Exclude licence document type code that are not defined in the related dictionary
        result.HasPreviousName = result.Aliases.Any();
        return result;
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppUpdateCommand cmd, CancellationToken ct)
    {
        await ValidateInviteIdAsync(cmd.ControllingMemberCrcAppRequest.InviteId,
            cmd.ControllingMemberCrcAppRequest.BizContactId,
            ct);
        ControllingMemberCrcAppUpdateRequest request = cmd.ControllingMemberCrcAppRequest;

        //no need to get existing files
        //var existingFiles = await GetExistingFileInfo(cmd.ControllingMemberCrcAppRequest.ControllingMemberAppId, cmd.ControllingMemberCrcAppRequest.PreviousDocumentIds, ct);
        ////check validation
        //ValidateFilesForUpdateAppAsync(cmd.ControllingMemberCrcAppRequest,
        //    cmd.LicAppFileInfos.ToList(),
        //    existingFiles,
        //    ct);
        ContactResp? contact = await _contactRepository.GetAsync((Guid)request.ApplicantId, ct);
        if (contact == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Applicant info not found");

        BizContactResp? bizContact = await _bizContactRepository.GetBizContactAsync(request.BizContactId, ct);
        if (bizContact == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Business Contact not found");

        LicenceListResp licences = await _licenceRepository.QueryAsync(new LicenceQry()
        {
            AccountId = bizContact.BizId,
            Type = ServiceTypeEnum.SecurityBusinessLicence
        }, ct);

        LicenceResp? bizLicence = licences?.Items?.SingleOrDefault();
        if (bizLicence == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Business Licence not found");

        ChangeSpec changes = await AddDynamicTasks(contact, request, bizContact, bizLicence, cmd.LicAppFileInfos, ct);

        //update applicant
        await UpdateApplicantProfile(request, contact, ct);

        await UploadNewDocsAsync(request.DocumentRelatedInfos,
            cmd.LicAppFileInfos,
            //set link to applicant only, application Id should be null
            null,
            request.ApplicantId,
            changes.PeaceOfficerStatusChangeTaskId,
            changes.MentalHealthStatusChangeTaskId,
            changes.CriminalHistoryStatusChangeTaskId,
            null,
            null,
            ct);

        //deactivate invite
        await DeactiveInviteAsync(cmd.ControllingMemberCrcAppRequest.InviteId, ct);
        return new ControllingMemberCrcAppCommandResponse()
        {
            ControllingMemberAppId = cmd.ControllingMemberCrcAppRequest.ControllingMemberAppId ?? Guid.Empty //update cm does not have application Id
        };
    }

    #region anonymous new
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppNewCommand cmd, CancellationToken ct)
    {
        await ValidateInviteIdAsync(cmd.ControllingMemberCrcAppSubmitRequest.InviteId,
            cmd.ControllingMemberCrcAppSubmitRequest.BizContactId,
            ct);
        ValidateFilesForNewApp(cmd);

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;

        SaveControllingMemberCrcAppCmd createApp = _mapper.Map<SaveControllingMemberCrcAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());
        //create the application and create or update contact
        var response = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);

        await UploadNewDocsAsync(request.DocumentRelatedInfos, cmd.LicAppFileInfos, response.ControllingMemberAppId, response.ContactId, null, null, null, null, null, ct);

        //commit app
        await CommitApplicationAsync(
            new LicenceAppBase()
            {
                ApplicationTypeCode = request.ApplicationTypeCode,
                ApplicationOriginTypeCode = request.ApplicationOriginTypeCode,
                ServiceTypeCode = request.ServiceTypeCode,
            },
            response.ControllingMemberAppId,
            ct,
            cmParentAppId: request.ParentBizLicApplicationId);
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
        var request = cmd.ControllingMemberCrcUpsertRequest;
        var response = await this.Handle((ControllingMemberCrcUpsertCommand)cmd, ct);
        //move files from transient bucket to main bucket when app status changed to PaymentPending.
        await MoveFilesAsync(response.ControllingMemberAppId, ct);

        await UpdateApplicantProfile(cmd.ControllingMemberCrcAppUpsertRequest, ct);
        await CommitApplicationAsync(
            new LicenceAppBase()
            {
                ApplicationTypeCode = request.ApplicationTypeCode,
                ApplicationOriginTypeCode = request.ApplicationOriginTypeCode,
                ServiceTypeCode = request.ServiceTypeCode,
            },
            response.ControllingMemberAppId,
            ct,
            cmParentAppId: request.ParentBizLicApplicationId);
        await DeactiveInviteAsync(cmd.ControllingMemberCrcAppUpsertRequest.InviteId, ct);
        return new ControllingMemberCrcAppCommandResponse { ControllingMemberAppId = response.ControllingMemberAppId };
    }
    #endregion
    private async Task UpdateApplicantProfile(ControllingMemberCrcAppUpdateRequest request, ContactResp contact, CancellationToken ct)
    {
        UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
        updateCmd.Id = (Guid)request.ApplicantId;

        //spdbt-3706
        if (contact.HasCriminalHistory == true)
            updateCmd.HasCriminalHistory = true;
        if (contact.IsTreatedForMHC == true)
            updateCmd.IsTreatedForMHC = true;

        //concat new crminal history detail with old ones. - not valid any more.
        if (request.HasCriminalHistory == true && !string.IsNullOrEmpty(contact.CriminalChargeDescription) && !string.IsNullOrEmpty(request.CriminalHistoryDetail))
            updateCmd.CriminalChargeDescription = $"{contact.CriminalChargeDescription}\n\n*Updated at: {DateTime.Now}\n{request.CriminalHistoryDetail}";

        await _contactRepository.ManageAsync(updateCmd, ct);
    }
    private async Task UpdateApplicantProfile(ControllingMemberCrcAppUpsertRequest request, CancellationToken ct)
    {
        UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
        updateCmd.Id = (Guid)request.ApplicantId;

        //spdbt-3706
        if (request.HasCriminalHistory == true)
            updateCmd.HasCriminalHistory = true;
        if (request.IsTreatedForMHC == true)
            updateCmd.IsTreatedForMHC = true;

        await _contactRepository.ManageAsync(updateCmd, ct);
    }
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
    private async Task<ChangeSpec> AddDynamicTasks(ContactResp originalApplicant,
    ControllingMemberCrcAppUpdateRequest newRequest,
    BizContactResp bizContact,
    LicenceResp bizLicence,
    IEnumerable<LicAppFileInfo> newFileInfos,
    CancellationToken ct)
    {
        ChangeSpec changes = new();
        StringBuilder descriptionBuilder = new();
        List<string> fileNames = new List<string>();

        // Collect file names for attachments
        fileNames.AddRange(newFileInfos
            .Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict ||
                        d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition)
            .Select(d => d.FileName));

        bool hasChanges = false;

        // Check PeaceOfficerStatusChanged
        PoliceOfficerRoleCode? originalRoleCode = originalApplicant.PoliceOfficerRoleCode == null ? null
            : Enum.Parse<PoliceOfficerRoleCode>(originalApplicant.PoliceOfficerRoleCode.ToString());

        if (newRequest.IsPoliceOrPeaceOfficer != originalApplicant.IsPoliceOrPeaceOfficer ||
            newRequest.PoliceOfficerRoleCode != originalRoleCode ||
            newRequest.OtherOfficerRole != originalApplicant.OtherOfficerRole ||
            newFileInfos.Any(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            descriptionBuilder.AppendLine("* Peace Officer Status");
            changes.PeaceOfficerStatusChanged = true;
            hasChanges = true;
        }

        // Check MentalHealthStatusChanged
        if (newRequest.IsTreatedForMHC == true)
        {
            descriptionBuilder.AppendLine("* Mental Health");
            changes.MentalHealthStatusChanged = true;
            hasChanges = true;
        }

        // Check CriminalHistoryChanged
        if (newRequest.HasCriminalHistory == true)
        {
            descriptionBuilder.AppendLine("* Criminal History");
            changes.CriminalHistoryChanged = true;
            hasChanges = true;
        }

        // Create a single task if there are changes
        if (hasChanges)
        {
            var taskId = (await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Business have to requested to update below submitted information for its controlling member:" +
                              $"\nControlling Member - {originalApplicant.LastName}, {originalApplicant.FirstName}" +
                              $"\nUpdated:\n{descriptionBuilder.ToString().Trim()}" +
                              $"{(fileNames.Any() ? $"\n\nFile Names:\n* {string.Join("\n* ", fileNames)}" : string.Empty)}",
                DueDateTime = DateTimeOffset.Now.AddDays(3),
                Subject = $"Updating controlling member background information for {bizLicence.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingAccountId = bizContact.BizId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = bizLicence.LicenceId
            }, ct)).TaskId;

            // Assign the generated task ID to the appropriate properties
            if (changes.PeaceOfficerStatusChanged)
            {
                changes.PeaceOfficerStatusChangeTaskId = taskId;
            }
            if (changes.MentalHealthStatusChanged)
            {
                changes.MentalHealthStatusChangeTaskId = taskId;
            }
            if (changes.CriminalHistoryChanged)
            {
                changes.CriminalHistoryStatusChangeTaskId = taskId;
            }
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

        if (request.IsTreatedForMHC == true &&
            !newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing MentalHealthCondition file");
        }

        if (!newFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint) &&
            !existingFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }
    }

}
