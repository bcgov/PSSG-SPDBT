using Microsoft.AspNetCore.Http;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Cases.Licence
{
    public interface ILicenceManager
    {

    }

    public class WorkerLicenceCreateRequest
    {
        public WorkerLicenceTypeCode WorkerLicenceTypeCode { get; set; }
        public AppTypeCode AppTypeCode { get; set; }
        public bool IsSoleProprietor { get; set; } = false;
        public PersonalInfo PersonalInfo { get; set; }
        public bool HasExpiredLicence { get; set; } = false;
        public string ExpiredLicenceNumber { get; set; }
        public DateOnly ExpiredLicenceExpiryDate { get; set; }
        public DogsOrRestraintsInfo? DogOrRestraintsInfo { get; set; } = null;
        public WorkerLicenceTermCode? WorkerLicenceTermCode { get; set; } = null;
        public BackgroundInfo? BackgroundInfo { get; set; }
        public MentalHealthInfo? MentalHealthInfo { get; set; }
        public bool? HasCriminalHistory { get; set; }
    }

    public class WorkerLicenceCreateResponse
    { }

    public record PersonalInfo
    {
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public GenderCode? GenderCode { get; set; }
        public bool? OneLegalName { get; set; }
    }

    public record DogsOrRestraintsInfo
    {
        public bool UseDogsOrRestraints { get; set; }
        public DogsPurposeCode[] DogsPurposeCodes { get; set; } = Array.Empty<DogsPurposeCode>();
        public DogsPurposeDocumentTypeCode? DogsPurposeDocumentTypeCode { get; set; }
        public IFormFile[] DogsPurposeAttachments { get; set; } = Array.Empty<IFormFile>();
        public bool UseRestraints { get; set; }
        public RestraintDocumentCode? RestraintDocumentCode { get; set; }
        public IFormFile[] RestraintsAttachments { get; set; } = Array.Empty<IFormFile>();
    }

    public record BackgroundInfo
    {
        public bool IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
        public string? SpecifiedOtherRole { get; set; }
        public IFormFile[] LetterOfNoConflictAttachments { get; set; } = Array.Empty<IFormFile>();
    }

    public record MentalHealthInfo
    {
        public bool? IsTreatedForMentalHealth { get; set; }
        public IFormFile[] MentalHealthAttachments { get; set; } = Array.Empty<IFormFile>();
    }

    public enum WorkerLicenceTypeCode
    {
        SecurityWorkerLicence,
        ArmouredVehiclePermit,
        BodyArmourPermit
    }

    public enum AppTypeCode
    {
        New,
        Renewal,
        Replacement,
        Update,
    }

    public enum DogsPurposeCode
    {
        Protection,
        DrugDetection,
        ExplosiveDetection,
    }

    public enum DogsPurposeDocumentTypeCode
    {
        SecurityDogValidationCertificate,
        CertificateOfAdvancedSecurityTraining,
    }

    public enum RestraintDocumentCode
    {
        AdvancedSecurityTrainingCertificate,
        UseOfForceLetter,
        TrainingEquivalent,
    }

    public enum WorkerLicenceTermCode
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
    public enum ProofOfCanadianCitizenshipCode
    {
        ValidCanadianPassport,
        BirthCertificate,
        SecureCertificateOfIndianStatus,
    }

    public enum ProofOfAbilityToWorkInCanadaCode
    {
        ValidCanadianCitizenship,
        ValidPermanentResidentCard,
        RecordOfLandingDocument,
        ConfirmationOfPermanentResidenceDocument,
        WorkPermit,
        StudyPermit,
        ValidDocumentToVerifyLegalWorkStatus,
    }
    public enum GovernmentIssuedPhotoIdCode
    {
        DriversLicence,
        CanadianFirearmsLicence,
        BcServicesCard,
        CertificateOfIndianStatus,
        ValidGovernmentIssuedPhotoId,
    }
}
