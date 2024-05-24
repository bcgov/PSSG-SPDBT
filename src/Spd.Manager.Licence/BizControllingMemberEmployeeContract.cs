using MediatR;

namespace Spd.Manager.Licence;

public interface IBizControllingMemberEmployeeManager
{
    public Task<ControllingMembers> Handle(GetBizControllerMembersQuery query, CancellationToken ct);
    public Task<IEnumerable<SwlContactInfo>> Handle(GetBizEmployeesQuery query, CancellationToken ct);
    public Task<Unit> Handle(UpsertBizControllerMembersCommand query, CancellationToken ct);
    public Task<Unit> Handle(UpsertEmployeesCommand query, CancellationToken ct);
}


public record GetBizControllerMembersQuery(Guid BizId, Guid ApplicationId) : IRequest<ControllingMembers>;
public record GetBizEmployeesQuery(Guid BizId, Guid ApplicationId) : IRequest<IEnumerable<SwlContactInfo>>;
public record ControllingMembers
{
    public IEnumerable<SwlContactInfo> SwlControllingMembers { get; set; }
    public IEnumerable<ContactInfo> NonSwlControllingMembers { get; set; }
};
public record UpsertBizControllerMembersCommand(
    Guid BizId,
    Guid ApplicationId,
    ControllingMembers ControllingMembers) : IRequest<Unit>;
public record UpsertEmployeesCommand(
    Guid BizId,
    Guid ApplicationId,
    IEnumerable<SwlContactInfo> Employees) : IRequest<Unit>;


