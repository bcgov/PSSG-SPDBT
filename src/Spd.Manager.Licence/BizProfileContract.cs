using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Licence;

public interface IBizProfileManager
{
    public Task<IEnumerable<BizListResponse>> Handle(GetBizsQuery query, CancellationToken ct);
    public Task<BizProfileResponse> Handle(GetBizProfileQuery query, CancellationToken ct);
    public Task<BizUserLoginResponse> Handle(BizLoginCommand cmd, CancellationToken ct); //used for biz lic portal
    public Task<Unit> Handle(BizTermAgreeCommand cmd, CancellationToken ct);
    public Task<Unit> Handle(BizProfileUpdateCommand cmd, CancellationToken ct);
}

public record GetBizProfileQuery(Guid BizId) : IRequest<BizProfileResponse>;
public record GetBizsQuery(Guid BizGuid) : IRequest<IEnumerable<BizListResponse>>;
public record BizLoginCommand(BceidIdentityInfo BceidIdentityInfo, Guid? BizId) : IRequest<BizUserLoginResponse>;
public record BizTermAgreeCommand(Guid BizId, Guid BizUserId) : IRequest<Unit>;
public record BizProfileUpdateCommand(
    Guid BizUserId,
    Guid BizId,
    BizProfileUpdateRequest BizProfileUpdateRequest)
    : IRequest<Unit>;

public record BizInfo
{
    public string? BizLegalName { get; set; }
    public string? BizTradeName { get; set; }
    public BizTypeCode? BizTypeCode { get; set; }
    public Address? BizAddress { get; set; }
    public Address? BizBCAddress { get; set; }
    public Address? MailingAddress { get; set; }
    public IEnumerable<BranchInfo>? Branches { get; set; }
    public bool? MailingAddressIsSameBizAddress { get; set; }
    public IEnumerable<ServiceTypeCode>? ServiceTypeCodes { get; set; }

}

public record BranchInfo
{
    public Guid? BranchId { get; set; }
    public Address? BranchAddress { get; set; }
    public string? BranchManager { get; set; }
    public string? BranchPhoneNumber { get; set; }
    public string? BranchEmailAddr { get; set; }
}

public record BizListResponse
{
    public Guid BizId { get; set; } //which is accountid in account
    public string? BizLegalName { get; set; }
    public string? BizName { get; set; }
    public Guid? BizGuid { get; set; }
}

public record BizProfileResponse : BizInfo
{
    public Guid BizId { get; set; } //which is accountid in account
}

public record BizUserLoginResponse
{
    public Guid BizUserId { get; set; }
    public Guid BizId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public bool? IsFirstTimeLogin { get; set; } = false;
    public ContactRoleCode ContactRoleCode { get; set; }
}

public record BizProfileUpdateRequest : BizInfo
{
    public Guid? BizId { get; set; } //used when in update, renew or replace flow.
}

public enum BizTypeCode
{
    NonRegisteredSoleProprietor,
    NonRegisteredPartnership,
    RegisteredSoleProprietor,
    RegisteredPartnership,
    Corporation,
    None
}

