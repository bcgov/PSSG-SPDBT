using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface IBizLicAppManager
{
    public Task<BizLicAppResponse> Handle(GetBizLicAppQuery query, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand command, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppSubmitCommand command, CancellationToken ct);
}

public record BizLicAppUpsertCommand(BizLicAppUpsertRequest BizLicAppUpsertRequest) : IRequest<Guid>;
public record BizLicAppSubmitCommand(BizLicAppUpsertRequest BizLicAppUpsertRequest) : IRequest<Guid>;
public record BizLicAppCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};
public record GetBizLicAppQuery(Guid LicenceApplicationId) : IRequest<BizLicAppResponse>;

public record BizLicAppResponse : BizLicenceApp
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();

}
public abstract record BizLicenceApp
{
    // Licence info
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }

    // Expired licence info
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }                        // For new application type
    public DateOnly? ExpiryDate { get; set; }

    // Business info
    public SecurityWorkerInfo? SecurityWorkerInfo { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }

    public IEnumerable<Document>? DocumentInfos { get; set; }           // Contains branding, insurance, registrar, security dog certificate and BC report documents

    // Licence category
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
    public PrivateInvestigatorInfo? PrivateInvestigatorInfo { get; set; }
    public bool? UseDogs { get; set; }

    // Licence term
    public LicenceTermCode? LicenceTermCode { get; set; }

    // Business manager info
    public BusinessManagerInfo? BusinessManagerInfo { get; set; }
    public BusinessManagerInfo? OtherContactInfo { get; set; }

    // Controlling member
    public IEnumerable<SwlControllerMemberInfo> SwlControllerMemberInfos { get; set; } = Enumerable.Empty<SwlControllerMemberInfo>();
    public IEnumerable<NonSwlControllerMemberInfo> NonSwlControllerMemberInfos { get; set; } = Enumerable.Empty<NonSwlControllerMemberInfo>();

    // Employees
    public IEnumerable<Employee> Employees { get; set; } = Enumerable.Empty<Employee>();
}

public record SecurityWorkerInfo : PersonalInfo
{
    public string? LicenceNumber { get; set; }                          // Security worker licence number
    public bool? IsLicenceValid { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
}

public record PrivateInvestigatorInfo : PersonalInfo
{
    public string? ManagerLicenceNumber { get; set; }
}

public record BusinessManagerInfo : PersonalInfo
{
    public bool? IsBusinessManager { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
}

public record PersonalInfo
{
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
}

public record SwlControllerMemberInfo : PersonalInfo
{
    public string? SecurityWorkerLicenceNumber { get; set; }
}

public record NonSwlControllerMemberInfo : PersonalInfo
{
    public string? EmailAddress { set; get; }
}

public record Employee : PersonalInfo
{
    public Guid? EmployeeContactId { get; set; }
}

public record BizLicAppUpsertRequest : BizLicenceApp
{

}
