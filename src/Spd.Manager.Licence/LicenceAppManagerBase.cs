using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;

internal abstract class LicenceAppManagerBase
{
    protected readonly IMapper _mapper;
    protected readonly IDocumentRepository _documentRepository;
    protected readonly ILicenceFeeRepository _feeRepository;
    protected readonly ILicenceApplicationRepository _licenceAppRepository;
    protected readonly IMainFileStorageService _mainFileService;
    protected readonly ITransientFileStorageService _transientFileService;

    public LicenceAppManagerBase(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceApplicationRepository licenceAppRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService)
    {
        _mapper = mapper;
        _documentRepository = documentRepository;
        _feeRepository = feeRepository;
        _licenceAppRepository = licenceAppRepository;
        _mainFileService = mainFileService;
        _transientFileService = transientFileService;
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
        if (price?.LicenceFees.FirstOrDefault() == null || price?.LicenceFees.FirstOrDefault()?.Amount == 0)
            await _licenceAppRepository.CommitLicenceApplicationAsync(licenceAppId, ApplicationStatusEnum.Submitted, ct);
        else
            await _licenceAppRepository.CommitLicenceApplicationAsync(licenceAppId, ApplicationStatusEnum.PaymentPending, ct);
        return price?.LicenceFees.FirstOrDefault()?.Amount;
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
            var doc = request.DocumentInfos?.FirstOrDefault(d => d.DocumentUrlId == existingDoc.DocumentUrlId);
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
        var response = await _licenceAppRepository.QueryAsync(q, ct);
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
}