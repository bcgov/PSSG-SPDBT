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
        DocumentTypeEnum? docEnum = null;
        if (command.Request.LicenceDocumentTypeCode != null)
            docEnum = GetDocumentTypeEnum((LicenceDocumentTypeCode)command.Request.LicenceDocumentTypeCode);
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

    private async Task UpdateDocumentsAsync(WorkerLicenceAppUpsertRequest request, CancellationToken ct)
    {
        //citizenship
        if (request.CitizenshipDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.CitizenshipDocument.DocumentResponses)
            {
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.CitizenshipDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, request.CitizenshipDocument.ExpiryDate, null, tag), ct);
            }
        }
        //govid
        if (request.AdditionalGovIdDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.AdditionalGovIdDocument.DocumentResponses)
            {
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.AdditionalGovIdDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, request.AdditionalGovIdDocument.ExpiryDate, null, tag), ct);
            }
        }
        //policy officer
        if (request.PoliceOfficerDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.PoliceOfficerDocument.DocumentResponses)
            {
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.PoliceOfficerDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, null, tag), ct);
            }
        }
        //mental health
        if (request.MentalHealthDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.MentalHealthDocument.DocumentResponses)
            {
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.MentalHealthDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, null, tag), ct);
            }
        }
        //fingerproof
        if (request.FingerprintProofDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.FingerprintProofDocument.DocumentResponses)
            {
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.FingerprintProofDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, null, tag), ct);
            }
        }
        //id photo
        if (request.FingerprintProofDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.IdPhotoDocument.DocumentResponses)
            {
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.IdPhotoDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, null, tag), ct);
            }
        }
        //category
        foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        {
            foreach (Document d in category.Documents)
            {
                foreach (var doc in d.DocumentResponses)
                {
                    (DocumentTypeEnum? tag1, DocumentTypeEnum? tag2) = GetDocumentTypeEnums(d.LicenceDocumentTypeCode);
                    await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, d.ExpiryDate, tag1, tag2), ct);
                }
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
        if (request.CitizenshipDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.CitizenshipDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
        }
        if (request.FingerprintProofDocument?.DocumentResponses.Count > 0)
        {
            allValidDocGuids.AddRange(request.FingerprintProofDocument.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
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
            if (category.Documents != null)
            {
                foreach (Document d in category.Documents)
                {
                    allValidDocGuids.AddRange(d.DocumentResponses.Select(d => d.DocumentUrlId).ToArray());
                }
            }
        }
        //mark all valid doc active.
        foreach (Guid docUrlId in allValidDocGuids)
        {
            await _documentRepository.ManageAsync(new ReactivateDocumentCmd(docUrlId), ct);
        }

        //remove all docs that need to be deleted.
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
            result.FingerprintProofDocument = new FingerprintProofDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(fingerprints)
            };
        }

        var bornInCanadas = existingDocs.Items.Where(d =>
            d.DocumentType == DocumentTypeEnum.BirthCertificate ||
            d.DocumentType == DocumentTypeEnum.Passport ||
            d.DocumentType == DocumentTypeEnum.CanadianNativeStatusCard ||
            d.DocumentType == DocumentTypeEnum.CanadianCitizenship ||
            d.DocumentType == DocumentTypeEnum.PermanentResidenceCard ||
            d.DocumentType == DocumentTypeEnum.ConfirmationOfPermanentResidenceDocument ||
            d.DocumentType == DocumentTypeEnum.RecordOfLandingDocument ||
            d.DocumentType == DocumentTypeEnum.WorkPermit ||
            d.DocumentType == DocumentTypeEnum.StudyPermit ||
            d.DocumentType == DocumentTypeEnum.LegalWorkStatus).ToList();
        if (bornInCanadas.Any())
        {
            result.CitizenshipDocument = new CitizenshipDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)bornInCanadas[0].DocumentType),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(bornInCanadas),
                ExpiryDate = bornInCanadas[0].ExpiryDate
            };
        }

        var govIdDocs = existingDocs.Items.Where(d =>
            d.DocumentType == DocumentTypeEnum.DriverLicense ||
            d.DocumentType == DocumentTypeEnum.CanadianFirearmsLicence ||
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

    private (DocumentTypeEnum?, DocumentTypeEnum?) GetDocumentTypeEnums(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        string[] strs = licenceDocumentTypeCode.ToString().Split("_");
        if (strs.Length != 2)
        {
            return (null, null);
        };
        string cat = strs[0].Replace("Category", string.Empty);
        DocumentTypeEnum documentType1 = Enum.Parse<DocumentTypeEnum>(cat);
        DocumentTypeEnum documentType2 = Enum.Parse<DocumentTypeEnum>(strs[1]);
        return (documentType1, documentType2);
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
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.RecordOfLandingDocument},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.ConfirmationOfPermanentResidenceDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.WorkPermit},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.StudyPermit},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.LegalWorkStatus},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.Photograph},
    }.ToImmutableDictionary();

}
