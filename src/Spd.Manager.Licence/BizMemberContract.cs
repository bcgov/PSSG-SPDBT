using MediatR;

namespace Spd.Manager.Licence;

public interface IBizMemberManager
{
    public Task<Members> Handle(GetBizMembersQuery query, CancellationToken ct);
    public Task<NonSwlContactInfo> Handle(GetNonSwlBizMemberCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(CreateBizEmployeeCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(CreateBizSwlStakeholderCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(CreateBizNonSwlStakeholderCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(UpdateBizNonSwlStakeholderCommand cmd, CancellationToken ct);
    public Task<Unit> Handle(DeleteBizMemberCommand cmd, CancellationToken ct);
    public Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct);
    public Task<StakeholderInvitesCreateResponse> Handle(BizStakeholderNewInviteCommand command, CancellationToken ct);
    public Task<StakeholderAppInviteVerifyResponse> Handle(VerifyBizStakeholderInviteCommand command, CancellationToken ct);
}

public record BizStakeholderNewInviteCommand(Guid BizContactId, Guid? UserId, string HostUrl, StakeholderAppInviteTypeCode InviteTypeCode = StakeholderAppInviteTypeCode.New) : IRequest<StakeholderInvitesCreateResponse>;
public record VerifyBizStakeholderInviteCommand(string InviteEncryptedCode) : IRequest<StakeholderAppInviteVerifyResponse>;
public record GetBizMembersQuery(Guid BizId, Guid? AppId = null) : IRequest<Members>;
public record GetNonSwlBizMemberCommand(Guid BizContactId) : IRequest<NonSwlContactInfo>;
public record UpsertBizMembersCommand(
    Guid BizId,
    Guid? ApplicationId,
    Members Members,
    IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<Unit>; //deprecated
public record CreateBizEmployeeCommand(Guid BizId, SwlContactInfo Employee) : IRequest<BizMemberResponse>;
public record CreateBizSwlStakeholderCommand(Guid BizId, SwlContactInfo SwlControllingMember, BizContactRoleCode StakeholderRole) : IRequest<BizMemberResponse>;
public record CreateBizNonSwlStakeholderCommand(Guid BizId, NonSwlContactInfo NonSwlControllingMember, BizContactRoleCode StakeholderRole) : IRequest<BizMemberResponse>;
public record UpdateBizNonSwlStakeholderCommand(Guid BizId, Guid BizContactId, NonSwlContactInfo NonSwlControllingMember, BizContactRoleCode StakeholderRole) : IRequest<BizMemberResponse>;
public record DeleteBizMemberCommand(Guid BizId, Guid BizContactId) : IRequest<Unit>;
public record BizMemberResponse(Guid? bizContactId);
public record Members
{
    public IEnumerable<SwlContactInfo> SwlControllingMembers { get; set; }
    public IEnumerable<NonSwlContactInfo> NonSwlControllingMembers { get; set; }
    public IEnumerable<SwlContactInfo> Employees { get; set; }
    public IEnumerable<SwlContactInfo> SwlBusinessManagers { get; set; }
    public IEnumerable<NonSwlContactInfo> NonSwlBusinessManagers { get; set; }
};

public record MembersRequest : Members
{
    public IEnumerable<Guid> ControllingMemberDocumentKeyCodes { get; set; } = Array.Empty<Guid>();//the document is saved in cache.
}

public record StakeholderInvitesCreateResponse(Guid BizContactId)
{
    public bool CreateSuccess { get; set; }
}
public record StakeholderAppInviteVerifyRequest(string InviteEncryptedCode);
public record StakeholderAppInviteVerifyResponse()
{
    public Guid BizContactId { get; set; }
    public Guid? BizLicAppId { get; set; }
    public Guid? ContactId { get; set; }
    public Guid BizId { get; set; }
    public Guid? ControllingMemberCrcAppId { get; set; }
    public ApplicationPortalStatusCode? ControllingMemberCrcAppPortalStatusCode { get; set; }
    public Guid InviteId { get; set; }
    public string? GivenName { get; set; }
    public string? Surname { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public StakeholderAppInviteTypeCode InviteTypeCode { get; set; }
    public string? EmailAddress { get; set; }
};

public enum StakeholderAppInviteTypeCode
{
    New,
    Update,
    CreateShellApp
}

public enum BizContactRoleCode
{
    ControllingMember,
    Employee,
    BusinessManager
}