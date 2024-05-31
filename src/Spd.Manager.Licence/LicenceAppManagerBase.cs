using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;

internal abstract class LicenceAppManagerBase
{
    protected readonly IMapper _mapper;
    protected readonly IDocumentRepository _documentRepository;
    protected readonly ILicenceFeeRepository _feeRepository;
    protected readonly ILicenceRepository _licenceRepository;
    protected readonly IPersonLicApplicationRepository _personLicAppRepository;
    protected readonly IMainFileStorageService _mainFileService;
    protected readonly ITransientFileStorageService _transientFileService;

    public LicenceAppManagerBase(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceRepository licenceRepository,
        IPersonLicApplicationRepository personLicAppRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService)
    {
        _mapper = mapper;
        _documentRepository = documentRepository;
        _feeRepository = feeRepository;
        _licenceRepository = licenceRepository;
        _personLicAppRepository = personLicAppRepository;
        _mainFileService = mainFileService;
        _transientFileService = transientFileService;
    }

    protected async Task<decimal> CommitApplicationAsync(LicenceAppBase licAppBase, Guid licenceAppId, CancellationToken ct, bool HasSwl90DayLicence = false)
    {
        //if payment price is 0, directly set to Submitted, or PaymentPending
        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = licAppBase.ApplicationTypeCode == null ? null : Enum.Parse<ApplicationTypeEnum>(licAppBase.ApplicationTypeCode.ToString()),
            BizTypeEnum = licAppBase.BizTypeCode == null ? BizTypeEnum.None : Enum.Parse<BizTypeEnum>(licAppBase.BizTypeCode.ToString()),
            LicenceTermEnum = licAppBase.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(licAppBase.LicenceTermCode.ToString()),
            WorkerLicenceTypeEnum = licAppBase.WorkerLicenceTypeCode == null ? null : Enum.Parse<WorkerLicenceTypeEnum>(licAppBase.WorkerLicenceTypeCode.ToString()),
            HasValidSwl90DayLicence = HasSwl90DayLicence
        }, ct);
        if (price?.LicenceFees.FirstOrDefault() == null || price?.LicenceFees.FirstOrDefault()?.Amount == 0)
            await _personLicAppRepository.CommitLicenceApplicationAsync(licenceAppId, ApplicationStatusEnum.Submitted, ct);
        else
            await _personLicAppRepository.CommitLicenceApplicationAsync(licenceAppId, ApplicationStatusEnum.PaymentPending, ct);
        return price?.LicenceFees.FirstOrDefault()?.Amount ?? 0;
    }

    //upload file from cache to main bucket
    protected async Task UploadNewDocsAsync(PersonalLicenceAppBase request,
        IEnumerable<LicAppFileInfo> newFileInfos,
        Guid? licenceAppId,
        Guid? contactId,
        Guid? peaceOfficerStatusChangeTaskId,
        Guid? mentalHealthStatusChangeTaskId,
        Guid? purposeChangeTaskId,
        Guid? licenceId,
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
                    fileCmd.LicenceId = licenceId;
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
    protected async Task UpdateDocumentsAsync(Guid licenceAppId, List<Document>? documentInfos, CancellationToken ct)
    {
        //for all files under this application, if it is not in request.DocumentInfos, deactivate it.
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(licenceAppId), ct);
        foreach (DocumentResp existingDoc in existingDocs.Items)
        {
            var doc = documentInfos?.FirstOrDefault(d => d.DocumentUrlId == existingDoc.DocumentUrlId);
            if (doc == null)
            {
                //remove existingDoc and delete it from s3 bucket.
                await _documentRepository.ManageAsync(new RemoveDocumentCmd(existingDoc.DocumentUrlId), ct);
            }
            else
            {
                //update expiredDate
                LicenceDocumentTypeCode? existDocType = Mappings.GetLicenceDocumentTypeCode(existingDoc.DocumentType, existingDoc.DocumentType2);
                if (doc.LicenceDocumentTypeCode == null)
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "documentType cannot be null");
                if (existDocType != doc.LicenceDocumentTypeCode) //doc type changed
                {
                    //update expiredDate  and doc type
                    DocumentTypeEnum? docType1 = Mappings.GetDocumentType1Enum((LicenceDocumentTypeCode)doc.LicenceDocumentTypeCode);
                    DocumentTypeEnum? docType2 = Mappings.GetDocumentType2Enum((LicenceDocumentTypeCode)doc.LicenceDocumentTypeCode);
                    await _documentRepository.ManageAsync(new UpdateDocumentCmd(existingDoc.DocumentUrlId, doc.ExpiryDate, docType1, docType2), ct);
                }
                else
                {
                    await _documentRepository.ManageAsync(new UpdateDocumentCmd(existingDoc.DocumentUrlId, doc.ExpiryDate), ct);
                }
            }
        }
    }

    protected async Task MoveFilesAsync(Guid applicationId, CancellationToken cancellationToken)
    {
        var result = await _documentRepository.QueryAsync(new DocumentQry() { ApplicationId = applicationId }, cancellationToken);
        foreach (var document in result.Items)
        {
            FileMetadataQueryResult queryResult = (FileMetadataQueryResult)await _transientFileService.HandleQuery(
                new FileMetadataQuery { Key = document.DocumentUrlId.ToString(), Folder = document.Folder },
                cancellationToken);
            bool fileExists = queryResult != null;

            if (fileExists)
            {
                await _mainFileService.HandleCopyStorageFromTransientToMainCommand(
                    new CopyStorageFromTransientToMainCommand
                    (
                        SourceKey: document.DocumentUrlId.ToString(),
                        SourceFolder: document.Folder,
                        DestKey: document.DocumentUrlId.ToString(),
                        DestFolder: document.Folder
                    ),
                    cancellationToken);
                await _transientFileService.HandleDeleteCommand(
                    new StorageDeleteCommand(document.DocumentUrlId.ToString(), document.Folder),
                    cancellationToken);
            }
        }
    }

    protected async Task<bool> HasDuplicates(Guid applicantId, WorkerLicenceTypeEnum workerLicenceType, Guid? existingLicAppId, CancellationToken ct)
    {
        LicenceAppQuery q = new(
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
        var response = await _personLicAppRepository.QueryAsync(q, ct);
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

    protected IEnumerable<UploadedDocumentEnum> GetUploadedDocumentEnums(IEnumerable<LicAppFileInfo> newLicAppFiles, IEnumerable<LicAppFileInfo> existingLicAppFiles)
    {
        List<UploadedDocumentEnum> docEnums = new();
        if (newLicAppFiles.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint) ||
            existingLicAppFiles.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
            docEnums.Add(UploadedDocumentEnum.Fingerprint);
        if (newLicAppFiles.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.WorkPermit) ||
            existingLicAppFiles.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.WorkPermit))
            docEnums.Add(UploadedDocumentEnum.WorkPermit);
        if (newLicAppFiles.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.StudyPermit) ||
            existingLicAppFiles.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.StudyPermit))
            docEnums.Add(UploadedDocumentEnum.StudyPermit);
        return docEnums;
    }

    protected IEnumerable<UploadedDocumentEnum> GetUploadedDocumentEnumsFromDocumentInfo(List<Document>? documentInfos)
    {
        List<UploadedDocumentEnum> docEnums = new();
        if (documentInfos == null) { return docEnums; }
        if (documentInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
            docEnums.Add(UploadedDocumentEnum.Fingerprint);
        if (documentInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.WorkPermit))
            docEnums.Add(UploadedDocumentEnum.WorkPermit);
        if (documentInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.StudyPermit))
            docEnums.Add(UploadedDocumentEnum.StudyPermit);
        return docEnums;
    }

    protected async Task<IList<LicAppFileInfo>> GetExistingFileInfo(Guid? originalApplicationId, IEnumerable<Guid>? previousDocumentIds, CancellationToken ct)
    {
        DocumentListResp docListResps = await _documentRepository.QueryAsync(new DocumentQry(originalApplicationId), ct);
        IList<LicAppFileInfo> existingFileInfos = Array.Empty<LicAppFileInfo>();

        if (previousDocumentIds != null && docListResps != null)
        {
            existingFileInfos = docListResps.Items.Where(d => previousDocumentIds.Contains(d.DocumentUrlId) && d.DocumentType2 != null)
            .Select(f => new LicAppFileInfo()
            {
                FileName = f.FileName ?? String.Empty,
                LicenceDocumentTypeCode = (LicenceDocumentTypeCode)Mappings.GetLicenceDocumentTypeCode(f.DocumentType, f.DocumentType2),
            }).ToList();
        }
        return existingFileInfos;
    }
}