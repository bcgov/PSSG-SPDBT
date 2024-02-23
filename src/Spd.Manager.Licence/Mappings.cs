using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using System.Collections.Immutable;

namespace Spd.Manager.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceAppUpsertRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));

        CreateMap<WorkerLicenceAppAnonymousSubmitRequest, CreateLicenceApplicationCmd>()
            .ForMember(d => d.IsTreatedForMHC, opt => opt.MapFrom(s => GetIsTreatedForMHC(s)))
            .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => GetHasCriminalHistory(s)))
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));

        CreateMap<PermitAppAnonymousSubmitRequest, CreateLicenceApplicationCmd>()
            .ForMember(d => d.IsTreatedForMHC, opt => opt.Ignore())
            .ForMember(d => d.HasCriminalHistory, opt => opt.MapFrom(s => GetHasCriminalHistory(s)))
            .ForMember(d => d.CategoryCodes, opt => opt.Ignore())
            .ForMember(d => d.PermitPurposeEnums, opt => opt.MapFrom(s => GetPermitPurposeEnums(s)));

        CreateMap<WorkerLicenceAppAnonymousSubmitRequest, UpdateContactCmd>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.ContactEmailAddress))
            .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.DateOfBirth))
            .ForMember(d => d.Gender, opt => opt.MapFrom(s => s.GenderCode))
            .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => s.ResidentialAddressData))
            .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => s.MailingAddressData))
            .ForMember(d => d.Aliases, opt => opt.MapFrom(s => s.Aliases));
        CreateMap<LicenceApplicationCmdResp, WorkerLicenceCommandResponse>();
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
             .ForMember(d => d.LicenceDocumentTypeCode, opt => opt.MapFrom(s => GetLicenceDocumentTypeCode(s.DocumentType2)));
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
        CreateMap<Alias, Spd.Resource.Repository.Alias>()
            .ReverseMap();
        CreateMap<LicenceAppListResp, WorkerLicenceAppListResponse>();
        CreateMap<WorkerLicenceAppAnonymousSubmitRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryCodes, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));
        CreateMap<UploadFileRequest, SpdTempFile>()
            .ForMember(d => d.TempFilePath, opt => opt.MapFrom(s => s.FilePath));
        CreateMap<LicAppFileInfo, SpdTempFile>();
        CreateMap<LicenceApplicationResp, PermitLicenceAppResponse>()
            .ForPath(d => d.EmployerPrimaryAddress.AddressLine1, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.AddressLine1))
            .ForPath(d => d.EmployerPrimaryAddress.AddressLine2, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.AddressLine2))
            .ForPath(d => d.EmployerPrimaryAddress.Province, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.Province))
            .ForPath(d => d.EmployerPrimaryAddress.City, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.City))
            .ForPath(d => d.EmployerPrimaryAddress.Country, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.Country))
            .ForPath(d => d.EmployerPrimaryAddress.PostalCode, opt => opt.MapFrom(s => s.EmployerPrimaryAddress.PostalCode))
            .ForMember(d => d.BodyArmourPermitReasonCodes, opt => opt.MapFrom(s => GetBodyArmourPermitReasonCodes(s.WorkerLicenceTypeCode, (List<PermitPurposeEnum>?)s.PermitPurposeEnums)))
            .ForMember(d => d.ArmouredVehiclePermitReasonCodes, opt => opt.MapFrom(s => GetArmouredVehiclePermitReasonCodes(s.WorkerLicenceTypeCode, (List<PermitPurposeEnum>?)s.PermitPurposeEnums)));
    }

    private static WorkerCategoryTypeEnum[] GetCategories(IEnumerable<WorkerCategoryTypeCode> codes)
    {
        List<WorkerCategoryTypeEnum> categories = new List<WorkerCategoryTypeEnum> { };
        foreach (WorkerCategoryTypeCode code in codes)
        {
            categories.Add(Enum.Parse<WorkerCategoryTypeEnum>(code.ToString()));
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

    internal static LicenceDocumentTypeCode? GetLicenceDocumentTypeCode(DocumentTypeEnum? documentType)
    {
        if (documentType == null) return null;
        return LicenceDocumentType2Dictionary.FirstOrDefault(d => d.Value == documentType).Key;
    }

    private static bool? GetIsTreatedForMHC(WorkerLicenceAppBase request)
    {
        if (request.ApplicationTypeCode == Shared.ApplicationTypeCode.Renewal || request.ApplicationTypeCode == Shared.ApplicationTypeCode.Update)
        {
            return request.HasNewMentalHealthCondition;
        }
        return request.IsTreatedForMHC;
    }

    private static bool? GetHasCriminalHistory(PersonalLicenceAppBase request)
    {
        if (request.ApplicationTypeCode == Shared.ApplicationTypeCode.Renewal || request.ApplicationTypeCode == Shared.ApplicationTypeCode.Update)
        {
            return request.HasNewCriminalRecordCharge;
        }
        return request.HasCriminalHistory;
    }

    private static IEnumerable<PermitPurposeEnum>? GetPermitPurposeEnums(PermitAppAnonymousSubmitRequest request)
    {
        if (request.BodyArmourPermitReasonCodes != null && request.WorkerLicenceTypeCode == WorkerLicenceTypeCode.BodyArmourPermit)
        {
            return request.BodyArmourPermitReasonCodes.Select(c => Enum.Parse<PermitPurposeEnum>(c.ToString())).ToArray();
        }
        if (request.ArmouredVehiclePermitReasonCodes != null && request.WorkerLicenceTypeCode == WorkerLicenceTypeCode.ArmouredVehiclePermit)
        {
            return request.ArmouredVehiclePermitReasonCodes.Select(c => Enum.Parse<PermitPurposeEnum>(c.ToString())).ToArray();
        }
        return null;
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
        {LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.CitizenshipDocument },
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.DriverLicenceAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.GovernmentIssuedPhotoId, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthDocument},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.IdPhotoDocument},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.PoliceOfficerDocument},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.FingerprintProofDocument},
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.LegalNameChange, DocumentTypeEnum.LegalNameChange},
        {LicenceDocumentTypeCode.NonCanadianPassport, DocumentTypeEnum.CitizenshipDocument},
        {LicenceDocumentTypeCode.PassportAdditional, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.BCID, DocumentTypeEnum.AdditionalGovIdDocument},
        {LicenceDocumentTypeCode.ArmouredVehicleRationale, DocumentTypeEnum.ArmouredVehicleRationale},
        {LicenceDocumentTypeCode.BodyArmourRationale, DocumentTypeEnum.BodyArmourRationale},
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
        {LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen, DocumentTypeEnum.CanadianNativeStatusCard},
        {LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument, DocumentTypeEnum.ConfirmationOfPermanentResidenceDocument},
        {LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus, DocumentTypeEnum.LegalWorkStatus },
        {LicenceDocumentTypeCode.DriversLicence, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.DriverLicenceAdditional, DocumentTypeEnum.DriverLicense},
        {LicenceDocumentTypeCode.GovernmentIssuedPhotoId, DocumentTypeEnum.GovtIssuedPhotoID},
        {LicenceDocumentTypeCode.MentalHealthCondition, DocumentTypeEnum.MentalHealthConditionForm},
        {LicenceDocumentTypeCode.PermanentResidentCard, DocumentTypeEnum.PermanentResidenceCard},
        {LicenceDocumentTypeCode.PhotoOfYourself, DocumentTypeEnum.Photograph},
        {LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict, DocumentTypeEnum.LetterOfNoConflict},
        {LicenceDocumentTypeCode.ProofOfFingerprint, DocumentTypeEnum.ConfirmationOfFingerprints},
        {LicenceDocumentTypeCode.RecordOfLandingDocument, DocumentTypeEnum.RecordOfLandingDocument},
        {LicenceDocumentTypeCode.WorkPermit, DocumentTypeEnum.WorkPermit},
        {LicenceDocumentTypeCode.StudyPermit, DocumentTypeEnum.StudyPermit},
        {LicenceDocumentTypeCode.LegalNameChange, DocumentTypeEnum.LegalNameChange},
        {LicenceDocumentTypeCode.NonCanadianPassport, DocumentTypeEnum.NonCanadianPassport},
        {LicenceDocumentTypeCode.BCID, DocumentTypeEnum.BCID},
        {LicenceDocumentTypeCode.ArmouredVehicleRationale, DocumentTypeEnum.ArmouredVehicleRationale},
        {LicenceDocumentTypeCode.BodyArmourRationale, DocumentTypeEnum.BodyArmourRationale},
        {LicenceDocumentTypeCode.PassportAdditional, DocumentTypeEnum.Passport},
    }.ToImmutableDictionary();

    private static List<BodyArmourPermitReasonCode> GetBodyArmourPermitReasonCodes(WorkerLicenceTypeEnum workerLicenceType, List<PermitPurposeEnum>? permitPurposes)
    {
        List<BodyArmourPermitReasonCode> bodyArmourPermitReasonCodes = new();

        if (workerLicenceType != WorkerLicenceTypeEnum.BodyArmourPermit || permitPurposes == null) return bodyArmourPermitReasonCodes;

        foreach (PermitPurposeEnum permitPurpose in permitPurposes)
        {
            BodyArmourPermitReasonCode bodyArmourPermitReasonCode;

            if (Enum.TryParse(permitPurpose.ToString(), out bodyArmourPermitReasonCode))
                bodyArmourPermitReasonCodes.Add(bodyArmourPermitReasonCode);
        }

        return bodyArmourPermitReasonCodes;
    }

    private static List<ArmouredVehiclePermitReasonCode> GetArmouredVehiclePermitReasonCodes(WorkerLicenceTypeEnum workerLicenceType, List<PermitPurposeEnum>? permitPurposes)
    {
        List<ArmouredVehiclePermitReasonCode> armouredVehiclePermitReasonCodes = new();

        if (workerLicenceType != WorkerLicenceTypeEnum.ArmouredVehiclePermit || permitPurposes == null) return armouredVehiclePermitReasonCodes;

        foreach (PermitPurposeEnum permitPurpose in permitPurposes)
        {
            ArmouredVehiclePermitReasonCode armouredVehiclePermitReasonCode;

            if (Enum.TryParse(permitPurpose.ToString(), out armouredVehiclePermitReasonCode))
                armouredVehiclePermitReasonCodes.Add(armouredVehiclePermitReasonCode);
        }

        return armouredVehiclePermitReasonCodes;
    }
}
