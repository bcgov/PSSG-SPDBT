using AutoMapper;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;
using Spd.Utilities.Shared.ResourceContracts;
using System.Collections.Immutable;

namespace Spd.Manager.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        //CreateMap<WorkerLicenceAppUpsertRequest, SaveLicenceApplicationCmd>()
        //    .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => s.CategoryData));
        CreateMap<WorkerLicenceAppAnonymousSubmitRequestJson, CreateLicenceApplicationCmd>()
            .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));
        CreateMap<LicenceApplicationCmdResp, WorkerLicenceAppUpsertResponse>();
        CreateMap<LicenceApplicationResp, WorkerLicenceResponse>();
        CreateMap<LicenceResp, LicenceResponse>();
        CreateMap<LicenceFeeResp, LicenceFeeResponse>();
        CreateMap<DocumentResp, LicenceAppDocumentResponse>()
             .ForMember(d => d.DocumentExtension, opt => opt.MapFrom(s => s.FileExtension))
             .ForMember(d => d.DocumentName, opt => opt.MapFrom(s => s.FileName))
             .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.ApplicationId));
        CreateMap<DocumentResp, Document>()
             .IncludeBase<DocumentResp, LicenceAppDocumentResponse>()
             .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.ExpiryDate))
             .ForMember(d => d.LicenceDocumentTypeCode, opt => opt.MapFrom(s => GetlicenceDocumentTypeCode(s.DocumentType2)));
        CreateMap<Address, Addr>()
            .ReverseMap();
        CreateMap<ResidentialAddress, ResidentialAddr>()
            .IncludeBase<Address, Addr>()
            .ReverseMap();
        CreateMap<MailingAddress, MailingAddr>()
            .IncludeBase<Address, Addr>()
            .ReverseMap();
        CreateMap<UploadFileRequest, CreateDocumentCmd>()
            .ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType1Enum(s.FileTypeCode)))
            .ForMember(d => d.DocumentType2, opt => opt.MapFrom(s => GetDocumentType2Enum(s.FileTypeCode)));
        CreateMap<LicAppFileInfo, CreateDocumentCmd>()
            .ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType1Enum(s.LicenceDocumentTypeCode)))
            .ForMember(d => d.DocumentType2, opt => opt.MapFrom(s => GetDocumentType2Enum(s.LicenceDocumentTypeCode)));
        CreateMap<Alias, Spd.Utilities.Shared.ResourceContracts.Alias>()
            .ReverseMap();
        CreateMap<LicenceAppListResp, WorkerLicenceAppListResponse>();
        CreateMap<WorkerLicenceAppAnonymousSubmitRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));
        CreateMap<WorkerLicenceAppAnonymousSubmitRequestJson, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));
        CreateMap<UploadFileRequest, SpdTempFile>()
            .ForMember(d => d.TempFilePath, opt => opt.MapFrom(s => s.FilePath));
        CreateMap<LicAppFileInfo, SpdTempFile>();
    }

    private WorkerLicenceAppCategory[] GetCategories(WorkerCategoryTypeCode[] codes)
    {
        List<WorkerLicenceAppCategory> categories = new List<WorkerLicenceAppCategory> { };
        foreach (WorkerCategoryTypeCode code in codes)
        {
            categories.Add(new WorkerLicenceAppCategory() { WorkerCategoryTypeCode = Enum.Parse<WorkerCategoryTypeEnum>(code.ToString()) });
        }
        return categories.ToArray();
    }

    internal static DocumentTypeEnum GetDocumentType2Enum(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        var keyExisted = LicenceDocumentType2Dictionary.TryGetValue(licenceDocumentTypeCode, out DocumentTypeEnum docTypeEnum);
        if (!keyExisted)
        {
            throw new ArgumentException("Invalid licenceDocumentTypeCode");
        }
        return docTypeEnum;
    }

    internal static DocumentTypeEnum GetDocumentType1Enum(LicenceDocumentTypeCode licenceDocumentTypeCode)
    {
        var keyExisted = LicenceDocumentType1Dictionary.TryGetValue(licenceDocumentTypeCode, out DocumentTypeEnum docTypeEnum);
        if (!keyExisted)
        {
            throw new ArgumentException("Invalid licenceDocumentTypeCode");
        }
        return docTypeEnum;
    }

    private static LicenceDocumentTypeCode? GetlicenceDocumentTypeCode(DocumentTypeEnum? documentType)
    {
        if (documentType == null) return null;
        return LicenceDocumentType2Dictionary.FirstOrDefault(d => d.Value == documentType).Key;
    }

    private static readonly ImmutableDictionary<LicenceDocumentTypeCode, DocumentTypeEnum> LicenceDocumentType1Dictionary = new Dictionary<LicenceDocumentTypeCode, DocumentTypeEnum>()
    {
        {LicenceDocumentTypeCode.BcServicesCard, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.BirthCertificate, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.CanadianCitizenship, DocumentTypeEnum.CanadianCitizenship},
        {LicenceDocumentTypeCode.CanadianFirearmsLicence, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.CanadianPassport, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate, DocumentTypeEnum.ArmouredCarGuard},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_CourseCertificate, DocumentTypeEnum.FireInvestigator},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_VerificationLetter, DocumentTypeEnum.FireInvestigator},
        {LicenceDocumentTypeCode.CategoryLocksmith_CertificateOfQualification, DocumentTypeEnum.Locksmith},
        {LicenceDocumentTypeCode.CategoryLocksmith_ExperienceAndApprenticeship, DocumentTypeEnum.Locksmith},
        {LicenceDocumentTypeCode.CategoryLocksmith_ApprovedLocksmithCourse, DocumentTypeEnum.Locksmith},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_ExperienceAndCourses, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_KnowledgeAndExperience, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingRecognizedCourse, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge, DocumentTypeEnum.PrivateInvestigator},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion, DocumentTypeEnum.PrivateInvestigatorUnderSupervision},
        {LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion, DocumentTypeEnum.PrivateInvestigatorUnderSupervision},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_TradesQualificationCertificate, DocumentTypeEnum.SecurityAlarmInstaller},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent, DocumentTypeEnum.SecurityAlarmInstaller},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_ExperienceLetters, DocumentTypeEnum.SecurityConsultant},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_RecommendationLetters, DocumentTypeEnum.SecurityConsultant},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_Resume, DocumentTypeEnum.SecurityConsultant},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCertificate, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_PoliceExperienceOrTraining, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_DogCertificate, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_ASTCertificate, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetter, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetterASTEquivalent, DocumentTypeEnum.SecurityGuard},
        {LicenceDocumentTypeCode.CertificateOfIndianStatus, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.CitizenshipDocument },
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.GovernmentIssuedPhotoId, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthDocument},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.IdPhotoDocument},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.PoliceOfficerDocument},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.FingerprintProofDocument},
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.CitizenshipDocument},
    }.ToImmutableDictionary();


    private static readonly ImmutableDictionary<LicenceDocumentTypeCode, DocumentTypeEnum> LicenceDocumentType2Dictionary = new Dictionary<LicenceDocumentTypeCode, DocumentTypeEnum>()
    {
        {LicenceDocumentTypeCode.BcServicesCard, DocumentTypeEnum.BCServicesCard},
        {LicenceDocumentTypeCode.BirthCertificate, DocumentTypeEnum.BirthCertificate},
        {LicenceDocumentTypeCode.CanadianCitizenship, DocumentTypeEnum.CanadianCitizenship},
        {LicenceDocumentTypeCode.CanadianFirearmsLicence, DocumentTypeEnum.CanadianFirearmsLicence},
        {LicenceDocumentTypeCode.CanadianPassport, DocumentTypeEnum.Passport},
        {LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate, DocumentTypeEnum.AuthorizationToCarryCertificate},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_CourseCertificate, DocumentTypeEnum.CourseCertificate},
        {LicenceDocumentTypeCode.CategoryFireInvestigator_VerificationLetter, DocumentTypeEnum.VerificationLetter},
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
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_TradesQualificationCertificate, DocumentTypeEnum.TradesQualificationCertificate},
        {LicenceDocumentTypeCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent, DocumentTypeEnum.ExperienceOrTrainingEquivalent},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_ExperienceLetters, DocumentTypeEnum.ExperienceLetters},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_RecommendationLetters, DocumentTypeEnum.RecommendationLetters},
        {LicenceDocumentTypeCode.CategorySecurityConsultant_Resume, DocumentTypeEnum.Resume},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCertificate, DocumentTypeEnum.BasicSecurityTrainingCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_PoliceExperienceOrTraining, DocumentTypeEnum.PoliceExperienceOrTraining},
        {LicenceDocumentTypeCode.CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent, DocumentTypeEnum.BasicSecurityTrainingCourseEquivalent},
        {LicenceDocumentTypeCode.CategorySecurityGuard_DogCertificate, DocumentTypeEnum.DogCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_ASTCertificate, DocumentTypeEnum.ASTCertificate},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetter, DocumentTypeEnum.UseForceEmployerLetter},
        {LicenceDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetterASTEquivalent, DocumentTypeEnum.UseForceEmployerLetterASTEquivalent},
        {LicenceDocumentTypeCode.CertificateOfIndianStatus, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.ConfirmationOfPermanentResidenceDocument},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.LegalWorkStatus },
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.GovernmentIssuedPhotoId, DocumentTypeEnum.GovtIssuedPhotoID},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthConditionForm},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.PermanentResidenceCard},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.Photograph},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.LetterOfNoConflict},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.ConfirmationOfFingerprints},
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.RecordOfLandingDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.WorkPermit},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.StudyPermit},
    }.ToImmutableDictionary();
}
