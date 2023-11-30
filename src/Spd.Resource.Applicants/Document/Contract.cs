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
        public string? FileExtension { get; set; }
        public DocumentTypeEnum? DocumentType { get; set; } = null;
        public DocumentTypeEnum? DocumentType2 { get; set; } = null;
        public DateTimeOffset UploadedDateTime { get; set; }
        public Guid DocumentUrlId { get; set; }
        public Guid? ClearanceId { get; set; } = null;
        public Guid? ApplicationId { get; set; } = null;
        public Guid? CaseId { get; set; } = null;
        public Guid? ReportId { get; set; } = null;
        public DateOnly? ExpiryDate { get; set; } = null;
    }

    public abstract record DocumentCmd;

    public record CreateDocumentCmd : DocumentCmd
    {
        public SpdTempFile TempFile { get; set; }
        public Guid ApplicationId { get; set; }
        public Guid? SubmittedByApplicantId { get; set; }
        public DocumentTypeEnum? DocumentType { get; set; } //tag1
        public DocumentTypeEnum? DocumentType2 { get; set; } //tag2
    }

    public record RemoveDocumentCmd(Guid DocumentUrlId) : DocumentCmd;
    public record ReactivateDocumentCmd(Guid DocumentUrlId) : DocumentCmd;
    public record UpdateDocumentCmd(Guid DocumentUrlId, DateOnly? ExpiryDate = null, DocumentTypeEnum? Tag1 = null, DocumentTypeEnum? Tag2 = null) : DocumentCmd;
    public enum DocumentTypeEnum
    {
        AdditionalGovIdDocument,
        ApplicantConsentForm,
        ApplicantInformation,
        ApprovedLocksmithCourse,
        ArmouredCarGuard,
        ArmouredVehiclePurpose,
        ArmouredVehicleRationale,
        AuthorizationToCarryCertificate,
        BCCompaniesRegistrationVerification,
        BCServicesCard,
        BirthCertificate,
        BodyArmourPurpose,
        BodyArmourRationale,
        BusinessInsurance,
        BasicSecurityTrainingCertificate,
        BasicSecurityTrainingCourseEquivalent,
        CanadianCitizenship,
        CanadianFirearmsLicence,
        CanadianNativeStatusCard,
        CertificateOfAdvancedSecurityTraining,
        CertificateOfQualification,
        CitizenshipDocument,
        ClearanceLetter,
        ConfirmationLetterFromSuperiorOfficer,
        ConfirmationOfFingerprints,
        ConfirmationOfPermanentResidenceDocument,
        CourseCertificate,
        ConvictedOffence,
        CriminalCharges,
        DriverLicense,
        ExperienceAndApprenticeship,
        ExperienceAndCourses,
        ExperienceLetters,
        ExperienceOrTrainingEquivalent,
        FingerprintProofDocument,
        FingerprintsPkg,
        FireInvestigator,
        GovtIssuedPhotoID,
        IdPhotoDocument,
        KnowledgeAndExperience,
        LegalNameChange,
        LegalWorkStatus,
        LetterOfNoConflict,
        Locksmith,
        ManualPaymentForm,
        MentalHealthDocument,
        MentalHealthConditionForm,
        PaymentReceipt,
        Passport,
        PermanentResidenceCard,
        PoliceOfficerDocument,
        PoliceExperienceOrTraining,
        Photograph,
        PrivateInvestigator,
        PrivateInvestigatorUnderSupervision,
        PrivateSecurityTrainingNetworkCompletion,
        RecommendationLetters,
        SecurityAlarmInstaller,
        SecurityConsultant,
        SecurityGuard,
        StatutoryDeclaration,
        StatutoryDeclarationPkg,
        StudyPermit,
        TenYearsPoliceExperienceAndTraining,
        TradesQualificationCertificate,
        Training,
        TrainingRecognizedCourse,
        TrainingOtherCoursesOrKnowledge,
        ValidationCertificate,
        VerificationLetter,
        OpportunityToRespond,
        OtherCourseCompletion,
        WorkPermit,
        RecordOfLandingDocument,
        DogCertificate,
        ASTCertificate,
        UseForceEmployerLetter,
        UseForceEmployerLetterASTEquivalent,
    }
}