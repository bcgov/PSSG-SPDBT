using MediatR;

namespace Spd.Manager.Licence;

public interface IBizMemberManager
{
    public Task<Members> Handle(GetBizMembersQuery query, CancellationToken ct);
    public Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct);
    public Task<ControllingMemberInvitesCreateResponse> Handle(BizControllingMemberNewInviteCommand command, CancellationToken ct);
}

public record BizControllingMemberNewInviteCommand(Guid BizContactId, Guid UserId, string HostUrl) : IRequest<ControllingMemberInvitesCreateResponse>;

public record GetBizMembersQuery(Guid BizId, Guid? AppId = null) : IRequest<Members>;

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

public record UpsertBizMembersCommand(
    Guid BizId,
    Guid? ApplicationId,
    Members Members,
    IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<Unit>;

public record ControllingMemberInvitesCreateResponse(Guid BizContactId)
{
    public bool CreateSuccess { get; set; }
}