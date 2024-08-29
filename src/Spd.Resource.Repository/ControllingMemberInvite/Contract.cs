using Spd.Resource.Repository.ApplicationInvite;

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

    public record ControllingMemberInviteResp : ControllingMemberInvite
    {
        public Guid Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public ApplicationInviteStatusEnum Status { get; set; }
        public string? ErrorMsg { get; set; }
        public bool? Viewed { get; set; }
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
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Email { get; set; }
        public Guid BizId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid BizContactId { get; set; }
    }
}
