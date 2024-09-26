using Spd.Resource.Repository.Application;

namespace Spd.Resource.Repository.Document
{
    public interface IDocumentRepository
    {
        public Task<DocumentResp> GetAsync(Guid docUrlId, CancellationToken ct);
        public Task<DocumentListResp> QueryAsync(DocumentQry query, CancellationToken cancellationToken);
        public Task<DocumentResp> ManageAsync(DocumentCmd cmd, CancellationToken cancellationToken);
    }

    public record DocumentQry(
        Guid? ApplicationId = null,
        Guid? ApplicantId = null,
        Guid? ClearanceId = null,
        Guid? ReportId = null,
        Guid? CaseId = null,
        Guid? LicenceId = null,
        Guid? AccountId = null,
        DocumentTypeEnum? FileType = null,
        IEnumerable<DocumentTypeEnum>? MultiFileTypes = null);
    public record DocumentListResp
    {
        public IEnumerable<DocumentResp> Items { get; set; } = Array.Empty<DocumentResp>();
    }

    public record DocumentResp
    {
        public string? FileName { get; set; }
        public string? FileExtension { get; set; }
        public DocumentTypeEnum? DocumentType { get; set; }
        public DocumentTypeEnum? DocumentType2 { get; set; }
        public DateTimeOffset UploadedDateTime { get; set; }
        public Guid DocumentUrlId { get; set; }
        public Guid? ClearanceId { get; set; }
        public Guid? ApplicationId { get; set; }
        public Guid? CaseId { get; set; }
        public Guid? ReportId { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public Guid? ContactId { get; set; }
        public Guid? LicenceId { get; set; }
        public string? Folder { get; set; }
    }

    public abstract record DocumentCmd;

    public record CreateDocumentCmd : DocumentCmd
    {
        public SpdTempFile TempFile { get; set; }
        public Guid? ApplicationId { get; set; }
        public Guid? ApplicantId { get; set; }
        public Guid? TaskId { get; set; }
        public Guid? SubmittedByApplicantId { get; set; }
        public Guid? LicenceId { get; set; }
        public Guid? AccountId { get; set; }
        public DocumentTypeEnum? DocumentType { get; set; } //tag1
        public DocumentTypeEnum? DocumentType2 { get; set; } //tag2
        public DateOnly? ExpiryDate { get; set; }
        public bool ToTransientBucket { get; set; } = false;
    }

    public record CreateStreamDocumentCmd : CreateDocumentCmd
    { }

    //this is to deactivate documentUrl record and remove it from transient bucket.
    public record RemoveDocumentCmd(Guid DocumentUrlId) : DocumentCmd;
    public record ReactivateDocumentCmd(Guid DocumentUrlId) : DocumentCmd;
    public record UpdateDocumentCmd(Guid DocumentUrlId, DateOnly? ExpiryDate = null, DocumentTypeEnum? Tag1 = null, DocumentTypeEnum? Tag2 = null) : DocumentCmd;
    //copy the sourceDocument to the new application
    public record CopyDocumentCmd(Guid SourceDocumentUrlId, Guid DestApplicationId, Guid? SubmittedByApplicantId) : DocumentCmd;
    public record DeactivateDocumentCmd(Guid DocumentUrlId) : DocumentCmd;
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
        SelfDisclosure,
        SelfDisclosurePkg,
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
        Resume,
        NonCanadianPassport,
        BCID,
        CompanyBranding,
        CorporateSummary,
        CorporateRegistryDocument
    }
}