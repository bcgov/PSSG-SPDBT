namespace Spd.Resource.Repository.ControllingMemberInvite
{
    public interface IControllingMemberInviteRepository
    {
        public Task<IEnumerable<ControllingMemberInviteResp>> QueryAsync(ControllingMemberInviteQuery query, CancellationToken cancellationToken);
        public Task ManageAsync(ControllingMemberInviteCmd cmd, CancellationToken cancellationToken);
        public Task<ControllingMemberInviteVerifyResp> VerifyControllingMemberInvitesAsync(ControllingMemberInviteVerifyCmd createInviteCmd, CancellationToken cancellationToken);
    }

    public record ControllingMemberInviteQuery(Guid BizContactId, bool IncludeInactive = false);
    public interface ControllingMemberInviteCmd { };
    public record ControllingMemberInviteCreateCmd : ControllingMemberInvite, ControllingMemberInviteCmd
    {
        public string HostUrl { get; set; } = null!;
    };
    public record ControllingMemberInviteUpdateCmd : ControllingMemberInviteCmd
    {
        public Guid ControllingMemberInviteId { get; set; }
        public ApplicationInviteStatusEnum ApplicationInviteStatusEnum { get; set; }
    }

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
        public string? GivenName { get; set; }
        public string? Surname { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? EmailAddress { get; set; }
        public Guid BizId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid BizContactId { get; set; }
    }
}
