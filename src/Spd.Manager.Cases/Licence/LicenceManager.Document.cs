using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.TempFileStorage;
using System.Collections.Immutable;

namespace Spd.Manager.Cases.Licence;
internal partial class LicenceManager
{
    public async Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct)
    {
        DocumentTypeEnum docEnum = GetDocumentTypeEnum(command.Request.LicenceDocumentTypeCode);
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
                DocumentType = docEnum,
                SubmittedByApplicantId = contactId
            }, ct);
            docResps.Add(docResp);
        }

        return _mapper.Map<IEnumerable<LicenceAppDocumentResponse>>(docResps);
    }

    private async Task UpdateDocumentsExpiryDate(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        if (request.BornInCanadaDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.BornInCanadaDocument.DocumentResponses)
            {
                await _documentRepository.ManageAsync(new UpdateDocumentExpiryDateCmd(doc.DocumentUrlId, request.BornInCanadaDocument.ExpiryDate), ct);
            }
        }
        if (request.AdditionalGovIdDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.AdditionalGovIdDocument.DocumentResponses)
            {
                await _documentRepository.ManageAsync(new UpdateDocumentExpiryDateCmd(doc.DocumentUrlId, request.AdditionalGovIdDocument.ExpiryDate), ct);
            }
        }
    }

    private async Task RemoveDeletedDocumentsAsync(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        if (request.LicenceAppId == null) { return; }
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(request.LicenceAppId), ct);
        List<Guid> allValidDocGuids = new List<Guid>();
        if (request.AdditionalGovIdDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.AdditionalGovIdDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.BornInCanadaDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.BornInCanadaDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.FingerPrintProofDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.FingerPrintProofDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.IdPhotoDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.IdPhotoDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.MentalHealthDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.MentalHealthDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.PoliceOfficerDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.PoliceOfficerDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        {
            foreach (Document d in category.Documents)
            {
                allValidDocGuids.AddRange(d.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
            }
        }
        var shouldDeleteDocs = existingDocs.Items.Where(i => !allValidDocGuids.Contains(i.DocumentUrlId)).ToList();
        foreach (DocumentResp doc in shouldDeleteDocs)
        {
            await _documentRepository.ManageAsync(new RemoveDocumentCmd(doc.DocumentUrlId), ct);
        }
    }

    private async Task GetDocumentsAsync(Guid LicenceAppId, WorkerLicenceResponse result, CancellationToken ct)
    {
        var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(LicenceAppId), ct);
        var letterOfNoConflicts = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.LetterOfNoConflict).ToList();
        if (letterOfNoConflicts.Any())
        {
            result.PoliceOfficerDocument = new PoliceOfficerDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(letterOfNoConflicts)
            };
        }
        var mentalHealths = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.MentalHealthConditionForm).ToList();
        if (mentalHealths.Any())
        {
            result.MentalHealthDocument = new MentalHealthDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.MentalHealthCondition,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(mentalHealths)
            };
        }
        var fingerprints = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.ConfirmationOfFingerprints).ToList();
        if (fingerprints.Any())
        {
            result.FingerPrintProofDocument = new FingerprintProofDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(fingerprints)
            };
        }

        var bornInCanadas = existingDocs.Items.Where(d =>
            d.DocumentType == DocumentTypeEnum.BirthCertificate ||
            d.DocumentType == DocumentTypeEnum.Passport ||
            d.DocumentType == DocumentTypeEnum.CanadianNativeStatusCard).ToList();
        //todo: add more documentType condition here when we get the DocumentTypeEnum sorted out.
        if (bornInCanadas.Any())
        {
            result.BornInCanadaDocument = new BornInCanadaDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)bornInCanadas[0].DocumentType),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(bornInCanadas),
                ExpiryDate = bornInCanadas[0].ExpiryDate
            };
        }

        var govIdDocs = existingDocs.Items.Where(d =>
            d.DocumentType == DocumentTypeEnum.DriverLicense ||
            d.DocumentType == DocumentTypeEnum.CanadianFirearmsLicense ||
            d.DocumentType == DocumentTypeEnum.BCServicesCard ||
            d.DocumentType == DocumentTypeEnum.CanadianNativeStatusCard ||
            d.DocumentType == DocumentTypeEnum.GovtIssuedPhotoID).ToList();
        if (govIdDocs.Any())
        {
            result.AdditionalGovIdDocument = new AdditionalGovIdDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)govIdDocs.First().DocumentType),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(govIdDocs),
                ExpiryDate = govIdDocs[0].ExpiryDate
            };
        }

        var idPhoto = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.Photograph).ToList();
        if (idPhoto.Any())
        {
            result.IdPhotoDocument = new IdPhotoDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(idPhoto)
            };
        }
    }

    private DocumentTypeEnum GetDocumentTypeEnum(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        var keyExisted = LicenceDocumentDictionary.TryGetValue(licenceDocumentTypeCode, out DocumentTypeEnum docTypeEnum);
        if (!keyExisted)
        {
            throw new ArgumentException("Invalid licenceDocumentTypeCode");
        };
        return docTypeEnum;
    }

    private LicenceDocumentTypeCode GetlicenceDocumentTypeCode(DocumentTypeEnum documentType)
    {
        return LicenceDocumentDictionary.FirstOrDefault(d => d.Value == documentType).Key;
    }

    private static readonly ImmutableDictionary<LicenceDocumentTypeCode, DocumentTypeEnum> LicenceDocumentDictionary = new Dictionary<LicenceDocumentTypeCode, DocumentTypeEnum>()
    {
        {LicenceDocumentTypeCode.BcServicesCard, DocumentTypeEnum.BCServicesCard},
        {LicenceDocumentTypeCode.BirthCertificate, DocumentTypeEnum.BirthCertificate},
        {LicenceDocumentTypeCode.CanadianCitizenship, DocumentTypeEnum.CanadianCitizenship},
        {LicenceDocumentTypeCode.CanadianPassport, DocumentTypeEnum.Passport},
        {LicenceDocumentTypeCode.CertificateOfIndianStatus, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthConditionForm},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.PermanentResidenceCard},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.LetterOfNoConflict},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.ConfirmationOfFingerprints},
        //{LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.}, //todo: find which to map
        //{LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.c}, //todo: find which to map
        //{LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.LegalWorkStatus}, //todo: find which to map
        //{LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.},//todo: find which to map
        //{LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.}//todo: find which to map
    }.ToImmutableDictionary();

}
