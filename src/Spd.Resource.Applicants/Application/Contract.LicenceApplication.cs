using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Resource.Applicants.Application;

public partial interface IApplicationRepository
{
    public Task<LicenceApplicationResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken cancellationToken);
}

public record LicenceApplicationResp(Guid? LicenceId);
public abstract record LicenceApplication()
{
    public Guid? LicenceId { get; set; }
}
public record SaveLicenceApplicationCmd : LicenceApplication
{
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public bool isSoleProprietor { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
    public GenderEnum? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public LicenceTermEnum LicenceTermCode { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
    public Alias[]? Aliases { get; set; }
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public HairColourEnum? HairColourCode { get; set; }
    public EyeColourEnum? EyeColourCode { get; set; }
    public int Height { get; set; }
    public HeightUnitEnum HeightUnitCode { get; set; }
    public int Weight { get; set; }
    public WeightUnitEnum WeightUnitCode { get; set; }
    public string? ContactEmailAddress { get; set; }
    public string? ContactPhoneNumber { get; set; }
    public bool IsMailingTheSameAsResidential { get; set; }
    public ResidentialAddress? ResidentialAddressData { get; set; }
    public MailingAddress? MailingAddressData { get; set; }
}


public record MailingAddress() : Address;
public record ResidentialAddress() : Address;
public abstract record Address
{
    public bool AddressSelected { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? Province { get; set; }
}

public record Alias
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
}

public enum WorkerLicenceTypeEnum
{
    SecurityWorkerLicence,
    ArmouredVehiclePermit,
    BodyArmourPermit
}

public enum ApplicationTypeEnum
{
    New,
    Renewal,
    Replacement,
    Update,
}

public enum LicenceDocumentTypeEnum
{
    DogsSecurityDogValidationCertificate,
    DogsCertificateOfAdvancedSecurityTraining,
    RestraintsAdvancedSecurityTrainingCertificate,
    RestraintsUseOfForceLetter,
    RestraintsTrainingEquivalent,
    PoliceBackgroundLetterOfNoConflict,
    MentalHealthCondition,
    ProofOfFingerprint,
    DriversLicence,
    CanadianFirearmsLicence,
    BcServicesCard,
    CertificateOfIndianStatus,
    GovernmentIssuedPhotoId,
    PhotoOfYourself,
    CanadianPassport,
    BirthCertificate,
    CanadianCitizenship,
    PermanentResidentCard,
    RecordOfLandingDocument,
    ConfirmationOfPermanentResidenceDocument,
    WorkPermit,
    StudyPermit,
    ValidDocumentToVerifyLegalWorkStatus,
    CategoryLocksmith_CertificateOfQualification,
    CategoryLocksmith_ExperienceAndApprenticeship,
    CategoryLocksmith_ApprovedLocksmithCourse,
    CategoryPrivateInvestigator_ExperienceAndCourses,
    CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining,
    CategoryPrivateInvestigator_KnowledgeAndExperience,
    CategoryPrivateInvestigator_CompleteRecognizedTrainingCourse,
    CategoryPrivateInvestigator_CompleteOtherCoursesOrKnowledge,
    CategoryPrivateInvestigator_PrivateSecurityTrainingNetworkCompletion,
    CategoryPrivateInvestigator_OtherCourseCompletion,
    CategorySecurityAlarmInstaller_TradesQualificationCertificate,
    CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
    CategorySecurityConsultant_ReferenceLetters,
    CategorySecurityConsultant_RecommendationLetters,
    CategorySecurityGuard_BasicSecurityTrainingCertificate,
    CategorySecurityGuard_PoliceExperienceOrTraining,
    CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent
}

public enum LicenceTermEnum
{
    NintyDays,
    OneYear,
    TwoYears,
    ThreeYears,
    FiveYears
}

public enum PoliceOfficerRoleEnum
{
    AuxiliaryorReserveConstable,
    SheriffDeputySheriff,
    CorrectionsOfficer,
    CourtAppointedBailiff,
    SpecialProvincialOrMunicipalConstable,
    PoliceOfficer,
    Other,
}
public enum ProofOfCanadianCitizenshipEnum
{
    ValidCanadianPassport,
    BirthCertificate,
    SecureCertificateOfIndianStatus,
}

public enum ProofOfAbilityToWorkInCanadaEnum
{
    ValidCanadianCitizenship,
    ValidPermanentResidentCard,
    RecordOfLandingDocument,
    ConfirmationOfPermanentResidenceDocument,
    WorkPermit,
    StudyPermit,
    ValidDocumentToVerifyLegalWorkStatus,
}

public enum HairColourEnum
{
    Black,
    Blonde,
    Brown,
    Red,
    Grey,
    Bald,
}

public enum EyeColourEnum
{
    Blue,
    Brown,
    Black,
    Green,
    Hazel,
}

public enum HeightUnitEnum
{
    Centimeters,
    Inches,
}

public enum WeightUnitEnum
{
    Kilograms,
    Pounds,
}

public enum WorkerCategoryTypeEnum
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

