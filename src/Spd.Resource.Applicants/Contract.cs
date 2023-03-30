namespace Spd.Resource.Applicants
{
    public interface IApplicationRepository
    {
        public Task<bool> AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken);
        Task<bool> CheckInviteDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken);
    }

    public record ApplicationInviteCreateCmd
    {
        public Guid OrgSpdId { get; set; }
        public IEnumerable<ApplicationInviteCreateReq> ApplicationInviteCreateReqs { get; set; }
    }

    public record ApplicationInviteCreateReq
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public bool OrgPay { get; set; }
    }

    public record ApplicationInviteCreateResp
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public record SearchInvitationQry
    {
        public Guid OrgSpdId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }

}
