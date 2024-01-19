using Spd.Resource.Applicants.Application;
using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Resource.Applicants.LicenceApplication;
public partial interface ILicenceApplicationRepository
{
    public Task<LicenceApplicationCmdResp> CreateLicenceApplicationAsync(CreateLicenceApplicationCmd cmd, CancellationToken ct);
    public Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct);
    public Task<LicenceApplicationCmdResp> SubmitLicenceApplicationAsync(Guid LicenceAppId, CancellationToken ct);
    public Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct);
    public Task<IEnumerable<LicenceAppListResp>> QueryAsync(LicenceAppQuery qry, CancellationToken ct);

    //connect spd_appliation with spd_contact and update application to correct status
    public Task<LicenceApplicationCmdResp> CommitLicenceApplicationAsync(Guid applicationId, ApplicationStatusEnum status, CancellationToken ct);
}

public record LicenceAppQuery(Guid ApplicantId, List<WorkerLicenceTypeEnum>? ValidWorkerLicenceTypeCodes, List<ApplicationPortalStatusEnum>? ValidPortalStatus);
public record LicenceApplicationCmdResp(Guid LicenceAppId, Guid ContactId);

public record LicenceApplication
{
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public BusinessTypeEnum? BusinessTypeCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public GenderEnum? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
    public bool? UseDogs { get; set; }
    public Alias[]? Aliases { get; set; }
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public HairColourEnum? HairColourCode { get; set; }
    public EyeColourEnum? EyeColourCode { get; set; }
    public int? Height { get; set; }
    public HeightUnitEnum? HeightUnitCode { get; set; }
    public int? Weight { get; set; }
    public WeightUnitEnum? WeightUnitCode { get; set; }
    public string? ContactEmailAddress { get; set; }
    public string? ContactPhoneNumber { get; set; }
    public bool? IsMailingTheSameAsResidential { get; set; }
    public ResidentialAddr? ResidentialAddressData { get; set; }
    public MailingAddr? MailingAddressData { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public bool? UseBcServicesCardPhoto { get; set; }
    public bool? CarryAndUseRestraints { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public WorkerLicenceAppCategory[] CategoryData { get; set; } = Array.Empty<WorkerLicenceAppCategory>();
    public bool? IsCanadianCitizen { get; set; }
    public Guid? OriginalApplicationId { get; set; } = null;
}

public record WorkerLicenceAppCategory
{
    public WorkerCategoryTypeEnum WorkerCategoryTypeCode { get; set; }
}

public record SaveLicenceApplicationCmd() : LicenceApplication
{
    public Guid? LicenceAppId { get; set; }
    public string? BcscGuid { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
};

public record CreateLicenceApplicationCmd() : LicenceApplication
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set;} = null;
};

public record LicenceApplicationResp() : LicenceApplication
{
    public Guid? LicenceAppId { get; set; }
    public Guid? ContactId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public ApplicationPortalStatusEnum? ApplicationPortalStatus { get; set; }
    public string? CaseNumber { get; set; }
};

public record LicenceAppListResp
{
    public Guid LicenceAppId { get; set; }
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? SubmittedOn { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public string CaseNumber { get; set; }
    public ApplicationPortalStatusEnum ApplicationPortalStatusCode { get; set; }
}

public record GetLicenceApplicationQry(Guid LicenceApplicationId);

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

public enum LicenceTermEnum
{
    NintyDays,
    OneYear,
    TwoYears,
    ThreeYears,
    FiveYears
}

public enum BusinessTypeEnum
{
    NonRegisteredSoleProprietor,
    NonRegisteredPartnership,
    RegisteredSoleProprietor,
    RegisteredPartnership,
    Corporation,
    None
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
