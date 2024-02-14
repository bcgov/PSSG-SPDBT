using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.TempFileStorage;

namespace Spd.Manager.Licence;
internal partial class LicenceAppDocumentManager :
        IRequestHandler<CreateDocumentInCacheCommand, IEnumerable<LicAppFileInfo>>,
        IRequestHandler<CreateLicenceAppDocumentCommand, IEnumerable<LicenceAppDocumentResponse>>,
        ILicenceAppDocumentManager
{
    private readonly ILicenceApplicationRepository _licenceAppRepository;
    private readonly IMapper _mapper;
    private readonly ITempFileStorageService _tempFile;
    private readonly IDocumentRepository _documentRepository;

    public LicenceAppDocumentManager(
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper,
        ITempFileStorageService tempFile,
        IDocumentRepository documentUrlRepository)
    {
        _licenceAppRepository = licenceAppRepository;
        _tempFile = tempFile;
        _mapper = mapper;
        _documentRepository = documentUrlRepository;
    }

    public async Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct)
    {
        DocumentTypeEnum? docType1 = Mappings.GetDocumentType1Enum(command.Request.LicenceDocumentTypeCode);
        DocumentTypeEnum? docType2 = Mappings.GetDocumentType2Enum(command.Request.LicenceDocumentTypeCode);

        LicenceApplicationResp app = await _licenceAppRepository.GetLicenceApplicationAsync(command.AppId, ct);
        if (app == null)
            throw new ArgumentException("Invalid application Id");

        Guid? contactId = app.ContactId;
        //put file to cache
        IList<DocumentResp> docResps = new List<DocumentResp>();
        foreach (var file in command.Request.Documents)
        {
            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(file), ct);
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
            }, ct);
            docResps.Add(docResp);
        }

        return _mapper.Map<IEnumerable<LicenceAppDocumentResponse>>(docResps);
    }

    public async Task<IEnumerable<LicAppFileInfo>> Handle(CreateDocumentInCacheCommand command, CancellationToken ct)
    {
        //put file to cache
        IList<LicAppFileInfo> cacheFileInfos = new List<LicAppFileInfo>();
        foreach (var file in command.Request.Documents)
        {
            string fileKey = await _tempFile.HandleCommand(new SaveTempFileCommand(file), ct);
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
    public static readonly List<LicenceDocumentTypeCode> WorkProofCodes = new List<LicenceDocumentTypeCode> {
            LicenceDocumentTypeCode.PermanentResidentCard,
            LicenceDocumentTypeCode.RecordOfLandingDocument,
            LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument,
            LicenceDocumentTypeCode.WorkPermit,
            LicenceDocumentTypeCode.StudyPermit,
            LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus,
        };

    public static readonly List<LicenceDocumentTypeCode> CitizenshipProofCodes = new List<LicenceDocumentTypeCode> {
            LicenceDocumentTypeCode.CanadianPassport,
            LicenceDocumentTypeCode.BirthCertificate,
            LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen,
            LicenceDocumentTypeCode.CanadianCitizenship
        };

    public static readonly List<WorkerCategoryTypeCode> WorkerCategoryTypeCode_NoNeedDocument = new List<WorkerCategoryTypeCode> {
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

    public static readonly List<LicenceDocumentTypeCode> CanadianResidencyProofCodes = new List<LicenceDocumentTypeCode> {
            LicenceDocumentTypeCode.PermanentResidentCard,
            LicenceDocumentTypeCode.RecordOfLandingDocument,
            LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument,
            LicenceDocumentTypeCode.WorkPermit,
            LicenceDocumentTypeCode.StudyPermit,
        };

    public static readonly List<LicenceDocumentTypeCode> NonCanadiaCitizenProofCodes = new List<LicenceDocumentTypeCode> {
            LicenceDocumentTypeCode.DriversLicence,
            LicenceDocumentTypeCode.GovernmentIssuedPhotoId
        };
    private async Task UpdateDocumentsAsync(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        ////citizenship
        //if (request.CitizenshipDocument != null)
        //{
        //    foreach (LicenceAppDocumentResponse doc in request.CitizenshipDocument.DocumentResponses)
        //    {
        //        await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, request.CitizenshipDocument.ExpiryDate), ct);
        //    }
        //}
        ////govid
        //if (request.AdditionalGovIdDocument != null)
        //{
        //    foreach (LicenceAppDocumentResponse doc in request.AdditionalGovIdDocument.DocumentResponses)
        //    {
        //        await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, request.AdditionalGovIdDocument.ExpiryDate), ct);
        //    }
        //}

        ////category
        //foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        //{
        //    if (category.Documents != null)
        //    {
        //        foreach (Document d in category.Documents)
        //        {
        //            foreach (var doc in d.DocumentResponses)
        //            {
        //                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, d.ExpiryDate), ct);
        //            }
        //        }
        //    }
        //}
    }

    private async Task RemoveDeletedDocumentsAsync(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        //if (request.LicenceAppId == null) { return; }
        //var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(request.LicenceAppId), ct);
        //List<Guid> allValidDocGuids = new List<Guid>();
        //if (request.AdditionalGovIdDocument != null && request.AdditionalGovIdDocument.DocumentResponses.Any())
        //{
        //    allValidDocGuids.AddRange(request.AdditionalGovIdDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //}
        //if (request.CitizenshipDocument != null && request.CitizenshipDocument.DocumentResponses.Any())
        //{
        //    allValidDocGuids.AddRange(request.CitizenshipDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //}
        //if (request.FingerprintProofDocument != null && request.FingerprintProofDocument.DocumentResponses.Any())
        //{
        //    allValidDocGuids.AddRange(request.FingerprintProofDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //}
        //if (request.IdPhotoDocument != null && request.IdPhotoDocument.DocumentResponses.Any())
        //{
        //    allValidDocGuids.AddRange(request.IdPhotoDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //}
        //if (request.MentalHealthDocument != null && request.MentalHealthDocument.DocumentResponses.Any())
        //{
        //    allValidDocGuids.AddRange(request.MentalHealthDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //}
        //if (request.PoliceOfficerDocument != null && request.PoliceOfficerDocument.DocumentResponses.Any())
        //{
        //    allValidDocGuids.AddRange(request.PoliceOfficerDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //}
        //foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        //{
        //    if (category.Documents != null)
        //    {
        //        foreach (Document d in category.Documents)
        //        {
        //            allValidDocGuids.AddRange(d.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        //        }
        //    }
        //}
        ////mark all valid doc active.
        //foreach (Guid docUrlId in allValidDocGuids)
        //{
        //    await _documentRepository.ManageAsync(new ReactivateDocumentCmd(docUrlId), ct);
        //}

        ////remove all docs that need to be deleted.
        //var shouldDeleteDocs = existingDocs.Items.Where(i => !allValidDocGuids.Contains(i.DocumentUrlId)).ToList();
        //foreach (DocumentResp doc in shouldDeleteDocs)
        //{
        //    await _documentRepository.ManageAsync(new RemoveDocumentCmd(doc.DocumentUrlId), ct);
        //}
    }
}
