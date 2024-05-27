using MediatR;

namespace Spd.Manager.Licence;

public interface IBizControllingMemberEmployeeManager
{
    public Task<Members> Handle(GetBizMembersQuery query, CancellationToken ct);
    public Task<Unit> Handle(UpsertBizMembersCommand cmd, CancellationToken ct);
}


public record GetBizMembersQuery(Guid BizId, Guid ApplicationId) : IRequest<Members>;

public record Members
{
    public IEnumerable<SwlContactInfo> SwlControllingMembers { get; set; }
    public IEnumerable<ContactInfo> NonSwlControllingMembers { get; set; }
    public IEnumerable<SwlContactInfo> Employees { get; set; }
};

public record UpsertBizMembersCommand(
    Guid BizId,
    Guid ApplicationId,
    Members Members) : IRequest<Unit>;



