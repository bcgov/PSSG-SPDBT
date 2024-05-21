using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.LicenceApplication;

namespace Spd.Resource.Repository.BizApplication;
public partial interface IBizApplicationRepository
{
    public Task<BizLicenceApplicationCmdResp> SaveBizLicenceApplicationAsync(SaveBizLicenceApplicationCmd cmd, CancellationToken ct);
}

public record BizLicenceApplicationCmdResp(Guid LicenceAppId, Guid ContactId);

public record BizLicenceApplication
{
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public BizTypeEnum? BizTypeCode { get; set; }
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
    public IEnumerable<AliasResp>? Aliases { get; set; }
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
    public bool? CarryAndUseRestraints { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<WorkerCategoryTypeEnum> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeEnum>();
    public bool? IsCanadianCitizen { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? HasLegalNameChanged { get; set; }
    public IEnumerable<PermitPurposeEnum>? PermitPurposeEnums { get; set; }
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public Addr? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public bool? IsCanadianResident { get; set; }
    public string? CriminalChargeDescription { get; set; }
    public IEnumerable<UploadedDocumentEnum>? UploadedDocumentEnums { get; set; }
}

public record SaveBizLicenceApplicationCmd() : BizLicenceApplication
{
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
}