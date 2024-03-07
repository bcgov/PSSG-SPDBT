using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Net;

namespace Spd.Manager.Licence;
internal class PermitAppManager :
        LicenceAppManagerBase,
        IRequestHandler<GetPermitApplicationQuery, PermitLicenceAppResponse>,
        IRequestHandler<AnonymousPermitAppNewCommand, PermitAppCommandResponse>,
        IRequestHandler<AnonymousPermitAppRenewCommand, PermitAppCommandResponse>,
        IRequestHandler<AnonymousPermitAppUpdateCommand, PermitAppCommandResponse>,
        IPermitAppManager
{
    private readonly ILicenceRepository _licenceRepository;
    private readonly IContactRepository _contactRepository;
    private readonly ITaskRepository _taskRepository;

    public PermitAppManager(
        ILicenceRepository licenceRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IContactRepository contactRepository,
        ITaskRepository taskRepository) : base(mapper, documentUrlRepository, feeRepository, licenceAppRepository)
    {
        _licenceRepository = licenceRepository;
        _contactRepository = contactRepository;
        _taskRepository = taskRepository;
    }

    #region anonymous

    public async Task<PermitLicenceAppResponse> Handle(GetPermitApplicationQuery query, CancellationToken cancellationToken)
    {
        var response = await _licenceAppRepository.GetLicenceApplicationAsync(query.LicenceApplicationId, cancellationToken);
        PermitLicenceAppResponse result = _mapper.Map<PermitLicenceAppResponse>(response);
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(query.LicenceApplicationId), cancellationToken);
        result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode != null).ToList();  // Exclude licence document type code that are not defined in the related dictionary
        return result;
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppNewCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        ValidateFilesForNewApp(cmd);
        //save the application
        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
        await UploadNewDocsAsync(request, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, cancellationToken);
        decimal? cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);
        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppRenewCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Renewal)
            throw new ArgumentException("should be a renewal request");

        //validation: check if original licence meet renew condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be renewed.");
        LicenceResp originalLic = originalLicences.Items.First();

        //check Renew your existing permit before it expires, within 90 days of the expiry date.
        if (DateTime.UtcNow < originalLic.ExpiryDate.AddDays(-Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays).ToDateTime(new TimeOnly(0, 0))
            || DateTime.UtcNow > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"the permit can only be renewed within {Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays} days of the expiry date.");

        await ValidateFilesForRenewUpdateAppAsync(cmd.LicenceAnonymousRequest,
            cmd.LicAppFileInfos.ToList(),
            cancellationToken);

        CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
        var response = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

        await UploadNewDocsAsync(request,
                cmd.LicAppFileInfos,
                response?.LicenceAppId,
                response?.ContactId,
                null,
                null,
                null,
                cancellationToken);

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

        //return cost here.
        decimal? cost = await CommitApplicationAsync(request, response.LicenceAppId, cancellationToken);

        return new PermitAppCommandResponse { LicenceAppId = response.LicenceAppId, Cost = cost };
    }

    public async Task<PermitAppCommandResponse> Handle(AnonymousPermitAppUpdateCommand cmd, CancellationToken cancellationToken)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
        if (cmd.LicenceAnonymousRequest.ApplicationTypeCode != ApplicationTypeCode.Update)
            throw new ArgumentException("should be an update request");

        //validation: check if original licence meet update condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(new LicenceQry() { LicenceId = request.OriginalLicenceId }, cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be updated.");
        LicenceResp originalLic = originalLicences.Items.First();
        if (DateTime.UtcNow.AddDays(Constants.LicenceUpdateValidBeforeExpirationInDays) > originalLic.ExpiryDate.ToDateTime(new TimeOnly(0, 0)))
            throw new ArgumentException($"can't request an update within {Constants.LicenceUpdateValidBeforeExpirationInDays} days of expiry date.");

        LicenceApplicationResp originalApp = await _licenceAppRepository.GetLicenceApplicationAsync((Guid)cmd.LicenceAnonymousRequest.OriginalApplicationId, cancellationToken);
        ChangeSpec changes = await MakeChanges(originalApp, request, cmd.LicAppFileInfos, originalLic, cancellationToken);

        LicenceApplicationCmdResp? createLicResponse = null;
        if ((request.Reprint != null && request.Reprint.Value))
        {
            CreateLicenceApplicationCmd createApp = _mapper.Map<CreateLicenceApplicationCmd>(request);
            createLicResponse = await _licenceAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);

            await CommitApplicationAsync(request, createLicResponse.LicenceAppId, cancellationToken);
        }
        else
        {
            //update contact directly
            UpdateContactCmd updateCmd = _mapper.Map<UpdateContactCmd>(request);
            updateCmd.Id = originalApp.ContactId ?? Guid.Empty;
            await _contactRepository.ManageAsync(updateCmd, cancellationToken);
        }
        await UploadNewDocsAsync(request,
            cmd.LicAppFileInfos,
            createLicResponse?.LicenceAppId,
            originalApp.ContactId,
            null,
            null,
            changes.PurposeChangeTaskId,
            cancellationToken);
        return new PermitAppCommandResponse() { LicenceAppId = createLicResponse?.LicenceAppId };
    }

    #endregion

    private static void ValidateFilesForNewApp(AnonymousPermitAppNewCommand cmd)
    {
        PermitAppAnonymousSubmitRequest request = cmd.LicenceAnonymousRequest;
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
            if (!fileInfos.Any(f => LicenceAppDocumentManager.NonCanadiaCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Missing proven file because you are not canadian but you are not a resident in canada.");
            }
        }

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }

    }

    private async Task<ChangeSpec> MakeChanges(LicenceApplicationResp originalApp, 
        PermitAppAnonymousSubmitRequest newRequest,
        IEnumerable<LicAppFileInfo> newFileInfos,
        LicenceResp originalLic, CancellationToken ct)
    {
        ChangeSpec changes = new ChangeSpec();
        
        // Check if prupose changed
        changes.PurposeChanged = ChangeInPurpose(originalApp, newRequest);

        // Check if rationale changed
        if (!String.Equals(newRequest.Rationale, originalApp.Rationale, StringComparison.OrdinalIgnoreCase) ||
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
                RegardingContactId = originalApp.ContactId,
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
                RegardingContactId = originalApp.ContactId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Risk_Assessment_Coordinator_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct)).TaskId;
        }

        return changes;

    }

    private async Task ValidateFilesForRenewUpdateAppAsync(PermitAppAnonymousSubmitRequest request,
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
            if (!newFileInfos.Any(f => LicenceAppDocumentManager.NonCanadiaCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)) &&
                !existingFileInfos.Any(f => LicenceAppDocumentManager.NonCanadiaCitizenProofCodes.Contains(f.LicenceDocumentTypeCode)))
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

    private bool ChangeInEmployerInfo(LicenceApplicationResp originalApp, PermitAppAnonymousSubmitRequest newRequest)
    {
        if (!String.Equals(StringHelper.SanitizeNull(originalApp.EmployerName), StringHelper.SanitizeNull(newRequest.EmployerName), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.SupervisorName), StringHelper.SanitizeNull(newRequest.SupervisorName), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.SupervisorEmailAddress), StringHelper.SanitizeNull(newRequest.SupervisorEmailAddress), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.SupervisorPhoneNumber), StringHelper.SanitizeNull(newRequest.SupervisorPhoneNumber), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.EmployerPrimaryAddress?.AddressLine1), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.AddressLine1), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.EmployerPrimaryAddress?.AddressLine2), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.AddressLine2), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.EmployerPrimaryAddress?.City), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.City), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.EmployerPrimaryAddress?.Country), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.Country), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.EmployerPrimaryAddress?.PostalCode), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.PostalCode), StringComparison.OrdinalIgnoreCase) ||
            !String.Equals(StringHelper.SanitizeNull(originalApp.EmployerPrimaryAddress?.Province), StringHelper.SanitizeNull(newRequest.EmployerPrimaryAddress?.Province), StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return false;
    }

    private List<string> GetPurposes(PermitAppAnonymousSubmitRequest newRequest)
    {
        List<string> purposes = [];

        if (newRequest.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit)
        {
            foreach (var reasonCode in newRequest.ArmouredVehiclePermitReasonCodes)
                purposes.Add(reasonCode.ToString());
        } else
        {
            foreach (var reasonCode in newRequest.BodyArmourPermitReasonCodes)
                purposes.Add(reasonCode.ToString());
        }

        return purposes;
    }

    private bool ChangeInPurpose(LicenceApplicationResp originalApp, PermitAppAnonymousSubmitRequest newRequest)
    {
        List<PermitPurposeEnum> permitPurposeRequest = [];

        if (newRequest.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit)
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
        if (permitPurposeRequest.Count != originalApp.PermitPurposeEnums?.Count())
            return true;
        else
        {
            List<PermitPurposeEnum> newList = permitPurposeRequest;
            newList.Sort();
            List<PermitPurposeEnum> originalList = originalApp.PermitPurposeEnums.ToList();
            originalList.Sort();

            if (!newList.SequenceEqual(originalList)) 
                return true;
        }

        // Check if there is a different reason when selected value is "other"
        if (permitPurposeRequest.Contains(PermitPurposeEnum.Other) &&
            originalApp.PermitPurposeEnums.Contains(PermitPurposeEnum.Other) &&
            !String.Equals(newRequest.PermitOtherRequiredReason, originalApp.PermitOtherRequiredReason, StringComparison.OrdinalIgnoreCase))
            return true;

        // Check if there is a change in employer when selected value is "my employment"
        if (permitPurposeRequest.Contains(PermitPurposeEnum.MyEmployment) &&
            originalApp.PermitPurposeEnums.Contains(PermitPurposeEnum.MyEmployment) &&
            ChangeInEmployerInfo(originalApp, newRequest))
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
