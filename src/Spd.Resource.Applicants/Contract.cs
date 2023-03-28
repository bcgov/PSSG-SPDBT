namespace Spd.Resource.Applicants
{
    public interface IApplicationRepository
    {
        public Task<IEnumerable<ApplicationInviteCreateResp>> AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken);
    }

    public record ApplicationInviteCreateCmd
    {
        public Guid OrgSpdId { get; set; }
        public IEnumerable<ApplicationInviteCreateReq> ApplicationInviteCreateReqs { get; set; }
    }

    public record ApplicationInviteCreateReq
    {
        //todo: update and add validation.
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

}
