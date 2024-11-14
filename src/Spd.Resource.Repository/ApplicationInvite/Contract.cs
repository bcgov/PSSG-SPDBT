namespace Spd.Resource.Repository.ApplicationInvite
{
    public interface IApplicationInviteRepository
    {
        public Task<ApplicationInviteListResp> QueryAsync(ApplicationInviteQuery query, CancellationToken cancellationToken);
        public Task ManageAsync(ApplicationInviteCmd query, CancellationToken cancellationToken);
        public Task<AppInviteVerifyResp> VerifyApplicationInvitesAsync(ApplicationInviteVerifyCmd createInviteCmd, CancellationToken cancellationToken);
    }

    public record ApplicationInviteQuery
    {
        public AppInviteFilterBy? FilterBy { get; set; }
        public AppInviteSortBy? SortBy { get; set; }
        public Paging Paging { get; set; } = null!;
    }
    public interface ApplicationInviteCmd { };

    public record AppInviteFilterBy(Guid? OrgId,
        string? EmailOrNameContains,
        Guid? ParentOrgId = null, //used for PSSO
        Guid? AppInviteId = null,
        Guid? CreatedByUserId = null);
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
        public ApplicationInviteStatusEnum Status { get; set; }
        public string? ErrorMsg { get; set; }
        public bool? Viewed { get; set; }
        public Guid? CreatedByUserId { get; set; }
    }

    public record ApplicationInvitesCreateCmd : ApplicationInviteCmd
    {
        public Guid OrgId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public IEnumerable<ApplicationInvite> ApplicationInvites { get; set; } = Array.Empty<ApplicationInvite>();
        public string HostUrl { get; set; } = null!;
    }

    public record ApplicationInviteVerifyCmd(string InviteEncryptedCode);

    public record AppInviteVerifyResp()
    {
        public Guid AppInviteId { get; set; }
        public Guid OrgId { get; set; }
        public string? OrgName { get; set; }
        public string? OrgPhoneNumber { get; set; }
        public string? OrgEmail { get; set; }
        public string? OrgAddressLine1 { get; set; }
        public string? OrgAddressLine2 { get; set; }
        public string? OrgCity { get; set; }
        public string? OrgCountry { get; set; }
        public string? OrgPostalCode { get; set; }
        public string? OrgProvince { get; set; }
        public EmployeeInteractionTypeCode WorksWith { get; set; }
        public string? EmployeeOrganizationTypeCode { get; set; }
        public string? VolunteerOrganizationTypeCode { get; set; }
        public string? GivenName { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode PayeeType { get; set; }
        public ScreenTypeEnum ScreeningType { get; set; } = ScreenTypeEnum.Staff;
        public ServiceTypeEnum ServiceType { get; set; } = ServiceTypeEnum.CRRP_EMPLOYEE;
    };

    public record ApplicationInvite
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? JobTitle { get; set; }
        public PayerPreferenceTypeCode? PayeeType { get; set; }
        public ServiceTypeEnum ServiceType { get; set; }
        public ScreenTypeEnum ScreeningType { get; set; }
        public Guid? OriginalClearanceAccessId { get; set; }
        public Guid? OrgId { get; set; }
    }

    public record ApplicationInviteUpdateCmd : ApplicationInviteCmd
    {
        public Guid OrgId { get; set; }
        public Guid ApplicationInviteId { get; set; }
        public ApplicationInviteStatusEnum ApplicationInviteStatusEnum { get; set; }
    }

    public record ApplicationInviteCreateResp
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public enum ScreenTypeEnum
    {
        Staff,
        Contractor,
        Licensee
    }


}
