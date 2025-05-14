using AutoMapper;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Net;
using System.Text.RegularExpressions;

namespace Spd.Manager.Licence;

internal abstract class LicenceAppManagerBase
{
    protected readonly IMapper _mapper;
    protected readonly IDocumentRepository _documentRepository;
    protected readonly ILicenceFeeRepository _feeRepository;
    protected readonly ILicenceRepository _licenceRepository;
    protected readonly IMainFileStorageService _mainFileService;
    protected readonly ITransientFileStorageService _transientFileService;
    protected readonly ILicAppRepository _licAppRepository;

    public LicenceAppManagerBase(IMapper mapper,
        IDocumentRepository documentRepository,
        ILicenceFeeRepository feeRepository,
        ILicenceRepository licenceRepository,
        IMainFileStorageService mainFileService,
        ITransientFileStorageService transientFileService,
        ILicAppRepository licAppRepository)
    {
        _mapper = mapper;
        _documentRepository = documentRepository;
        _feeRepository = feeRepository;
        _licenceRepository = licenceRepository;
        _mainFileService = mainFileService;
        _transientFileService = transientFileService;
        _licAppRepository = licAppRepository;
    }

    protected async Task<decimal> CommitApplicationAsync(LicenceAppBase licAppBase,
        Guid licenceAppId,
        CancellationToken ct,
        bool HasSwl90DayLicence = false,
        Guid? companionAppId = null,
        ApplicationOriginTypeCode? companionAppOrigin = null,
        Guid? cmParentAppId = null)
    {
        //if payment price is 0, directly set to Submitted, or PaymentPending
        var price = await _feeRepository.QueryAsync(new LicenceFeeQry()
        {
            ApplicationTypeEnum = licAppBase.ApplicationTypeCode == null ? null : Enum.Parse<ApplicationTypeEnum>(licAppBase.ApplicationTypeCode.ToString()),
            BizTypeEnum = licAppBase.BizTypeCode == null ? BizTypeEnum.None : Enum.Parse<BizTypeEnum>(licAppBase.BizTypeCode.ToString()),
            LicenceTermEnum = licAppBase.LicenceTermCode == null ? null : Enum.Parse<LicenceTermEnum>(licAppBase.LicenceTermCode.ToString()),
            ServiceTypeEnum = licAppBase.ServiceTypeCode == null ? null : Enum.Parse<ServiceTypeEnum>(licAppBase.ServiceTypeCode.ToString()),
            HasValidSwl90DayLicence = HasSwl90DayLicence
        }, ct);
        LicenceFeeResp? licenceFee = price?.LicenceFees.FirstOrDefault();

        //applications with portal origin type are considered authenticated, otherwise not.
        bool isAuthenticated = licAppBase.ApplicationOriginTypeCode == Shared.ApplicationOriginTypeCode.Portal ? true : false;
        bool isNewOrRenewal = licAppBase.ApplicationTypeCode == Shared.ApplicationTypeCode.New || licAppBase.ApplicationTypeCode == Shared.ApplicationTypeCode.Renewal;
        ApplicationStatusEnum status;

        if (licenceFee == null || licenceFee.Amount == 0)
        {
            if (licAppBase.ServiceTypeCode == ServiceTypeCode.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC)
            {
                if (isNewOrRenewal && !isAuthenticated)
                    status = ApplicationStatusEnum.ApplicantVerification;
                else
                {
                    if (cmParentAppId != null)//parent application status is inProgress, then set status to be Submitted. spdbt-4009
                    {
                        var parentApp = (await _licAppRepository.QueryAsync(new LicenceAppQuery(null, null, null, null, cmParentAppId), ct)).First();
                        if (parentApp.ApplicationPortalStatusCode == ApplicationPortalStatusEnum.InProgress)
                            status = ApplicationStatusEnum.Submitted;
                        else
                            status = ApplicationStatusEnum.PaymentPending;
                    }
                    else
                    {
                        status = ApplicationStatusEnum.PaymentPending;
                    }
                }

            }
            else
                status = isNewOrRenewal && !isAuthenticated ? ApplicationStatusEnum.ApplicantVerification : ApplicationStatusEnum.Submitted;
        }
        else
            status = ApplicationStatusEnum.PaymentPending;

        // Commit the companion application if it exists
        // companionAppId is the swl for sole proprietor which the business would pay for it, therefore the licence fee should be null here.
        if (companionAppId != null)
        {
            if (companionAppOrigin == ApplicationOriginTypeCode.Portal) //only authenticated swl save file in transient storage
                await MoveFilesAsync((Guid)companionAppId, ct);

            //spdbt-3194: update swl term with bl term
            await _licAppRepository.CommitLicenceApplicationAsync((Guid)companionAppId,
                ApplicationStatusEnum.PaymentPending,
                0,
                ct,
                Enum.Parse<LicenceTermEnum>(licAppBase.LicenceTermCode.ToString()));
        }
        // Commit the main licence application
        await _licAppRepository.CommitLicenceApplicationAsync(licenceAppId, status, licenceFee?.Amount ?? 0, ct);

        return licenceFee?.Amount ?? 0;
    }

