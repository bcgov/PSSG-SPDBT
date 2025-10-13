using AutoMapper;
using MediatR;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence;

internal partial class LicenceAppDocumentManager :
        IRequestHandler<CreateDocumentInCacheCommand, IEnumerable<LicAppFileInfo>>,
        IRequestHandler<CreateDocumentInTransientStoreCommand, IEnumerable<LicenceAppDocumentResponse>>,
        IRequestHandler<CreateDocumentInTransientStoreFromStreamCommand, IEnumerable<LicenceAppDocumentResponse>>,
        IRequestHandler<CreateTempDocumentInTransientStoreCommand, IEnumerable<LicAppFileInfo>>,
        ILicenceAppDocumentManager
{
    private readonly IPersonLicApplicationRepository _personlicAppRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly ITransientFileStorageService _transientFileStorageService;
    private readonly IDocumentRepository _documentRepository;
    private readonly IBizLicApplicationRepository _bizLicApplicationRepository;

    public LicenceAppDocumentManager(
        IPersonLicApplicationRepository personLicAppRepository,
        IBizLicApplicationRepository bizLicApplicationRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDocumentRepository documentUrlRepository,
        ITransientFileStorageService transientFileStorageService)
    {
        _personlicAppRepository = personLicAppRepository;
        _bizLicApplicationRepository = bizLicApplicationRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _documentRepository = documentUrlRepository;
        _transientFileStorageService = transientFileStorageService;
    }

    public async Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateDocumentInTransientStoreCommand command, CancellationToken cancellationToken)
    {
        BizLicApplicationResp? bizLicApplicationResp = null;
        Guid? contactId = null;
        DocumentTypeEnum? docType1 = Mappings.GetDocumentType1Enum(command.Request.LicenceDocumentTypeCode);
        DocumentTypeEnum? docType2 = Mappings.GetDocumentType2Enum(command.Request.LicenceDocumentTypeCode);

        LicenceApplicationResp app = await _personlicAppRepository.GetLicenceApplicationAsync(command.AppId, cancellationToken);
        if (app == null)
            throw new ArgumentException("Invalid application Id");

        // For business licence, the contact info is pulled from account, thus accountId must be set in "CreateDocumentCmd"
        // For others, the info is pulled from contact, thus contactId must be set in "CreateDocumentCmd"
        if (app.ServiceTypeCode == ServiceTypeEnum.SecurityBusinessLicence)
            bizLicApplicationResp = await _bizLicApplicationRepository.GetBizLicApplicationAsync(command.AppId, cancellationToken);
        else
            contactId = app.ContactId;

        //put file to cache
        IList<DocumentResp> docResps = new List<DocumentResp>();
        foreach (var file in command.Request.Documents)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);

            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(ms.ToArray()), cancellationToken);
            SpdTempFile spdTempFile = new()
            {
                TempFileKey = fileKey,
                ContentType = file.ContentType,
                FileName = file.FileName,
                FileSize = file.Length,
            };

            //create bcgov_documenturl and file
            var docResp = await _documentRepository.ManageAsync(new CreateDocumentCmd
            {
                TempFile = spdTempFile,
                ApplicationId = command.AppId,
                DocumentType = docType1,
                DocumentType2 = docType2,
                SubmittedByApplicantId = contactId,
                ApplicantId = contactId,
                AccountId = bizLicApplicationResp?.BizId,
                ToTransientBucket = true,
            }, cancellationToken);
            docResps.Add(docResp);
        }

        return _mapper.Map<IEnumerable<LicenceAppDocumentResponse>>(docResps);
    }

    public async Task<IEnumerable<LicAppFileInfo>> Handle(CreateDocumentInCacheCommand command, CancellationToken cancellationToken)
    {
        //put file to cache
        IList<LicAppFileInfo> cacheFileInfos = new List<LicAppFileInfo>();
        foreach (var file in command.Request.Documents)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);

            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(ms.ToArray()), cancellationToken);
            LicAppFileInfo f = new()
            {
                TempFileKey = fileKey,
                ContentType = file.ContentType,
                FileName = file.FileName,
                FileSize = file.Length,
                LicenceDocumentTypeCode = command.Request.LicenceDocumentTypeCode
            };
            cacheFileInfos.Add(f);
        }

        return cacheFileInfos;
    }

    public async Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateDocumentInTransientStoreFromStreamCommand command, CancellationToken cancellationToken)
    {
        BizLicApplicationResp? bizLicApplicationResp = null;
        Guid? contactId = null;
        DocumentTypeEnum? docType1 = Mappings.GetDocumentType1Enum(command.Request.LicenceDocumentTypeCode);
        DocumentTypeEnum? docType2 = Mappings.GetDocumentType2Enum(command.Request.LicenceDocumentTypeCode);

        LicenceApplicationResp app = await _personlicAppRepository.GetLicenceApplicationAsync(command.AppId, cancellationToken);
        if (app == null)
            throw new ArgumentException("Invalid application Id");

        // For business licence, the contact info is pulled from account, thus accountId must be set in "CreateDocumentCmd"
        // For others, the info is pulled from contact, thus contactId must be set in "CreateDocumentCmd"
        if (app.ServiceTypeCode == ServiceTypeEnum.SecurityBusinessLicence)
            bizLicApplicationResp = await _bizLicApplicationRepository.GetBizLicApplicationAsync(command.AppId, cancellationToken);
        else
            contactId = app.ContactId;

        //transfer file through memory stream
        IList<DocumentResp> docResps = new List<DocumentResp>();
        foreach (var file in command.Request.Documents)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);

            SpdTempFile spdTempFile = new()
            {
                TempFileKey = null, //null means the content is in FileStream
                ContentType = file.ContentType,
                FileName = file.FileName,
                FileSize = file.Length,
                FileStream = ms
            };

            //create bcgov_documenturl and file
            var docResp = await _documentRepository.ManageAsync(new CreateDocumentCmd
            {
                TempFile = spdTempFile,
                ApplicationId = command.AppId,
                DocumentType = docType1,
                DocumentType2 = docType2,
                SubmittedByApplicantId = contactId,
                ApplicantId = contactId,
                AccountId = bizLicApplicationResp?.BizId,
                ToTransientBucket = true,
            }, cancellationToken);
            docResps.Add(docResp);
        }

        return _mapper.Map<IEnumerable<LicenceAppDocumentResponse>>(docResps);
    }

    public async Task<IEnumerable<LicAppFileInfo>> Handle(CreateTempDocumentInTransientStoreCommand command, CancellationToken cancellationToken)
    {
        //put file to cache
        IList<LicAppFileInfo> cacheFileInfos = new List<LicAppFileInfo>();
        foreach (var file in command.Request.Documents)
        {
            //save the file to transient storage
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellationToken);
            string folder = "TEMP";
            string tempFileKey = Guid.NewGuid().ToString();
            Utilities.FileStorage.File fileToSave = new()
            {
                Content = ms.ToArray(),
                ContentType = file.ContentType,
                FileName = file.FileName,
            };
            UploadFileCommand uploadFileCmd = new(
                        Key: tempFileKey,
                        Folder: folder,
                        File: fileToSave,
                        FileTag: null);
            await _transientFileStorageService.HandleCommand(uploadFileCmd, cancellationToken);

            //update key in TempFileKey
            LicAppFileInfo f = new()
            {
                TempFileKey = tempFileKey,
                ContentType = file.ContentType,
                FileName = file.FileName,
                FileSize = file.Length,
                LicenceDocumentTypeCode = command.Request.LicenceDocumentTypeCode,
            };
            cacheFileInfos.Add(f);
        }

        return cacheFileInfos;
    }

    public static readonly List<LicenceDocumentTypeCode> WorkProofCodes = new()
    {
            LicenceDocumentTypeCode.PermanentResidentCard,
            LicenceDocumentTypeCode.RecordOfLandingDocument,
            LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument,
            LicenceDocumentTypeCode.WorkPermit,
            LicenceDocumentTypeCode.StudyPermit,
            LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus,
        };

    public static readonly List<LicenceDocumentTypeCode> CitizenshipProofCodes = new()
    {
            LicenceDocumentTypeCode.CanadianPassport,
            LicenceDocumentTypeCode.BirthCertificate,
            LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen,
            LicenceDocumentTypeCode.CanadianCitizenship
        };
    public static readonly List<WorkerCategoryTypeCode> WorkerCategoryTypeCode_NoNeedDocument = new()
    {
            WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            WorkerCategoryTypeCode.SecurityAlarmMonitor,
            WorkerCategoryTypeCode.SecurityAlarmResponse,
            WorkerCategoryTypeCode.SecurityAlarmSales,
            WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
            WorkerCategoryTypeCode.LocksmithUnderSupervision,
            WorkerCategoryTypeCode.BodyArmourSales
        };

    public static readonly List<LicenceDocumentTypeCode> CanadianResidencyProofCodes = new()
    {
            LicenceDocumentTypeCode.PermanentResidentCard,
            LicenceDocumentTypeCode.RecordOfLandingDocument,
            LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument,
            LicenceDocumentTypeCode.WorkPermit,
            LicenceDocumentTypeCode.StudyPermit,
        };

    public static readonly List<LicenceDocumentTypeCode> NonCanadianCitizenProofCodes = new()
    {
            LicenceDocumentTypeCode.DriversLicence,
            LicenceDocumentTypeCode.GovernmentIssuedPhotoId,
            LicenceDocumentTypeCode.NonCanadianPassport
        };

    //todo: need to get requirements confirmed
    public static readonly List<LicenceDocumentTypeCode> ValidGovIssuedPhotoIdCodes = new()
    {
            LicenceDocumentTypeCode.PassportAdditional,
            LicenceDocumentTypeCode.BCID,
            LicenceDocumentTypeCode.DriversLicenceAdditional,
            LicenceDocumentTypeCode.PermanentResidentCardAdditional,
            LicenceDocumentTypeCode.BcServicesCard,
            LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional,
            LicenceDocumentTypeCode.CanadianFirearmsLicence,
        };
}