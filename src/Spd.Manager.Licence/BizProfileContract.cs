using MediatR;
using Spd.Utilities.LogonUser;

namespace Spd.Manager.Licence;

public interface IBizProfileManager
{
    public Task<BizProfileResponse> Handle(GetBizProfileQuery query, CancellationToken ct);

    public Task<BizUserLoginResponse> Handle(BizLoginCommand cmd, CancellationToken ct); //used for applicant portal

    public Task<Unit> Handle(BizTermAgreeCommand cmd, CancellationToken ct);

    public Task<Unit> Handle(BizProfileUpdateCommand cmd, CancellationToken ct);
}

public record GetBizProfileQuery(Guid BizId) : IRequest<BizProfileResponse>;
public record BizLoginCommand(BceidIdentityInfo BceidIdentityInfo) : IRequest<BizUserLoginResponse>;
public record BizTermAgreeCommand(Guid BizUserId) : IRequest<Unit>;
public record BizProfileUpdateCommand(
    Guid BizUserId,
    Guid BizId,
    BizProfileUpdateRequest BizProfileUpdateRequest)
    : IRequest<Unit>;

public record Biz
{
    public string? BizLegalName { get; set; }
    public string? BizTradeName { get; set; }
    public BizTypeCode? BizTypeCode { get; set; }
    public Address? BizAddress { get; set; }
    public Address? BizBCAddress { get; set; }
    public Address? MailingAddress { get; set; }
    public IEnumerable<Branch> Branches { get; set; }
    public bool? MailingAddressIsSameBizAddress { get; set; }
}

public record Branch
{
    public Guid? BranchId { get; set; }
    public Address? BranchAddress { get; set; }
    public string BranchManager { get; set; }
    public string BranchPhoneNumber { get; set; }
    public string BranchEmailAddr { get; set; }
}

public record BizProfileResponse : Biz
{
    public Guid BizId { get; set; } //which is accountid in account
}

public record BizUserLoginResponse
{
    public Guid BizUserId { get; set; }
    public Guid BizId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? EmailAddress { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public bool? IsFirstTimeLogin { get; set; } = false;
    public string? BizLegalName { get; set; }
}

public record BizProfileUpdateRequest : Biz
{
    public Guid? BizId { get; set; } //used when user is in update, renew or replace flow.
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

