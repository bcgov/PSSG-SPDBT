namespace Spd.Resource.Applicants
{
    public interface IScreeningRepository
    {
        public Task<IList<ScreeningInviteCreateResp>> AddScreeningInvitesAsync(ScreeningInviteCreateCmd createInviteCmd, CancellationToken cancellationToken);
    }

    public record ScreeningInviteCreateCmd
    {
        public Guid OrgSpdId { get; set; }
        public IList<ScreeningInviteCreateReq> ScreeningInviteCreateReqs { get; set; }
    }

    public record ScreeningInviteCreateReq
    {
        //todo: update and add validation.
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public bool OrgPay { get; set; }
    }

    public record ScreeningInviteCreateResp
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

}
