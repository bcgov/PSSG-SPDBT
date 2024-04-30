using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface IBizLicAppManager
{
    public Task<BizLicAppResponse> Handle(GetBizLicAppQuery query, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppUpsertCommand command, CancellationToken ct);
    public Task<BizLicAppCommandResponse> Handle(BizLicAppSubmitCommand command, CancellationToken ct);
}

public record BizLicAppUpsertCommand(BizLicAppUpsertRequest BizLicAppUpsertRequest) : IRequest<BizLicAppCommandResponse>;
public record BizLicAppSubmitCommand(BizLicAppUpsertRequest BizLicAppUpsertRequest) : IRequest<BizLicAppCommandResponse>;
public record GetBizLicAppQuery(Guid LicenceApplicationId) : IRequest<BizLicAppResponse>;

public record BizLicAppUpsertRequest : BizLicenceApp
{
    public Guid? LicenceAppId { get; set; }
    public Guid BizId { get; set; }
};

public record BizLicAppCommandResponse : LicenceAppUpsertResponse
{
    public decimal? Cost { get; set; }
};
public record BizLicAppResponse : BizLicenceApp
{
    public Guid LicenceAppId { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CaseNumber { get; set; } //application number
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
}

public abstract record BizLicenceApp
{
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }

    //branding
    public bool? NoBranding { get; set; } //sole proprietor has branding?

    // Contains branding, insurance, registrar, security dog certificate and BC report documents
    public IEnumerable<Document>? DocumentInfos { get; set; }
    public bool? UseDogs { get; set; } //has value if SecurityGuard is selected
    public LicenceTermCode? LicenceTermCode { get; set; } //biz licence term, only 1,2,3 year

    //sole proprietor properties
    public SwlContactInfo? SoleProprietorSwlContactInfo { get; set; } //for sole proprietor (registered or non-registered)
    public string? SoleProprietorSwlPhoneNumber { get; set; } //for sole proprietor (registered or non-registered)
    public string? SoleProprietorSwlEmailAddress { get; set; } //for sole proprietor (registered or non-registered)

    //non sole proprietor properties
    public ContactInfo? BizManagerContactInfo { get; set; }
    public ContactInfo? ApplicantContactInfo { get; set; }
    public bool? ApplicantIsBizManager { get; set; }
    public IEnumerable<SwlContactInfo> SwlControllerMemberInfos { get; set; } = Enumerable.Empty<SwlContactInfo>();
    public IEnumerable<ContactInfo> NonSwlControllerMemberInfos { get; set; } = Enumerable.Empty<ContactInfo>();
    public IEnumerable<SwlContactInfo> Employees { get; set; } = Enumerable.Empty<SwlContactInfo>();
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>(); //todo: Matrix
    public SwlContactInfo? PrivateInvestigatorSwlInfo { get; set; } //??should we just have a search, the same as controller member, what does manager mean
}

public record ContactInfo
{
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
}

public record SwlContactInfo
{
    public Guid ContactId { get; set; }
    public Guid LicenceId { get; set; }
}