    //upload file from cache to main bucket
    protected async Task UploadNewDocsAsync(IEnumerable<DocumentRelatedInfo>? documentRelatedInfos,
        IEnumerable<LicAppFileInfo> newFileInfos,
        Guid? licenceAppId,
        Guid? contactId,
        Guid? peaceOfficerStatusChangeTaskId,
        Guid? mentalHealthStatusChangeTaskId,
        Guid? purposeChangeTaskId,
        Guid? licenceId,
        Guid? accountId,
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
                fileCmd.AccountId = accountId;
                fileCmd.ExpiryDate = documentRelatedInfos?
                        .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                        .ExpiryDate;
                fileCmd.TempFile = tempFile;
                fileCmd.SubmittedByApplicantId = contactId ?? accountId;
                fileCmd.DocumentIdNumber = documentRelatedInfos?
                        .FirstOrDefault(d => d.LicenceDocumentTypeCode == licAppFile.LicenceDocumentTypeCode)?
                        .DocumentIdNumber;
                //create bcgov_documenturl and file
                await _documentRepository.ManageAsync(fileCmd, ct);
            }
        }
    }

    //for auth, update doc expired date, documentIdNumber and remove old files
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
                    await _documentRepository.ManageAsync(new UpdateDocumentCmd(existingDoc.DocumentUrlId, doc.ExpiryDate, docType1, docType2, doc.DocumentIdNumber), ct);
                }
                else
                {
                    await _documentRepository.ManageAsync(new UpdateDocumentCmd(existingDoc.DocumentUrlId, doc.ExpiryDate, null, null, doc.DocumentIdNumber), ct);
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

    protected async Task<Guid> GetLatestApplicationId(Guid? contactId, Guid? bizId, ServiceTypeEnum licenceTypeEnum, CancellationToken cancellationToken)
    {
        if (licenceTypeEnum == ServiceTypeEnum.SecurityBusinessLicence)
        {
            contactId = null;
            if (bizId == null) throw new ApiException(HttpStatusCode.BadRequest, $"bizId should not be null if it is a Security Business Licence.");
        }
        else
        {
            bizId = null;
            if (contactId == null) throw new ApiException(HttpStatusCode.BadRequest, $"contactId should not be null if it is a Personal Licence.");
        }

        //get the latest app id
        IEnumerable<LicenceAppListResp> list = await _licAppRepository.QueryAsync(
            new LicenceAppQuery(
                contactId,
                bizId,
                new List<ServiceTypeEnum> { licenceTypeEnum },
                new List<ApplicationPortalStatusEnum>
                {
                    ApplicationPortalStatusEnum.Completed,
                }),
            cancellationToken);
        LicenceAppListResp? app = list.Where(a => a.ApplicationTypeCode != ApplicationTypeEnum.Replacement)
            .OrderByDescending(a => a.SubmittedOn)
            .FirstOrDefault();
        if (app == null)
            throw new ApiException(HttpStatusCode.InternalServerError, $"there is no completed {licenceTypeEnum} application.");
        return app.LicenceAppId;
    }

    protected async Task<bool> HasDuplicates(Guid applicantId, ServiceTypeEnum serviceType, Guid? existingLicAppId, CancellationToken ct)
    {
        LicenceAppQuery q = new(
            applicantId,
            null,
            new List<ServiceTypeEnum>
            {
                serviceType
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
        var response = await _licAppRepository.QueryAsync(q, ct);
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
                Type = serviceType,
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

    protected async Task<IList<LicAppFileInfo>> GetExistingFileInfo(IEnumerable<Guid>? previousDocumentIds, CancellationToken ct)
    {
        IList<LicAppFileInfo> existingFileInfos = new List<LicAppFileInfo>();

        if (previousDocumentIds != null && previousDocumentIds.Any())
        {
            foreach (var documentId in previousDocumentIds)
            {
                var resp = await _documentRepository.GetAsync(documentId, ct);
                existingFileInfos.Add(new LicAppFileInfo()
                {
                    FileName = resp.FileName ?? String.Empty,
                    LicenceDocumentTypeCode = (LicenceDocumentTypeCode)Mappings.GetLicenceDocumentTypeCode(resp.DocumentType, resp.DocumentType2),
                });
            }
        }
        return existingFileInfos;
    }

    protected string? GetChangeSummary<T>(IEnumerable<LicAppFileInfo> newFileInfos, LicenceResp originalLic, ContactResp contactResp, LicenceAppBase newRequest)
        where T : class
    {
        string? result = null;
        //spdbt-4077
        string? docChangedSummary = null;
        if (newFileInfos != null)
        {
            docChangedSummary = string.Join("\r\n",
                newFileInfos.Select(d => {
                    string inputName = Regex.Replace(d.LicenceDocumentTypeCode.ToString()!, "([A-Z])", " $1", RegexOptions.None, TimeSpan.FromSeconds(3)).Trim();
                    string updatedInputName = inputName.Replace('_', '-');
                    return $"{updatedInputName} document has been added";
                    })
                ); 
        }

        var newData = _mapper.Map<T>(newRequest);
        var oldData = _mapper.Map<T>(originalLic);
        if (contactResp != null)
        {
            _mapper.Map<ContactResp, T>(contactResp, oldData);
        }
        var summary = PropertyComparer.GetPropertyDifferences(oldData, newData);
        result = string.Join("\r\n", summary);
        if (!string.IsNullOrWhiteSpace(docChangedSummary))
            result += "\r\n" + string.Join("\r\n", docChangedSummary);
        return result;
    }
}