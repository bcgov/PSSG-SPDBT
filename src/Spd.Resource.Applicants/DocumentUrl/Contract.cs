using Spd.Resource.Applicants.Application;
using System.ComponentModel;

namespace Spd.Resource.Applicants.DocumentUrl
{
    public interface IDocumentUrlRepository
    {
        public Task<DocumentUrlListResp> QueryAsync(DocumentUrlQry query, CancellationToken cancellationToken);
        public Task<DocumentUrlResp> ManageAsync(DocumentUrlCmd cmd, CancellationToken cancellationToken);
    }

    public record DocumentUrlQry(
        Guid? ApplicationId = null,
        Guid? ApplicantId = null,
        Guid? ClearanceId = null,
        Guid? ReportId = null,
        DocumentTypeEnum? FileType = null);
    public record DocumentUrlListResp
    {
        public IEnumerable<DocumentUrlResp> Items { get; set; } = Array.Empty<DocumentUrlResp>();
    }

    public record DocumentUrlResp
    {
        public string? FileName { get;set; }
        public DocumentTypeEnum? DocumentType { get; set; } = null;
        public DateTimeOffset UploadedDateTime { get; set; }
        public Guid DocumentUrlId { get; set; }
        public Guid? ClearanceId { get; set; } = null;
        public Guid? ApplicationId { get; set; } = null;
        public Guid? ReportId { get; set; } = null;
    }

    public abstract record DocumentUrlCmd;

    public record CreateDocumentUrlCmd: DocumentUrlCmd
    {
        public SpdTempFile TempFile { get; set; }
        public Guid ApplicationId { get; set; }
        public Guid? SubmittedByApplicantId { get; set; }
        public DocumentTypeEnum DocumentType { get; set; }
    }

    public enum DocumentTypeEnum
    {
        [Description("Applicant Consent Form")]
        ApplicantConsentForm,

        [Description("Applicant Information")]
        ApplicantInformation,

        [Description("Armoured Car Guard")]
        ArmouredCarGuard,
        ArmouredVehiclePurpose,
        ArmouredVehicleRationale,
        BCCompaniesRegistrationVerification,
        BCServicesCard,
        BirthCertificate,
        BodyArmourPurpose,
        BodyArmourRationale,
        BusinessInsurance,
        CanadianCitizenship,
        CanadianFirearmsLicense,
        CanadianNativeStatusCard,
        CertificateOfAdvancedSecurityTraining,
        ConfirmationLetterFromSuperiorOfficer,
        ConfirmationOfFingerprints,
        ConvictedOffence,
        CriminalCharges,
        DriverLicense,
        GovtIssuedPhotoID,
        LegalNameChange,
        LegalWorkStatus,
        LetterOfNoConflict,
        Locksmith,
        MentalHealthConditionForm,
        Passport,
        PermanentResidenceCard,
        Photograph,
        PrivateInvestigator,
        PrivateInvestigatorUnderSupervision,
        SecurityAlarmInstaller,
        SecurityConsultant,
        SecurityGuard,

        [Description("Statutory Declaration")]
        StatutoryDeclaration,
        ValidationCertificate
    }
}
