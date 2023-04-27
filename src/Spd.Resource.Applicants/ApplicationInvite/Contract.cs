namespace Spd.Resource.Applicants.ApplicationInvite
{
    public interface IApplicationInviteRepository
    {
        public Task AddApplicationInvitesAsync(ApplicationInvitesCreateCmd createInviteCmd, CancellationToken cancellationToken);
        Task<bool> CheckInviteInvitationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken);
        Task<bool> CheckInviteApplicationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken);
        Task<ApplicationInviteListResp> QueryAsync(ApplicationInviteQuery query, CancellationToken cancellationToken);
    }

    public record ApplicationInviteQuery
    {
        public AppInviteFilterBy? FilterBy { get; set; }
        public AppInviteSortBy? SortBy { get; set; }
        public Paging Paging { get; set; } = null!;
    }
    public record AppInviteFilterBy(Guid OrgId, string? ApplicationStatus);
    public record AppInviteSortBy(bool? SubmittedDateDesc, bool? FirstNameDesc);
    public class ApplicationInviteListResp
    {
        public IEnumerable<ApplicationInviteResult> ApplicationInvites { get; set; } = Array.Empty<ApplicationInviteResult>();
        public PaginationResp Pagination { get; set; } = null!;
    }
    public record ApplicationInviteResult : ApplicationInvite
    {
        public Guid Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public string Status { get; set; } = null!;
        public string? ErrorMsg { get; set; }
    }

    public record ApplicationInvitesCreateCmd
    {
        public Guid OrgId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public IEnumerable<ApplicationInvite> ApplicationInvites { get; set; }
    }

    public record ApplicationInvite
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode PayeeType { get; set; }
    }

    public record ApplicationInviteCreateResp
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public record SearchInvitationQry
    {
        public Guid OrgId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
