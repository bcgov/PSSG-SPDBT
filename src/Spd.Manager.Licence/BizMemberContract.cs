using MediatR;

namespace Spd.Manager.Licence;

public interface IBizMemberManager
{
    public Task<Members> Handle(GetBizMembersQuery query, CancellationToken ct);
    public Task<BizMemberResponse> Handle(CreateBizEmployeeCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(CreateBizSwlControllingMemberCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(CreateBizNonSwlControllingMemberCommand cmd, CancellationToken ct);
    public Task<BizMemberResponse> Handle(UpdateBizNonSwlControllingMemberCommand cmd, CancellationToken ct);
    public Task<Unit> Handle(DeleteBizMemberCommand cmd, CancellationToken ct);
    public Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct);
    public Task<ControllingMemberInvitesCreateResponse> Handle(BizControllingMemberNewInviteCommand command, CancellationToken ct);
    public Task<ControllingMemberAppInviteVerifyResponse> Handle(VerifyBizControllingMemberInviteCommand command, CancellationToken ct);
}

public record BizControllingMemberNewInviteCommand(Guid BizContactId, Guid UserId, string HostUrl) : IRequest<ControllingMemberInvitesCreateResponse>;
public record VerifyBizControllingMemberInviteCommand(string InviteEncryptedCode) : IRequest<ControllingMemberAppInviteVerifyResponse>;
public record GetBizMembersQuery(Guid BizId, Guid? AppId = null) : IRequest<Members>;
public record UpsertBizMembersCommand(
    Guid BizId,
    Guid? ApplicationId,
    Members Members,
    IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<Unit>; //deprecated
public record CreateBizEmployeeCommand(Guid BizId, SwlContactInfo Employee) : IRequest<BizMemberResponse>;
public record CreateBizSwlControllingMemberCommand(Guid BizId, SwlContactInfo SwlControllingMember) : IRequest<BizMemberResponse>;
public record CreateBizNonSwlControllingMemberCommand(Guid BizId, NonSwlContactInfo NonSwlControllingMember) : IRequest<BizMemberResponse>;
public record UpdateBizNonSwlControllingMemberCommand(Guid BizId, Guid BizContactId, NonSwlContactInfo NonSwlControllingMember) : IRequest<BizMemberResponse>;
public record DeleteBizMemberCommand(Guid BizId, Guid BizContactId) : IRequest<Unit>;
public record BizMemberResponse(Guid? bizContactId);
public record Members
{
    public IEnumerable<SwlContactInfo> SwlControllingMembers { get; set; }
    public IEnumerable<NonSwlContactInfo> NonSwlControllingMembers { get; set; }
    public IEnumerable<SwlContactInfo> Employees { get; set; }
};

public record MembersRequest : Members
{
    public IEnumerable<Guid> ControllingMemberDocumentKeyCodes { get; set; } = Array.Empty<Guid>();//the document is saved in cache.
}

public record ControllingMemberInvitesCreateResponse(Guid BizContactId)
{
    public bool CreateSuccess { get; set; }
}
public record ControllingMemberAppInviteVerifyRequest(string InviteEncryptedCode);
public record ControllingMemberAppInviteVerifyResponse()
{
    public Guid BizContactId { get; set; }
    public Guid? BizLicAppId { get; set; }
    public Guid BizId { get; set; }
    public Guid? ControllingMemberCrcAppId { get; set; }
    public ApplicationPortalStatusCode? ControllingMemberCrcAppPortalStatusCode { get; set; }
    public Guid InviteId { get; set; }
    public string? GivenName { get; set; }
    public string? Surname { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public ControllingMemberAppInviteTypeCode Type { get; set; }
};

public enum ControllingMemberAppInviteTypeCode
{
    New,
    Update
}