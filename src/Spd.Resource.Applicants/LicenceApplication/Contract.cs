using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Resource.Applicants.LicenceApplication;
public partial interface ILicenceApplicationRepository
{
    public Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken cancellationToken);
    public Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken cancellationToken);
    public Task<LicenceLookupResp> GetLicenceLookupAsync(string licenceNumber, CancellationToken cancellationToken);
    public Task<LicenceFeeListResp> GetLicenceFeeAsync(string licenceNumber, CancellationToken cancellationToken);
}

public record LicenceApplicationCmdResp(Guid? LicenceAppId);

public record LicenceApplication
{
    public Guid? LicenceAppId { get; set; }
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public bool isSoleProprietor { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateTimeOffset? DateOfBirth { get; set; }
    public GenderEnum? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
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
    public bool? CarryAndUseRetraints { get; set; }
    public WorkerLicenceAppCategory[] CategoryData { get; set; } = Array.Empty<WorkerLicenceAppCategory>();
    public bool? IsCanadianCitizen { get; set; }
}

public record WorkerLicenceAppCategory
{
    public WorkerCategoryTypeEnum WorkerCategoryTypeCode { get; set; }
}

public record SaveLicenceApplicationCmd() : LicenceApplication
{
    public string? BcscGuid { get; set; }
};

public record LicenceApplicationResp() : LicenceApplication
{
    public Guid? ContactId { get; set; }
};

public record GetLicenceApplicationQry(Guid LicenceApplicationId);

public record LicenceLookupResp()
{
    public string? LicenceNumber { get; set; } = null;
    public string? GivenName { get; set; }
    public string? Surname { get; set; }
    public DateTimeOffset ExpiryDate { get; set; }
}

public record LicenceFeeResp()
{
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public int? Amount { get; set; }
}

public record LicenceFeeListResp
{
    public IEnumerable<LicenceFeeResp> LicenceFees { get; set; } = Array.Empty<LicenceFeeResp>();
}

public record MailingAddr() : Addr;
public record ResidentialAddr() : Addr;
public abstract record Addr
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
