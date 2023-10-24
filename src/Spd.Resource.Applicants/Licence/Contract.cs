using Microsoft.AspNetCore.Http;
using Spd.Resource.Applicants.Application;

namespace Spd.Resource.Applicants.Licence
{
    public interface ILicenceRepository
    {
        public Task<LicenceListResp> QueryAsync(LicenceQry query, CancellationToken cancellationToken);
        public Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken cancellationToken);
    }

    public record LicenceQry(Guid? LicenceId = null);
    public record LicenceListResp
    {
        public IEnumerable<LicenceResp> Items { get; set; } = Array.Empty<LicenceResp>();
    }

    public record LicenceResp
    {
        public Guid? LicenceId { get; set; } = null;
    }

    public abstract record LicenceCmd;

    public record CreateLicenceCmd : LicenceCmd
    {
        public Guid? LicenceId { get; set; }
        public LicenceTypeData? LicenceTypeData { get; set; }
        public ApplicationTypeData? ApplicationTypeData { get; set; }
        public SoleProprietorData? SoleProprietorData { get; set; }
        public PersonalInformationData? PersonalInformationData { get; set; }
        public ExpiredLicenceData? ExpiredLicenceData { get; set; }
        public DogsOrRestraintsData? DogsOrRestraintsData { get; set; } = null;
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

    public record LicenceTypeData(WorkerLicenceTypeEnum WorkerLicenceTypeCode);
    public record ApplicationTypeData(ApplicationTypeEnum ApplicationTypeCode);
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
    public record DogsOrRestraintsData
    {
        public bool? UseDogsOrRestraints { get; set; }
        public DogsPurposeEnum[]? DogsPurposeCodes { get; set; } = Array.Empty<DogsPurposeEnum>();
        public bool CarryAndUseRetraints { get; set; }
        public Documents[]? Documents { get; set; }

    }
    public record LicenceTermData(LicenceTermEnum LicenceTermCode) { };
    public record PoliceBackgroundData
    {
        public bool IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
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
        public ProofOfCanadianCitizenshipEnum? ProofOfCanadianCitizenshipCode { get; set; }
        public ProofOfAbilityToWorkInCanadaEnum? ProofOfAbilityToWorkInCanadaCode { get; set; } //?
        public Documents Documents { get; set; }
    }
    public record GovIssuedIdData
    {
        public GovernmentIssuedPhotoIdEnum GovernmentIssuedPhotoIdCode { get; set; }
        public Documents Documents { get; set; }
    }
    public record BcDriversLicenceData
    {
        public bool? HasBcDriversLicence { get; set; }
        public string? BcDriversLicenceNumber { get; set; }
    }
    public record CharacteristicsData
    {
        public HairColourEnum? HairColourCode { get; set; }
        public EyeColourEnum? EyeColourCode { get; set; }
        public int Height { get; set; }
        public HeightUnitEnum HeightUnitCode { get; set; }
        public int Weight { get; set; }
        public WeightUnitEnum WeightUnitCode { get; set; }
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
        public WorkerCategoryTypeEnum WorkerCategoryTypeCode { get; set; }
        public Documents[]? Documents { get; set; } = null;
        public bool? Confirmed { get; set; }
        public bool? SecurityAlarmSales { get; set; }
    }

    public record Documents
    {
        public DocumentTypeEnum DocumentTypeCode { get; set; }
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

    public enum DogsPurposeEnum
    {
        Protection,
        DrugDetection,
        ExplosiveDetection,
    }

    public enum DocumentTypeEnum
    {
        DogsSecurityDogValidationCertificate,
        DogsCertificateOfAdvancedSecurityTraining,
        RestraintsAdvancedSecurityTrainingCertificate,
        RestraintsUseOfForceLetter,
        RestraintsTrainingEquivalent,
        PoliceBackgroundLetterOfNoConflictAttachments,
        MentalHealthConditionAttachments,
        ProofOfFingerprintAttachments,
        CitizenshipDocumentPhotoAttachments,
        PhotoDriversLicence,
        PhotoCanadianFirearmsLicence,
        PhotoBcServicesCard,
        PhotoCertificateOfIndianStatus,
        PhotoValidGovernmentIssuedPhotoId,
        PhotoOfYourselfAttachments,
        CategoryBasicSecurityTraingCertificate,
        CategoryCanadianPoliceOfficerTrainingProof,
        CategoryEquivalentBasicSecurityTrainingJIBC,
        CategoryFirearmLicenceAndATCCertificate,
        CategoryTradesQualificationCertificate,
        CategoryTradesQualificationCertificateEquivalent,
        CategoryLocksmithCertificate,
        CategoryProofOfLocksmithExperienceAndApprenticeship,
        CategoryApprovedLocksmithCourse,
        CategoryPrivateInvestigatorCourseCompletionProof,
    }
    public enum LicenceTermEnum
    {
        NintyDays,
        OneYear,
        TwoYears,
        ThreeYears,
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
    public enum GovernmentIssuedPhotoIdEnum
    {
        DriversLicence,
        CanadianFirearmsLicence,
        BcServicesCard,
        CertificateOfIndianStatus,
        ValidGovernmentIssuedPhotoId,
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
}