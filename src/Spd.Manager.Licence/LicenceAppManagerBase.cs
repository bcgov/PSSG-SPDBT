using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;

namespace Spd.Manager.Licence;
internal abstract class LicenceAppManagerBase
{
    protected readonly IMapper _mapper;
    protected readonly IDocumentRepository _documentRepository;
    protected readonly ILicenceFeeRepository _feeRepository;
    protected readonly ILicenceApplicationRepository _licenceAppRepository;

    public LicenceAppManagerBase(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceApplicationRepository licenceAppRepository)
    {
        _mapper = mapper;
        _documentRepository = documentRepository;
        _feeRepository = feeRepository;
        _licenceAppRepository = licenceAppRepository;
    }

    protected async Task<decimal?> CommitApplicationAsync(PersonalLicenceAppBase request, Guid licenceAppId, CancellationToken ct, bool HasSwl90DayLicence = false)
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
        return price.LicenceFees.FirstOrDefault()?.Amount;
    }

    //upload file from cache to main bucket
    protected async Task UploadNewDocsAsync(PersonalLicenceAppBase request,
        IEnumerable<LicAppFileInfo> newFileInfos,
        Guid? licenceAppId,
        Guid? contactId,
        Guid? peaceOfficerStatusChangeTaskId,
        Guid? mentalHealthStatusChangeTaskId,
        Guid? purposeChangeTaskId,
        CancellationToken ct)
    {
        if (newFileInfos != null && newFileInfos.Any())
        {
            foreach (LicAppFileInfo licAppFile in newFileInfos)
            {
                SpdTempFile? tempFile = _mapper.Map<SpdTempFile>(licAppFile);
                CreateDocumentCmd? fileCmd = _mapper.Map<CreateDocumentCmd>(licAppFile);
                if (licAppFile.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict)
                {
                    fileCmd.TaskId = peaceOfficerStatusChangeTaskId;
                }
                else if (licAppFile.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition)
                {
                    fileCmd.TaskId = mentalHealthStatusChangeTaskId;
                }
                else if (licAppFile.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ArmouredVehicleRationale || licAppFile.LicenceDocumentTypeCode == LicenceDocumentTypeCode.BodyArmourRationale)
                {
                    fileCmd.TaskId = purposeChangeTaskId;
                }
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

    //for auth, update doc expired date and remove old files
    protected async Task UpdateDocumentsAsync(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        //for all files under this application, if it is not in request.DocumentInfos, deactivate it.
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(request.LicenceAppId), ct);
        foreach (DocumentResp existingDoc in existingDocs.Items)
        {
            if (!request.DocumentInfos.Any(d => d.DocumentUrlId == existingDoc.DocumentUrlId))
            {
                //remove existingDoc and delete it from s3 bucket.
                await _documentRepository.ManageAsync(new RemoveDocumentCmd(existingDoc.DocumentUrlId), ct);
            }
            else
            {
                //update expiredDate
                LicenceDocumentTypeCode? docCode = Mappings.GetLicenceDocumentTypeCode(existingDoc.DocumentType, existingDoc.DocumentType2);
                DateOnly? expiredDate = request.DocumentExpiredInfos.FirstOrDefault(i => i.LicenceDocumentTypeCode == docCode)?.ExpiryDate;
                if (expiredDate != null)
                    await _documentRepository.ManageAsync(new UpdateDocumentCmd(existingDoc.DocumentUrlId, expiredDate), ct);
            }
        }
    }
}

