namespace Spd.Resource.Repository.ControllingMemberInvite
{
    public interface IControllingMemberInviteRepository
    {
        public Task<IEnumerable<ControllingMemberInviteResp>> QueryAsync(ControllingMemberInviteQuery query, CancellationToken cancellationToken);
        public Task ManageAsync(ControllingMemberInviteCreateCmd query, CancellationToken cancellationToken);
        public Task<ControllingMemberInviteVerifyResp> VerifyControllingMemberInvitesAsync(ControllingMemberInviteVerifyCmd createInviteCmd, CancellationToken cancellationToken);
    }

    public record ControllingMemberInviteQuery(Guid BizContactId, bool IncludeInactive = false);

    public record ControllingMemberInviteCreateCmd : ControllingMemberInvite
    {
        public string HostUrl { get; set; } = null!;
    };

    public class ControllingMemberInviteResp
    {
    }
    public record ControllingMemberInviteVerifyCmd
    {
    }

    public record ControllingMemberInviteVerifyResp
    { }

    public record ControllingMemberInvite
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public Guid? OrgId { get; set; }
        public Guid CreatedByUserId { get; set; }
    }
}
