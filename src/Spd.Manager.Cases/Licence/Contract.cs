using MediatR;
using Microsoft.AspNetCore.Http;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Cases.Licence
{
    public interface ILicenceManager
    {
        public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
        public Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
        public Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct);
    }

    public record WorkerLicenceUpsertCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null) : IRequest<WorkerLicenceAppUpsertResponse>;
    public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceResponse>;

    #region base data model
    public abstract record WorkerLicenceApp
    {
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
        public int? Height { get; set; }
        public HeightUnitCode? HeightUnitCode { get; set; }
        public int? Weight { get; set; }
        public WeightUnitCode? WeightUnitCode { get; set; }
        public string? ContactEmailAddress { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public bool? IsMailingTheSameAsResidential { get; set; }
        public ResidentialAddress? ResidentialAddressData { get; set; }
        public MailingAddress? MailingAddressData { get; set; }
        public bool? IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public bool? IsTreatedForMHC { get; set; }
        public bool? UseBcServicesCardPhoto { get; set; }
        public bool? CarryAndUseRetraints { get; set; }
        public bool? IsBornInCanada { get; set; }
        public WorkerLicenceAppCategoryData[] CategoryData { get; set; } = Array.Empty<WorkerLicenceAppCategoryData>();
        public PoliceOfficerDocument? PoliceOfficerDocument { get; set; }
        public MentalHealthDocument? MentalHealthDocument { get; set; }
        public FingerprintProofDocument? FingerPrintProofDocument { get; set; }
        public BornInCanadaDocument? BornInCanadaDocument { get; set; }
        public AdditionalGovIdDocument? AdditionalGovIdDocument { get; set; }
        public IdPhotoDocument? IdPhotoDocument { get; set; }
    }
    public record WorkerLicenceAppCategoryData
    {
        public WorkerCategoryTypeCode WorkerCategoryTypeCode { get; set; }
        public Document[]? Documents { get; set; } = null; 
    }
    public record Document
    {
        //public IList<IFormFile> NewDocuments { get; set; } //for anonymous user
        public IList<LicenceAppDocumentResponse> DocumentResponses { get; set; } //for authenticated user
        public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
    }

    public record PoliceOfficerDocument : Document;
    public record MentalHealthDocument : Document;
    public record FingerprintProofDocument : Document;
    public record BornInCanadaDocument : Document
    {
        public DateOnly? ExpiryDate { get; set; }
    };
    public record AdditionalGovIdDocument : Document
    {
        public DateOnly? ExpiryDate { get; set; }
    };
    public record IdPhotoDocument : Document;
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
    public record Alias
    {
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
    }

    public record WorkerLicenceResponse : WorkerLicenceApp
    {
        public Guid LicenceAppId { get; set; }
    }
    #endregion

    #region authenticated user
    public record WorkerLicenceAppUpsertRequest : WorkerLicenceApp
    {
        public Guid? LicenceAppId { get; set; }
    };

    //public record DogsAuthorizationUpsertRequest
    //{
    //    public Guid LicenceAppId { get; set; }
    //    public bool? UseDogs { get; set; }
    //    public bool? IsDogsPurposeProtection { get; set; }
    //    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    //    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    //    //public Documents? Documents { get; set; }
    //}
    public record WorkerLicenceAppUpsertResponse
    {
        public Guid LicenceAppId { get; set; }
    }

    #endregion

    #region anonymous user
    public record WorkerLicenceAppCreateRequest : WorkerLicenceApp; //for anonymous user
    public record WorkerLicenceCreateResponse
    {
        public Guid LicenceAppId { get; set; }
    }

    #endregion

    #region file upload
    public record CreateLicenceAppDocumentCommand(LicenceAppDocumentUploadRequest Request, string? BcscId, Guid AppId) : IRequest<IEnumerable<LicenceAppDocumentResponse>>;

    public record LicenceAppDocumentUploadRequest(
        IList<IFormFile> Documents,
        LicenceDocumentTypeCode LicenceDocumentTypeCode
    );
    public record LicenceAppDocumentResponse
    {
        public Guid DocumentUrlId { get; set; }
        public DateTimeOffset UploadedDateTime { get; set; }
        public Guid? LicenceAppId { get; set; } = null;
        public string? DocumentName { get; set; }
    };

    #endregion

    #region shared enums
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
    #endregion
}
