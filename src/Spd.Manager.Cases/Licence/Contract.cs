using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Spd.Manager.Cases.Screening;
using Spd.Utilities.Shared.Exceptions;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Cases.Licence
{
    public interface ILicenceManager
    {
        public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceUpsertCommand command, CancellationToken ct);
        public Task<WorkerLicenceAppUpsertResponse> Handle(WorkerLicenceSubmitCommand command, CancellationToken ct);
        public Task<WorkerLicenceResponse> Handle(GetWorkerLicenceQuery query, CancellationToken ct);
        public Task<IEnumerable<WorkerLicenceAppListResponse>> Handle(GetWorkerLicenceAppListQuery query, CancellationToken ct);
        public Task<IEnumerable<LicenceAppDocumentResponse>> Handle(CreateLicenceAppDocumentCommand command, CancellationToken ct);
        public Task<LicenceLookupResponse> Handle(LicenceLookupQuery query, CancellationToken ct);
        public Task<LicenceFeeListResponse> Handle(GetLicenceFeeListQuery query, CancellationToken ct);
    }

    public record WorkerLicenceUpsertCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null) : IRequest<WorkerLicenceAppUpsertResponse>;
    public record WorkerLicenceSubmitCommand(WorkerLicenceAppUpsertRequest LicenceUpsertRequest, string? BcscGuid = null)
        : WorkerLicenceUpsertCommand(LicenceUpsertRequest, BcscGuid), IRequest<WorkerLicenceAppUpsertResponse>;

    public record GetWorkerLicenceQuery(Guid LicenceApplicationId) : IRequest<WorkerLicenceResponse>;
    public record GetWorkerLicenceAppListQuery(Guid ApplicantId) : IRequest<IEnumerable<WorkerLicenceAppListResponse>>;

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
        public DateOnly? DateOfBirth { get; set; }
        public GenderCode? GenderCode { get; set; }
        public bool? OneLegalName { get; set; }
        public string? ExpiredLicenceNumber { get; set; }
        public Guid? ExpiredLicenceId { get; set; }
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
        public bool? CarryAndUseRestraints { get; set; }
        public bool? UseDogs { get; set; }
        public bool? IsDogsPurposeProtection { get; set; }
        public bool? IsDogsPurposeDetectionDrugs { get; set; }
        public bool? IsDogsPurposeDetectionExplosives { get; set; }
        public bool? IsCanadianCitizen { get; set; }
        public WorkerLicenceAppCategoryData[] CategoryData { get; set; } = Array.Empty<WorkerLicenceAppCategoryData>();
        public PoliceOfficerDocument? PoliceOfficerDocument { get; set; }
        public MentalHealthDocument? MentalHealthDocument { get; set; }
        public FingerprintProofDocument? FingerprintProofDocument { get; set; }
        public CitizenshipDocument? CitizenshipDocument { get; set; }
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
        public IList<LicenceAppDocumentResponse> DocumentResponses { get; set; } //for authenticated user
        public LicenceDocumentTypeCode LicenceDocumentTypeCode { get; set; }
        public DateOnly? ExpiryDate { get; set; }
    }

    public record PoliceOfficerDocument : Document;
    public record MentalHealthDocument : Document;
    public record FingerprintProofDocument : Document;
    public record CitizenshipDocument : Document;
    public record AdditionalGovIdDocument : Document;
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
        public DateOnly? ExpiryDate { get; set; }
        public string? CaseNumber { get; set; }
        public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    }

    public record WorkerLicenceAppListResponse
    {
        public Guid LicenceAppId { get; set; }
        public WorkerLicenceTypeCode ServiceTypeCode { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset? SubmittedOn { get; set; }
        public ApplicationTypeCode ApplicationTypeCode { get; set; }
        public string CaseNumber { get; set; }
        public ApplicationPortalStatusCode ApplicationPortalStatusCode { get; set; }
    }
    #endregion

    #region authenticated user
    public record WorkerLicenceAppUpsertRequest : WorkerLicenceApp
    {
        public Guid? LicenceAppId { get; set; }
    };

    public record WorkerLicenceAppSubmitRequest : WorkerLicenceAppUpsertRequest;

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
        public string? DocumentExtension { get; set; }
    };

    #endregion

    #region licence lookup

    public record LicenceLookupResponse
    {
        public Guid? LicenceId { get; set; } = null;
        public string? LicenceNumber { get; set; } = null;
        public DateTimeOffset ExpiryDate { get; set; }
    };

    public record LicenceLookupQuery(string LicenceNumber) : IRequest<LicenceLookupResponse>;

    #endregion

    #region licence fee

    public record LicenceFeeResponse
    {
        public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
        public BusinessTypeCode? BusinessTypeCode { get; set; }
        public ApplicationTypeCode? ApplicationTypeCode { get; set; }
        public LicenceTermCode? LicenceTermCode { get; set; }
        public int? Amount { get; set; }
    };

    public record LicenceFeeListResponse
    {
        public IEnumerable<LicenceFeeResponse> LicenceFees { get; set; } = Array.Empty<LicenceFeeResponse>();
    }

    public record GetLicenceFeeListQuery(WorkerLicenceTypeCode WorkerLicenceTypeCode) : IRequest<LicenceFeeListResponse>;

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
        CategorySecurityAlarmInstaller_TradesQualificationCertificate,
        CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
        CategorySecurityConsultant_ExperienceLetters,
        CategorySecurityConsultant_RecommendationLetters,
        CategorySecurityGuard_BasicSecurityTrainingCertificate,
        CategorySecurityGuard_PoliceExperienceOrTraining,
        CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent,
        CategorySecurityGuard_DogCertificate,
        CategorySecurityGuard_ASTCertificate,
        CategorySecurityGuard_UseForceEmployerLetter,
        CategorySecurityGuard_UseForceEmployerLetterASTEquivalent,
        CertificateOfIndianStatus,
        ConfirmationOfPermanentResidenceDocument,
        DocumentToVerifyLegalWorkStatus,
        DriversLicence,
        GovernmentIssuedPhotoId,
        MentalHealthCondition,
        PermanentResidentCard,
        PhotoOfYourself,
        PoliceBackgroundLetterOfNoConflict,
        ProofOfFingerprint,
        RecordOfLandingDocument,
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

    public enum BusinessTypeCode
    {
        NonRegisteredSoleProprietor,
        NonRegisteredPartnership,
        RegisteredSoleProprietor,
        RegisteredPartnership,
        Corporation
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

    #region validation
    public class WorkerLicenceAppSubmitRequestValidator : AbstractValidator<WorkerLicenceAppSubmitRequest>
    {
        public WorkerLicenceAppSubmitRequestValidator(IConfiguration configuration)
        {
            RuleFor(r => r.LicenceAppId).NotEmpty();
            RuleFor(r => r.WorkerLicenceTypeCode).NotEmpty();
            RuleFor(r => r.ApplicationTypeCode).NotEmpty();
            RuleFor(r => r.isSoleProprietor).NotEmpty();
            RuleFor(r => r.Surname).NotEmpty();
            RuleFor(r => r.DateOfBirth).NotEmpty();
            RuleFor(r => r.GenderCode).NotEmpty();
            RuleFor(r => r.LicenceTermCode).NotEmpty();
            RuleFor(r => r.HasExpiredLicence).NotEmpty();
            RuleFor(r => r.ExpiredLicenceNumber).NotEmpty().When(r => r.HasExpiredLicence == true);
            RuleFor(r => r.HasCriminalHistory).NotEmpty();
            RuleFor(r => r.HasBcDriversLicence).NotEmpty();
            RuleFor(r => r.HairColourCode).NotEmpty();
            RuleFor(r => r.EyeColourCode).NotEmpty();
            RuleFor(r => r.Height).NotEmpty();
            RuleFor(r => r.HeightUnitCode).NotEmpty();
            RuleFor(r => r.Weight).NotEmpty();
            RuleFor(r => r.WeightUnitCode).NotEmpty();
            RuleFor(r => r.HasCriminalHistory).NotEmpty();
            RuleFor(r => r.IsMailingTheSameAsResidential).NotEmpty();
            RuleFor(r => r.ContactPhoneNumber).MaximumLength(15).NotEmpty();
            RuleFor(r => r.ContactEmailAddress).MaximumLength(75).When(r => r.ContactEmailAddress != null);

            //police officer
            RuleFor(r => r.IsPoliceOrPeaceOfficer).NotEmpty();
            RuleFor(r => r.PoliceOfficerRoleCode).NotEmpty().When(r => r.IsPoliceOrPeaceOfficer == true);
            RuleFor(r => r.PoliceOfficerDocument).NotEmpty().When(r => r.IsPoliceOrPeaceOfficer == true);
            RuleFor(r => r.PoliceOfficerDocument.LicenceDocumentTypeCode)
                .Must(c => c == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict)
                .When(r => r.IsPoliceOrPeaceOfficer != null && r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerDocument != null);
            RuleFor(r => r.OtherOfficerRole).NotEmpty()
                .When(r => r.IsPoliceOrPeaceOfficer != null && r.IsPoliceOrPeaceOfficer == true && r.PoliceOfficerRoleCode != null && r.PoliceOfficerRoleCode == PoliceOfficerRoleCode.Other);

            //mental health
            RuleFor(r => r.IsTreatedForMHC).NotEmpty();
            RuleFor(r => r.MentalHealthDocument).NotEmpty().When(r => r.IsTreatedForMHC == true);
            RuleFor(r => r.MentalHealthDocument.LicenceDocumentTypeCode)
                .Must(c => c == LicenceDocumentTypeCode.MentalHealthCondition)
                .When(r => r.IsTreatedForMHC == true && r.MentalHealthDocument != null);

            //citizenship
            RuleFor(r => r.IsCanadianCitizen).NotEmpty();
            RuleFor(r => r.CitizenshipDocument).NotEmpty();
            RuleFor(r => r.CitizenshipDocument.LicenceDocumentTypeCode)
                .Must(c => LicenceManager.WorkProofCodes.Contains(c))
                .When(r => r.CitizenshipDocument != null && r.IsCanadianCitizen != null && r.IsCanadianCitizen == false);
            RuleFor(r => r.CitizenshipDocument.LicenceDocumentTypeCode)
                .Must(c => LicenceManager.CitizenshipProofCodes.Contains(c))
                .When(r => r.CitizenshipDocument != null && r.IsCanadianCitizen != null && r.IsCanadianCitizen == true);
            RuleFor(r => r.CitizenshipDocument.ExpiryDate)
                .NotEmpty()
                .Must(d => d > DateOnly.FromDateTime(DateTime.Now))
                .When(r => r.CitizenshipDocument != null && r.IsCanadianCitizen == false && (r.CitizenshipDocument.LicenceDocumentTypeCode == LicenceDocumentTypeCode.WorkPermit || r.CitizenshipDocument.LicenceDocumentTypeCode == LicenceDocumentTypeCode.StudyPermit));

            ////additional gov id
            RuleFor(r => r.AdditionalGovIdDocument)
                .NotEmpty()
                .When(r => r.CitizenshipDocument != null && (r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.CanadianPassport && r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.PermanentResidentCard));
            RuleFor(r => r.AdditionalGovIdDocument)
                .Must(c => LicenceManager.GovIdCodes.Contains(c.LicenceDocumentTypeCode))
                .When(r => r.AdditionalGovIdDocument != null && r.CitizenshipDocument != null && (r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.CanadianPassport && r.CitizenshipDocument.LicenceDocumentTypeCode != LicenceDocumentTypeCode.PermanentResidentCard));

            //fingerprint
            RuleFor(r => r.FingerprintProofDocument).NotEmpty();
            RuleFor(r => r.FingerprintProofDocument.LicenceDocumentTypeCode)
                .Must(c => c == LicenceDocumentTypeCode.ProofOfFingerprint)
                .When(r => r.FingerprintProofDocument != null);

            //photo
            RuleFor(r => r.UseBcServicesCardPhoto).NotEmpty();
            RuleFor(r => r.IdPhotoDocument).NotEmpty().When(r => r.UseBcServicesCardPhoto != null && r.UseBcServicesCardPhoto == false);
            RuleFor(r => r.IdPhotoDocument.LicenceDocumentTypeCode)
                .Must(c => c == LicenceDocumentTypeCode.PhotoOfYourself)
                .When(r => r.UseBcServicesCardPhoto == false && r.IdPhotoDocument != null);

            //residential address
            RuleFor(r => r.ResidentialAddressData).NotEmpty();
            RuleFor(r => r.ResidentialAddressData.Province).NotEmpty().When(r => r.ResidentialAddressData != null);
            RuleFor(r => r.ResidentialAddressData.City).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddressData != null);
            RuleFor(r => r.ResidentialAddressData.AddressLine1).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddressData != null);
            RuleFor(r => r.ResidentialAddressData.Country).NotEmpty().MaximumLength(100).When(r => r.ResidentialAddressData != null);
            RuleFor(r => r.ResidentialAddressData.PostalCode).NotEmpty().MaximumLength(20).When(r => r.ResidentialAddressData != null);

            //category
            RuleFor(r => r.CategoryData).NotEmpty().Must(d => d.Count() > 0 && d.Count() < 7);
            var invalidCategoryMatrix = configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
            if (invalidCategoryMatrix == null)
                throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");

            RuleForEach(r => r.CategoryData).SetValidator(new WorkerLicenceAppCategoryDataValidator());
            RuleFor(r => r.CategoryData).Must(c =>
            {
                foreach (var catData in c)
                {
                    var invalidCodes = invalidCategoryMatrix.GetValueOrDefault(catData.WorkerCategoryTypeCode);
                    if (invalidCodes != null)
                    {
                        foreach (var cat in c)
                        {
                            if (cat.WorkerCategoryTypeCode != catData.WorkerCategoryTypeCode)
                            {
                                if (invalidCodes.Contains(cat.WorkerCategoryTypeCode))
                                {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            })
            .When(c => c.CategoryData != null);
        }

        public class WorkerLicenceAppCategoryDataValidator : AbstractValidator<WorkerLicenceAppCategoryData>
        {
            public WorkerLicenceAppCategoryDataValidator()
            {
                RuleFor(c => c.Documents).Must(d => d.Count() >= 1
                    && d.Any(doc => LicenceManager.SecurityGuardDocCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuard);
                RuleFor(c => c.Documents).Must(d => d == null || d.Count() == 0)
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuardUnderSupervision
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityAlarmMonitor
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityAlarmResponse
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityAlarmSales
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.LocksmithUnderSupervision
                    || c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.BodyArmourSales);
                RuleFor(c => c.Documents).Must(d => d.Count() == 1
                    && d.Any(doc => (doc.LicenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryArmouredCarGuard_AuthorizationToCarryCertificate) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.ArmouredCarGuard);
                RuleFor(c => c.Documents).Must(d => d.Count() == 1
                    && d.Any(doc => LicenceManager.SecurityAlarmInstallerCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityAlarmInstaller);
                RuleFor(c => c.Documents).Must(d => d.Count() == 1
                    && d.Any(doc => LicenceManager.LockSmithCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 &&  doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.Locksmith);
                RuleFor(c => c.Documents).Must(d => d.Count() == 1
                    && d.Any(doc => LicenceManager.PrivateInvestigatorUnderSupervisionCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
                RuleFor(c => c.Documents).Must(d => d.Count() == 2
                    && d.Any(doc => LicenceManager.PrivateInvestigatorCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.PrivateInvestigator);
                RuleFor(c => c.Documents).Must(d => d.Count() == 2
                    && d.Any(doc => LicenceManager.FireInvestigatorCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.FireInvestigator);
                RuleFor(c => c.Documents).Must(d => d.Count() == 2
                    && d.Any(doc => LicenceManager.SecurityConsultantCodes.Contains(doc.LicenceDocumentTypeCode) && doc.DocumentResponses.Count() > 0 && doc.DocumentResponses.Count() <= 10))
                    .When(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityConsultant);
            }
        }
        #endregion
    }
}
