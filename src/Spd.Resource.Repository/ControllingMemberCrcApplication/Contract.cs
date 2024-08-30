using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.PersonLicApplication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.ControllingMemberCrcApplication;
public partial interface IControllingMemberCrcRepository
{
    public Task<ControllingMemberCrcApplicationCmdResp> CreateControllingMemberCrcApplicationAsync(CreateControllingMemberCrcAppCmd cmd, CancellationToken ct);
    public Task<ControllingMemberCrcApplicationCmdResp> SaveControllingMemberCrcApplicationAsync(SaveControllingMemberCrcAppCmd saveCmd, CancellationToken ct);
}

public record ControllingMemberCrcApplication
{
    public WorkerLicenceTypeEnum WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeEnum ApplicationTypeCode { get; set; }
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
    public bool? HasPreviousNames { get; set; }
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
    //TODO: check these fields
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
    public LicenceTermEnum? LicenceTermCode { get; set; }
}
public record CreateControllingMemberCrcAppCmd() : ControllingMemberCrcApplication
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
};
public record SaveControllingMemberCrcAppCmd() : ControllingMemberCrcApplication
{
    public Guid? ControllingMemberCrcAppId { get; set; }
    public Guid ContactId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
}
public record ControllingMemberCrcApplicationResp() : ControllingMemberCrcApplication
{
    //TODO: what are response props?
    public Guid? ControllingMemberCrcAppId { get; set; }
    public Guid? ContactId { get; set; }
}
public record ControllingMemberCrcApplicationCmdResp(Guid ControllingMemberCrcAppId, Guid? ContactId = null);