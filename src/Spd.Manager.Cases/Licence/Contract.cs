using MediatR;
using Microsoft.AspNetCore.Http;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Cases.Licence
{
    public interface ILicenceManager
    {
        public Task<WorkerLicenceUpsertResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
        public Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
    }

    public record WorkerLicenceUpsertCommand(WorkerLicenceUpsertRequest LicenceUpsertRequest, string? BcscGuid = null) : IRequest<WorkerLicenceUpsertResponse>;
    public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceResponse>;


    public abstract record WorkerLicenceApplication
    {
        public Guid? LicenceApplicationId { get; set; }
        public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
        public ApplicationTypeCode? ApplicationTypeCode { get; set; }
        public bool? isSoleProprietor { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public GenderCode? GenderCode { get; set; }
        public bool? OneLegalName { get; set; }
        public string? ExpiredLicenceNumber { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool? HasExpiredLicence { get; set; }
        public LicenceTermCode? LicenceTermCode { get; set; }
        public bool? HasCriminalHistory { get; set; }
        public bool? HasPreviousName { get; set; }
        public Alias[]? Aliases { get; set; }
        public bool? HasBcDriversLicence { get; set; }
        public string? BcDriversLicenceNumber { get; set; }
        public HairColourCode? HairColourCode { get; set; }
        public EyeColourCode? EyeColourCode { get; set; }
        public int Height { get; set; }
        public HeightUnitCode? HeightUnitCode { get; set; }
        public int? Weight { get; set; }
        public WeightUnitCode? WeightUnitCode { get; set; }
        public string? ContactEmailAddress { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public bool? IsMailingTheSameAsResidential { get; set; }
        public ResidentialAddress? ResidentialAddressData { get; set; }
        public MailingAddress? MailingAddressData { get; set; }
    }
    public record WorkerLicenceUpsertRequest : WorkerLicenceApplication;

    public record WorkerLicenceCategoryUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public WorkerLicenceCategoryData[] CategoriesData { get; set; }
    }

    public record PoliceBackgroundUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public bool IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public Documents? Documents { get; set; }
    }

    public record MentalHealthUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public bool? IsTreatedForMHC { get; set; }
        public Documents? Documents { get; set; }
    }

    public record ProofOfFingerprintUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public Documents? Documents { get; set; }
    }

    public record PhotographOfYourselfUpsertRequest 
    {
        public Guid LicenceApplicationId { get; set; }
        public bool? UseBcServicesCardPhoto { get; set; }
        public Documents Documents { get; set; }
    }
    public record DogsAuthorizationUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public bool? UseDogs { get; set; }
        public bool? IsDogsPurposeProtection { get; set; }
        public bool? IsDogsPurposeDetectionDrugs { get; set; }
        public bool? IsDogsPurposeDetectionExplosives { get; set; }
        public Documents? Documents { get; set; }
    }
    public record RestraintsAuthorizationUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public bool? CarryAndUseRetraints { get; set; }
        public Documents? Documents { get; set; }

    }
    public record CitizenshipUpsertRequest
    {
        public Guid LicenceApplicationId { get; set; }
        public bool IsBornInCanada { get; set; }
        public Documents Documents { get; set; }
    }
    public record GovIssuedIdUpsertRequest 
    {
        public Guid LicenceApplicationId { get; set; }
        public Documents Documents { get; set; }
    }

    public record WorkerLicenceUpsertResponse
    {
        public Guid LicenceApplicationId { get; set; }
    }
    public record WorkerLicenceResponse : WorkerLicenceApplication;
    public record ResidentialAddress : Address;

    public record MailingAddress : Address;

    public abstract record Address
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? Province { get; set; }
    }

    public record WorkerLicenceCategoryData
    {
        public WorkerCategoryTypeCode WorkerCategoryTypeCode { get; set; }
        public Documents[]? Documents { get; set; } = null;
    }

    public record Documents
    {
        public DocumentTypeCode DocumentTypeCode { get; set; }
        public IFormFile[] Attachments { get; set; } = Array.Empty<IFormFile>();
        public DateTimeOffset? ExpiryDate { get; set; }
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
        CategoryPrivateInvestigatorUnderSupervision_Training,
        CategorySecurityAlarmInstaller_TradesQualificationCertificate,
        CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
        CategorySecurityConsultant_ExperienceLetters,
        CategorySecurityConsultant_RecommendationLetters,
        CategorySecurityGuard_BasicSecurityTrainingCertificate,
        CategorySecurityGuard_PoliceExperienceOrTraining,
        CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent,
        CertificateOfIndianStatus,
        ConfirmationOfPermanentResidenceDocument,
        DocumentToVerifyLegalWorkStatus,
        DogsSecurityDogValidationCertificate,
        DogsCertificateOfAdvancedSecurityTraining,
        DriversLicence,
        GovernmentIssuedPhotoId,
        MentalHealthCondition,
        PermanentResidentCard,
        PhotoOfYourself,
        PoliceBackgroundLetterOfNoConflict,
        ProofOfFingerprint,
        RecordOfLandingDocument,
        RestraintsAdvancedSecurityTrainingCertificate,
        RestraintsUseOfForceLetter,
        RestraintsTrainingEquivalent,
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
}
