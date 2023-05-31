using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Resource.Applicants.ApplicationInvite
{
    public interface IApplicationInviteRepository
    {
        public Task AddApplicationInvitesAsync(ApplicationInvitesCreateCmd createInviteCmd, CancellationToken cancellationToken);
        public Task<ApplicationInviteListResp> QueryAsync(ApplicationInviteQuery query, CancellationToken cancellationToken);
        public Task DeleteApplicationInvitesAsync(ApplicationInviteDeleteCmd applicationInviteDeleteCmd, CancellationToken cancellationToken);
        public Task<AppInviteVerifyResp> VerifyApplicationInvitesAsync(ApplicationInviteVerifyCmd createInviteCmd, CancellationToken cancellationToken);
    }

    public record ApplicationInviteQuery
    {
        public AppInviteFilterBy? FilterBy { get; set; }
        public AppInviteSortBy? SortBy { get; set; }
        public Paging Paging { get; set; } = null!;
    }
    public record AppInviteFilterBy(Guid OrgId, string? EmailOrNameContains);
    public record AppInviteSortBy(bool? SubmittedDateDesc);
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
        public bool? Viewed { get; set; }
    }

    public record ApplicationInvitesCreateCmd
    {
        public Guid OrgId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public IEnumerable<ApplicationInvite> ApplicationInvites { get; set; } = Array.Empty<ApplicationInvite>();
        public string HostUrl { get; set; } = null!;
    }

    public record ApplicationInviteVerifyCmd(string InviteEncryptedCode);

    public record AppInviteVerifyResp()
    {
        public Guid OrgId { get; set; }
        public string? OrgName { get; set; }
        public string? OrgPhoneNumber { get; set; }
        public string? OrgEmail { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
        public EmployeeInteractionTypeCode WorksWith { get; set; }
        public string? EmployeeOrganizationTypeCode { get; set; }
        public string? VolunteerOrganizationTypeCode { get; set; }
        public string? ContactGivenName { get; set; }
        public string? ContactSurname { get; set; }
        public string? ContactEmail { get; set; }
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode PayeeType { get; set; }
        public bool? ValidCrc { get; set; }
    };

    public record ApplicationInvite
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode? PayeeType { get; set; }
    }

    public record ApplicationInviteDeleteCmd
    {
        public Guid OrgId { get; set; }
        public Guid ApplicationInviteId { get; set; }
    }

    public record ApplicationInviteCreateResp
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }


}
