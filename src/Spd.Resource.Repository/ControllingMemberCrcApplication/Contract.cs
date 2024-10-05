using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.ControllingMemberCrcApplication;
public partial interface IControllingMemberCrcRepository
{
    public Task<ControllingMemberCrcApplicationResp> GetCrcApplicationAsync(Guid controllingMemberApplicationId, CancellationToken ct);
    public Task<ControllingMemberCrcApplicationCmdResp> SaveControllingMemberCrcApplicationAsync(SaveControllingMemberCrcAppCmd saveCmd, CancellationToken ct);
    public Task<ControllingMemberCrcApplicationCmdResp> CreateControllingMemberCrcApplicationAsync(SaveControllingMemberCrcAppCmd createApp, CancellationToken ct);
}

public record ControllingMemberCrcApplication
{
    public ServiceTypeEnum WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
    public ApplicationOriginTypeCode? ApplicationOriginTypeCode { get; set; } = Repository.ApplicationOriginTypeCode.Portal;
    public Guid? ParentBizLicApplicationId { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public GenderEnum? GenderCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public bool? HasPreviousName { get; set; }
    public IEnumerable<AliasResp> Aliases { get; set; }
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsCanadianCitizen { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public string? CriminalHistoryDetail { get; set; }
    public bool? HasBankruptcyHistory { get; set; }
    public string? BankruptcyHistoryDetail { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public ResidentialAddr? ResidentialAddressData { get; set; }
    public IEnumerable<UploadedDocumentEnum>? UploadedDocumentEnums { get; set; }
    public Guid BizContactId { get; set; }
}
public record CreateControllingMemberCrcAppCmd() : ControllingMemberCrcApplication
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
};
public record SaveControllingMemberCrcAppCmd() : ControllingMemberCrcApplication
{
    public Guid? ControllingMemberAppId { get; set; }
    public Guid ContactId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public bool IsPartialSaving { get; set; }
}
public record ControllingMemberCrcApplicationResp() : ControllingMemberCrcApplication
{
    public string? CaseNumber { get; set; }
    public Guid? ControllingMemberAppId { get; set; }
    public Guid? ContactId { get; set; }
    public Guid? OrganizationId { get; set; }
}
public record ControllingMemberCrcApplicationCmdResp(Guid ControllingMemberAppId, Guid? ContactId = null);