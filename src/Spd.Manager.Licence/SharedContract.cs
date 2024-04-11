﻿using Spd.Utilities.Dynamics;

namespace Spd.Manager.Licence;

public class UploadFileRequest
{
    public LicenceDocumentTypeCode FileTypeCode { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public string FileExtension { get; set; }
    public long FileSize { get; set; }
    public string ContentType { get; set; }
}

public enum WorkerLicenceTypeCode
{
    SecurityWorkerLicence,
    ArmouredVehiclePermit,
    BodyArmourPermit,
    SecurityBusinessLicence,
    SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC
}

public enum LicenceDocumentTypeCode
{
    BcServicesCard,
    BirthCertificate,
    CanadianCitizenship,
    CanadianFirearmsLicence,
    CanadianPassport,
    CategoryArmouredCarGuard_AuthorizationToCarryCertificate,
    CategoryFireInvestigator_CourseCertificate,
    CategoryFireInvestigator_VerificationLetter,
    CategoryLocksmith_CertificateOfQualification,
    CategoryLocksmith_ExperienceAndApprenticeship,
    CategoryLocksmith_ApprovedLocksmithCourse,
    CategoryPrivateInvestigator_ExperienceAndCourses,
    CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining,
    CategoryPrivateInvestigator_KnowledgeAndExperience,
    CategoryPrivateInvestigator_TrainingRecognizedCourse,
    CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge,
    CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion,
    CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion,
    CategorySecurityAlarmInstaller_TradesQualificationCertificate,
    CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
    CategorySecurityConsultant_ExperienceLetters,
    CategorySecurityConsultant_RecommendationLetters,
    CategorySecurityConsultant_Resume,
    CategorySecurityGuard_BasicSecurityTrainingCertificate,
    CategorySecurityGuard_PoliceExperienceOrTraining,
    CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent,
    CategorySecurityGuard_DogCertificate,
    CategorySecurityGuard_ASTCertificate,
    CategorySecurityGuard_UseForceEmployerLetter,
    CategorySecurityGuard_UseForceEmployerLetterASTEquivalent,
    CertificateOfIndianStatusAdditional,
    CertificateOfIndianStatusForCitizen,
    ConfirmationOfPermanentResidenceDocument,
    DocumentToVerifyLegalWorkStatus,
    DriversLicence,
    DriversLicenceAdditional,
    GovernmentIssuedPhotoId,
    MentalHealthCondition,
    PermanentResidentCard,
    PermanentResidentCardAdditional,
    PhotoOfYourself,
    PoliceBackgroundLetterOfNoConflict,
    ProofOfFingerprint,
    RecordOfLandingDocument,
    StudyPermit,
    WorkPermit,
    LegalNameChange,
    NonCanadianPassport,
    BCID,
    ArmouredVehicleRationale,
    BodyArmourRationale,
    PassportAdditional
}

public enum BusinessTypeCode
{
    NonRegisteredSoleProprietor,
    NonRegisteredPartnership,
    RegisteredSoleProprietor,
    RegisteredPartnership,
    Corporation,
    None
}

public enum PoliceOfficerRoleCode
{
    AuxiliaryorReserveConstable,
    SheriffDeputySheriff,
    CorrectionsOfficer,
    CourtAppointedBailiff,
    SpecialProvincialOrMunicipalConstable,
    PoliceOfficer,
    Other,
}

public enum HairColourCode
{
    Black,
    Blonde,
    Brown,
    Red,
    Grey,
    Bald,
}

public enum EyeColourCode
{
    Blue,
    Brown,
    Black,
    Green,
    Hazel,
}

public enum HeightUnitCode
{
    Centimeters,
    Inches,
}

public enum WeightUnitCode
{
    Kilograms,
    Pounds,
}

public enum WorkerCategoryTypeCode
{
    ArmouredCarGuard,
    BodyArmourSales,
    ClosedCircuitTelevisionInstaller,
    ElectronicLockingDeviceInstaller,
    FireInvestigator,
    Locksmith,
    LocksmithUnderSupervision,
    PrivateInvestigator,
    PrivateInvestigatorUnderSupervision,
    SecurityGuard,
    SecurityGuardUnderSupervision,
    SecurityAlarmInstallerUnderSupervision,
    SecurityAlarmInstaller,
    SecurityAlarmMonitor,
    SecurityAlarmResponse,
    SecurityAlarmSales,
    SecurityConsultant,
}

public enum ApplicationPortalStatusCode
{
    Draft,
    VerifyIdentity,
    InProgress,
    AwaitingPayment,
    AwaitingThirdParty,
    AwaitingApplicant,
    UnderAssessment,
    Incomplete,
    CompletedCleared,
    RiskFound,
    ClosedJudicialReview,
    ClosedNoResponse,
    ClosedNoConsent,
    CancelledByApplicant,
    CancelledByOrganization
}

public record Address
{
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? Province { get; set; }
}