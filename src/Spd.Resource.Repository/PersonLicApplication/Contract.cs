using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.LicApp;

namespace Spd.Resource.Repository.PersonLicApplication;

public partial interface IPersonLicApplicationRepository
{
    public Task<LicenceApplicationCmdResp> CreateLicenceApplicationAsync(CreateLicenceApplicationCmd cmd, CancellationToken ct);

    public Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct);

    public Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct);

    public Task<LicenceApplicationCmdResp> UpdateSwlSoleProprietorApplicationAsync(Guid swlAppId, Guid bizLicAppId, CancellationToken ct);
}

public record LicenceApplication
{
    public WorkerLicenceType WorkerLicenceTypeCode { get; set; }
    public ApplicationType ApplicationTypeCode { get; set; }
    public BizType? BizTypeCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public Gender? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public LicenceTerm? LicenceTermCode { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
    public bool? UseDogs { get; set; }
    public IEnumerable<AliasResp> Aliases { get; set; } = [];
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public HairColour? HairColourCode { get; set; }
    public EyeColour? EyeColourCode { get; set; }
    public int? Height { get; set; }
    public HeightUnit? HeightUnitCode { get; set; }
    public int? Weight { get; set; }
    public WeightUnit? WeightUnitCode { get; set; }
    public string? ContactEmailAddress { get; set; }
    public string? ContactPhoneNumber { get; set; }
    public bool? IsMailingTheSameAsResidential { get; set; }
    public ResidentialAddr? ResidentialAddressData { get; set; }
    public MailingAddr? MailingAddressData { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRole? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public bool? CarryAndUseRestraints { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<WorkerCategoryType> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryType>();
    public bool? IsCanadianCitizen { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? HasLegalNameChanged { get; set; }
    public IEnumerable<PermitPurpose>? PermitPurposeEnums { get; set; }
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public Addr? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public bool? IsCanadianResident { get; set; }
    public string? CriminalChargeDescription { get; set; }
    public IEnumerable<UploadedDocument>? UploadedDocumentEnums { get; set; }
}

public record SaveLicenceApplicationCmd() : LicenceApplication
{
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
};

public record CreateLicenceApplicationCmd() : LicenceApplication
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set; }
    public Guid? OriginalLicenceId { get; set; }
};

public record LicenceApplicationResp() : LicenceApplication
{
    public Guid? LicenceAppId { get; set; }
    public Guid? ContactId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; }
    public string? CaseNumber { get; set; }
    public LicenceTerm? OriginalLicenceTermCode { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public Guid? SoleProprietorBizAppId { get; set; } //this is for sole-proprietor biz application id for combo app
};

public record GetLicenceApplicationQry(Guid LicenceApplicationId);

public enum WorkerLicenceType
{
    SecurityWorkerLicence,
    ArmouredVehiclePermit,
    BodyArmourPermit,
    SecurityBusinessLicence,
    SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC
}

public enum HairColour
{
    Black,
    Blonde,
    Brown,
    Red,
    Grey,
    Bald,
}

public enum EyeColour
{
    Blue,
    Brown,
    Black,
    Green,
    Hazel,
}

public enum HeightUnit
{
    Centimeters,
    Inches,
}

public enum WeightUnit
{
    Kilograms,
    Pounds,
}

public enum WorkerCategoryType
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

public enum PermitPurpose
{
    ProtectionOfPersonalProperty, //armoured vehicle
    ProtectionOfOtherProperty, //armoured vehicle
    ProtectionOfAnotherPerson, //armoured vehicle
    PersonalProtection, //ba
    MyEmployment, //av, ba
    OutdoorRecreation, //ba
    TravelInResponseToInternationalConflict, //ba
    Other //av,ba
}

public enum UploadedDocument
{
    Fingerprint,
    StudyPermit,
    WorkPermit
}