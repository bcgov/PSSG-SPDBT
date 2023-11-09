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
                DocumentTypeEnum tag1 = DocumentTypeEnum.CitizenshipDocument; //indicate which screen in fe
                DocumentTypeEnum tag2 = GetDocumentTypeEnum(request.CitizenshipDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, request.CitizenshipDocument.ExpiryDate, tag1, tag2), ct);
            }
        }
        //govid
        if (request.AdditionalGovIdDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.AdditionalGovIdDocument.DocumentResponses)
            {
                DocumentTypeEnum tag1 = DocumentTypeEnum.AdditionalGovIdDocument;
                DocumentTypeEnum tag2 = GetDocumentTypeEnum(request.AdditionalGovIdDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, request.AdditionalGovIdDocument.ExpiryDate, tag1, tag2), ct);
            }
        }
        //policy officer
        if (request.PoliceOfficerDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.PoliceOfficerDocument.DocumentResponses)
            {
                DocumentTypeEnum tag1 = DocumentTypeEnum.PoliceOfficerDocument;
                DocumentTypeEnum tag = GetDocumentTypeEnum(request.PoliceOfficerDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, null, tag), ct);
            }
        }
        //mental health
        if (request.MentalHealthDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.MentalHealthDocument.DocumentResponses)
            {
                DocumentTypeEnum tag1 = DocumentTypeEnum.MentalHealthDocument;
                DocumentTypeEnum tag2 = GetDocumentTypeEnum(request.MentalHealthDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, tag1, tag2), ct);
            }
        }
        //fingerproof
        if (request.FingerprintProofDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.FingerprintProofDocument.DocumentResponses)
            {
                DocumentTypeEnum tag1 = DocumentTypeEnum.FingerprintProofDocument;
                DocumentTypeEnum tag2 = GetDocumentTypeEnum(request.FingerprintProofDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, tag1, tag2), ct);
            }
        }
        //id photo
        if (request.IdPhotoDocument != null)
        {
            foreach (LicenceAppDocumentResponse doc in request.IdPhotoDocument.DocumentResponses)
            {
                DocumentTypeEnum tag1 = DocumentTypeEnum.IdPhotoDocument;
                DocumentTypeEnum tag2 = GetDocumentTypeEnum(request.IdPhotoDocument.LicenceDocumentTypeCode);
                await _documentRepository.ManageAsync(new UpdateDocumentCmd(doc.DocumentUrlId, null, tag1, tag2), ct);
            }
        }
        //category
        foreach (WorkerLicenceAppCategoryData category in request.CategoryData)
        {
            if (category.Documents != null)
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
        var policeDocs = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.PoliceOfficerDocument).ToList();
        if (policeDocs.Any())
        {
            result.PoliceOfficerDocument = new PoliceOfficerDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)policeDocs[0].DocumentType2),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(policeDocs)
            };
        }
        var mentalHealths = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.MentalHealthDocument).ToList();
        if (mentalHealths.Any())
        {
            result.MentalHealthDocument = new MentalHealthDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)mentalHealths[0].DocumentType2),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(mentalHealths)
            };
        }
        var fingerprints = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.FingerprintProofDocument).ToList();
        if (fingerprints.Any())
        {
            result.FingerprintProofDocument = new FingerprintProofDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(fingerprints)
            };
        }

        var bornInCanadas = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.CitizenshipDocument).ToList();
        if (bornInCanadas.Any())
        {
            result.CitizenshipDocument = new CitizenshipDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)bornInCanadas[0].DocumentType2),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(bornInCanadas),
                ExpiryDate = bornInCanadas[0].ExpiryDate
            };
        }

        var govIdDocs = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.AdditionalGovIdDocument).ToList();
        if (govIdDocs.Any())
        {
            result.AdditionalGovIdDocument = new AdditionalGovIdDocument
            {
                LicenceDocumentTypeCode = GetlicenceDocumentTypeCode((DocumentTypeEnum)govIdDocs.First().DocumentType),
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(govIdDocs),
                ExpiryDate = govIdDocs[0].ExpiryDate
            };
        }

        var idPhoto = existingDocs.Items.Where(d => d.DocumentType == DocumentTypeEnum.IdPhotoDocument).ToList();
        if (idPhoto.Any())
        {
            result.IdPhotoDocument = new IdPhotoDocument
            {
                LicenceDocumentTypeCode = LicenceDocumentTypeCode.PhotoOfYourself,
                DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(idPhoto)
            };
        }

        List<WorkerCategoryTypeCode> categoryContainFiles = new List<WorkerCategoryTypeCode>() {
            WorkerCategoryTypeCode.ArmouredCarGuard,
            WorkerCategoryTypeCode.FireInvestigator,
            WorkerCategoryTypeCode.Locksmith,
            WorkerCategoryTypeCode.PrivateInvestigator,
            WorkerCategoryTypeCode.SecurityAlarmInstaller,
            WorkerCategoryTypeCode.SecurityConsultant,
            WorkerCategoryTypeCode.SecurityGuard
        };
        if (result.CategoryData != null)
        {
            foreach (var categoryData in result.CategoryData)
            {
                if (categoryContainFiles.Contains(categoryData.WorkerCategoryTypeCode))
                {
                    var docType = Enum.Parse<DocumentTypeEnum>(categoryData.WorkerCategoryTypeCode.ToString());
                    var catFiles = existingDocs.Items.Where(d => d.DocumentType == docType).ToList();
                    List<DocumentTypeEnum?> docType2s = catFiles.Select(f => f.DocumentType2).Distinct().ToList();
                    List<Document> docs = new List<Document>();
                    foreach (var type in docType2s)
                    {
                        Document d = new Document();
                        LicenceDocumentTypeCode code = Enum.Parse<LicenceDocumentTypeCode>("Category" + docType.ToString() + "_" + type.ToString());
                        d.LicenceDocumentTypeCode = code;
                        d.DocumentResponses = _mapper.Map<List<LicenceAppDocumentResponse>>(catFiles.Where(c => c.DocumentType2 == type).ToList());
                        d.ExpiryDate = catFiles.Where(c => c.DocumentType2 == type).First().ExpiryDate;
                        docs.Add(d);
                    }
                    categoryData.Documents = docs.ToArray();
                }
            }
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
        {LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate, DocumentTypeEnum.AuthorizationToCarryCertificate},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_CourseCertificate, DocumentTypeEnum.CourseCertificate},
        {LicenceDocumentTypeCode.CategoryLocksmith_CertificateOfQualification, DocumentTypeEnum.CertificateOfQualification},
        {LicenceDocumentTypeCode.CategoryLocksmith_ExperienceAndApprenticeship, DocumentTypeEnum.ExperienceAndApprenticeship},
        {LicenceDocumentTypeCode.CategoryLocksmith_ApprovedLocksmithCourse, DocumentTypeEnum.ApprovedLocksmithCourse},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_ExperienceAndCourses, DocumentTypeEnum.ExperienceAndCourses},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining, DocumentTypeEnum.TenYearsPoliceExperienceAndTraining},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_KnowledgeAndExperience, DocumentTypeEnum.KnowledgeAndExperience},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingRecognizedCourse, DocumentTypeEnum.TrainingRecognizedCourse},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge, DocumentTypeEnum.TrainingOtherCoursesOrKnowledge},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion, DocumentTypeEnum.PrivateSecurityTrainingNetworkCompletion},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion, DocumentTypeEnum.OtherCourseCompletion},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_Training, DocumentTypeEnum.Training},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_TradesQualificationCertificate, DocumentTypeEnum.TradesQualificationCertificate},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent, DocumentTypeEnum.ExperienceOrTrainingEquivalent},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_ExperienceLetters, DocumentTypeEnum.ExperienceLetters},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_RecommendationLetters, DocumentTypeEnum.RecommendationLetters},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCertificate, DocumentTypeEnum.BasicSecurityTrainingCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_PoliceExperienceOrTraining, DocumentTypeEnum.PoliceExperienceOrTraining},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent, DocumentTypeEnum.BasicSecurityTrainingCourseEquivalent},
    }.ToImmutableDictionary();

}
