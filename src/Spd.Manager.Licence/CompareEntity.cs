using Spd.Resource.Repository;
using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Manager.Licence;
public record SecureWorkerLicenceAppCompareEntity
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? EmailAddress { get; set; }
    public string? PhoneNumber { get; set; }
    public GenderEnum? GenderCode { get; set; }
    public string? BirthPlace { get; set; }
    public HairColourEnum? HairColourCode { get; set; }
    public EyeColourEnum? EyeColourCode { get; set; }
    public int? Height { get; set; }
    public HeightUnitEnum? HeightUnitCode { get; set; }
    public int? Weight { get; set; }
    public WeightUnitEnum? WeightUnitCode { get; set; }
    public ResidentialAddr? ResidentialAddress { get; set; }
    public MailingAddr? MailingAddress { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public ServiceTypeEnum? ServiceTypeCode { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
    public WorkerCategoryTypeEnum[] CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeEnum>();

    //swl
    public bool UseDogs { get; set; }
    public bool IsDogsPurposeProtection { get; set; }
    public bool IsDogsPurposeDetectionDrugs { get; set; }
    public bool IsDogsPurposeDetectionExplosives { get; set; }
    public bool CarryAndUseRestraints { get; set; }
}

public record PermitCompareEntity
{
    //permit
    public bool? HasCriminalHistory { get; set; }
    public string? CriminalChargeDescription { get; set; }
    public string? Rationale { get; set; }
    public string? PermitOtherRequiredReason { get; set; }
    public PermitPurposeEnum[] PermitPurposeEnums { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public Address? EmployerPrimaryAddress { get; set; }
}

public record BizLicenceAppCompareEntity
{
    public WorkerCategoryTypeEnum[] CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeEnum>();
    public bool? UseDogs { get; set; } //has value if SecurityGuard is selected
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
}
