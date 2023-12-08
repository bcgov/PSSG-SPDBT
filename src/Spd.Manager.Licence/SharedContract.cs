namespace Spd.Manager.Licence;

public class UploadFileRequest
{
    public LicenceDocumentTypeCode FileTypeCode { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public string FileExtension { get; set; }
}

public enum WorkerLicenceTypeCode
{
    SecurityWorkerLicence,
    ArmouredVehiclePermit,
    BodyArmourPermit
}

public enum ApplicationTypeCode
{
    New,
    Renewal,
    Replacement,
    Update,
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
    CategorySecurityGuard_BasicSecurityTrainingCertificate,
    CategorySecurityGuard_PoliceExperienceOrTraining,
    CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent,
    CategorySecurityGuard_DogCertificate,
    CategorySecurityGuard_ASTCertificate,
    CategorySecurityGuard_UseForceEmployerLetter,
    CategorySecurityGuard_UseForceEmployerLetterASTEquivalent,
    CertificateOfIndianStatus,
    CertificateOfIndianStatusForCitizen,
    ConfirmationOfPermanentResidenceDocument,
    DocumentToVerifyLegalWorkStatus,
    DriversLicence,
    GovernmentIssuedPhotoId,
    MentalHealthCondition,
    PermanentResidentCard,
    PhotoOfYourself,
    PoliceBackgroundLetterOfNoConflict,
    ProofOfFingerprint,
    RecordOfLandingDocument,
    StudyPermit,
    WorkPermit
}
public enum LicenceTermCode
{
    NintyDays,
    OneYear,
    TwoYears,
    ThreeYears,
    FiveYears
}

public enum BusinessTypeCode
{
    NonRegisteredSoleProprietor,
    NonRegisteredPartnership,
    RegisteredSoleProprietor,
    RegisteredPartnership,
    Corporation
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
