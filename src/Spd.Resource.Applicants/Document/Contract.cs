using Spd.Resource.Applicants.Application;

namespace Spd.Resource.Applicants.Document
{
    public interface IDocumentRepository
    {
        public Task<DocumentListResp> QueryAsync(DocumentQry query, CancellationToken cancellationToken);
        public Task<DocumentResp> ManageAsync(DocumentCmd cmd, CancellationToken cancellationToken);
    }

    public record DocumentQry(
        Guid? ApplicationId = null,
        Guid? ApplicantId = null,
        Guid? ClearanceId = null,
        Guid? ReportId = null,
        Guid? CaseId = null,
        DocumentTypeEnum? FileType = null);
    public record DocumentListResp
    {
        public IEnumerable<DocumentResp> Items { get; set; } = Array.Empty<DocumentResp>();
    }

    public record DocumentResp
    {
        public string? FileName { get; set; }
        public DocumentTypeEnum? DocumentType { get; set; } = null;
        public DateTimeOffset UploadedDateTime { get; set; }
        public Guid DocumentUrlId { get; set; }
        public Guid? ClearanceId { get; set; } = null;
        public Guid? ApplicationId { get; set; } = null;
        public Guid? CaseId { get; set; } = null;
        public Guid? ReportId { get; set; } = null;
    }

    public abstract record DocumentCmd;

    public record CreateDocumentCmd : DocumentCmd
    {
        public SpdTempFile TempFile { get; set; }
        public Guid ApplicationId { get; set; }
        public Guid? SubmittedByApplicantId { get; set; }
        public DocumentTypeEnum DocumentType { get; set; }
    }

    public enum DocumentTypeEnum
    {
        ApplicantConsentForm,
        ApplicantInformation,
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
        ClearanceLetter,
        ConfirmationLetterFromSuperiorOfficer,
        ConfirmationOfFingerprints,
        FingerprintsPkg,
        ConvictedOffence,
        CriminalCharges,
        DriverLicense,
        GovtIssuedPhotoID,
        LegalNameChange,
        LegalWorkStatus,
        LetterOfNoConflict,
        Locksmith,
        ManualPaymentForm,
        MentalHealthConditionForm,
        PaymentReceipt,
        Passport,
        PermanentResidenceCard,
        Photograph,
        PrivateInvestigator,
        PrivateInvestigatorUnderSupervision,
        SecurityAlarmInstaller,
        SecurityConsultant,
        SecurityGuard,
        StatutoryDeclaration,
        StatutoryDeclarationPkg,
        ValidationCertificate,
        OpportunityToRespond,
    }
}