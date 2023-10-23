using MediatR;
using Microsoft.AspNetCore.Http;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Cases.Licence
{
    public interface ILicenceManager
    {
        public Task<WorkerLicenceCreateResponse> Handle(WorkerLicenceCreateCommand command, CancellationToken ct);
    }

    public record WorkerLicenceCreateCommand(WorkerLicenceCreateRequest LicenceCreateRequest, string BcscGuid) : IRequest<WorkerLicenceCreateResponse>;

    public class WorkerLicenceCreateRequest
    {
        public Guid? LicenceId { get; set; }
        public LicenceTypeData? LicenceTypeData { get; set; }
        public ApplicationTypeData? ApplicationTypeData { get; set; }
        public SoleProprietorData? SoleProprietorData { get; set; }
        public PersonalInformationData? PersonalInformationData { get; set; }
        public ExpiredLicenceData? ExpiredLicenceData { get; set; }
        public DogsAuthorizationData? DogsAuthorizationData { get; set; } = null;
        public RestraintsAuthorizationData? RestraintsAuthorizationData { get; set; } = null;
        public LicenceTermData? licenceTermData { get; set; } = null;
        public PoliceBackgroundData? PoliceBackgroundData { get; set; }
        public MentalHealthConditionsData? MentalHealthConditionsData { get; set; }
        public CriminalHistoryData? CriminalHistoryData { get; set; }
        public ProofOfFingerprintData? ProofOfFingerprintData { get; set; }
        public AliasesData? AliasesData { get; set; }
        public CitizenshipData? CitizenshipData { get; set; }
        public GovIssuedIdData? GovIssuedIdData { get; set; }
        public BcDriversLicenceData? BcDriversLicenceData { get; set; }
        public CharacteristicsData? CharacteristicsData { get; set; }
        public PhotographOfYourselfData? PhotographOfYourselfData { get; set; }
        public ContactInformationData? ContactInformationData { get; set; }
        public ResidentialAddressData? ResidentialAddressData { get; set; }
        public MailingAddressData? MailingAddressData { get; set; }
        public WorkerLicenceCategoryData[] CategoriesData { get; set; }
    }
    public class WorkerLicenceCreateResponse
    {
        public Guid LicenceId { get; set; }
    }

    public record LicenceTypeData(WorkerLicenceTypeCode WorkerLicenceTypeCode);
    public record ApplicationTypeData(ApplicationTypeCode ApplicationTypeCode);
    public record SoleProprietorData(bool isSoleProprietor);
    public record ExpiredLicenceData
    {
        public string? ExpiredLicenceNumber { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool? HasExpiredLicence { get; set; }
    };
    public record PersonalInformationData
    {
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public GenderCode? GenderCode { get; set; }
        public bool? OneLegalName { get; set; }
    }
    public record DogsAuthorizationData
    {
        public bool? UseDogs { get; set; }
        public bool? IsDogsPurposeProtection { get; set; }
        public bool? IsDogsPurposeDetectionDrugs { get; set; }
        public bool? IsDogsPurposeDetectionExplosives { get; set; }
        public Documents? Documents { get; set; }
    }
    public record RestraintsAuthorizationData
    {
        public bool? CarryAndUseRetraints { get; set; }
        public Documents? Documents { get; set; }

    }
    public record LicenceTermData(LicenceTermCode LicenceTermCode) { };
    public record PoliceBackgroundData
    {
        public bool IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public Documents? Documents { get; set; }
    }
    public record MentalHealthConditionsData
    {
        public bool? IsTreatedForMHC { get; set; }
        public Documents? Documents { get; set; }
    }
    public record CriminalHistoryData(bool? HasCriminalHistory) { };
    public record ProofOfFingerprintData
    {
        public Documents? Documents { get; set; }
    }
    public record AliasesData
    {
        public bool HasPreviousName { get; set; }
        public Alias[]? Aliases { get; set; }
    }
    public record CitizenshipData
    {
        public bool IsBornInCanada { get; set; }
        public Documents Documents { get; set; }
    }
    public record GovIssuedIdData
    {
        public Documents Documents { get; set; }
    }
    public record BcDriversLicenceData
    {
        public bool? HasBcDriversLicence { get; set; }
        public string? BcDriversLicenceNumber { get; set; }
    }
    public record CharacteristicsData
    {
        public HairColourCode? HairColourCode { get; set; }
        public EyeColourCode? EyeColourCode { get; set; }
        public int Height { get; set; }
        public HeightUnitCode HeightUnitCode { get; set; }
        public int Weight { get; set; }
        public WeightUnitCode WeightUnitCode { get; set; }
    }
    public record PhotographOfYourselfData
    {
        public bool? UseBcServicesCardPhoto { get; set; }
        public Documents Documents { get; set; }
    }
    public record ContactInformationData
    {
        public string? ContactEmailAddress { get; set; }
        public string? ContactPhoneNumber { get; set; }
    }
    public record ResidentialAddressData() : AddressData
    {
        public bool IsMailingTheSameAsResidential { get; set; }
    }
    public record MailingAddressData() : AddressData;

    public abstract record AddressData
    {
        public bool AddressSelected { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? Province { get; set; }
    }

    public record WorkerLicenceCategoryData
    {
        public SwlCategoryTypeCode SwlCategoryTypeCode { get; set; }
        public Documents[]? Documents { get; set; } = null;
    }

    public record Documents
    {
        public DocumentTypeCode DocumentTypeCode { get; set; }
        public IFormFile[] Attachments { get; set; } = Array.Empty<IFormFile>();
        public DateTimeOffset? ExpiredDate { get; set; }
    }

    public record Alias
    {
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
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

    public enum DocumentTypeCode
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
    public enum LicenceTermCode
    {
        NintyDays,
        OneYear,
        TwoYears,
        ThreeYears,
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

    public enum SwlCategoryTypeCode
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
}
