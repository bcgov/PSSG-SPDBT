namespace Spd.Resource.Repository.PortalUser
{
    public interface IPortalUserRepository
    {
        public Task<PortalUserListResp> QueryAsync(PortalUserQry qry, CancellationToken cancellationToken);
        public Task<PortalUserResp> ManageAsync(PortalUserCmd cmd, CancellationToken cancellationToken);
    }

    public record PortalUserListResp
    {
        public IEnumerable<PortalUserResp> Items { get; set; } = Array.Empty<PortalUserResp>();
    }

    public record PortalUserResp
    {
        public Guid Id { get; set; }
        public Guid? OrganizationId { get; set; }
        public Guid? IdentityId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserEmail { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? IsPSA { get; set; }
        public ContactRoleCode? ContactRoleCode { get; set; }
        public bool? IsFirstTimeLogin { get; set; }
    }

    public record PortalUserQry
    {
        public Guid? OrgIdOrParentOrgId { get; set; } = null;
        public Guid? OrgId { get; set; }
        public Guid? ParentOrgId { get; set; } = null;
        public Guid? IdentityId { get; set; }
        public string? UserEmail { get; set; }
        public bool IncludeInactive { get; set; } = false;
        public PortalUserServiceCategoryEnum? PortalUserServiceCategory { get; set; }
        public ContactRoleCode? ContactRoleCode { get; set; }
    };

    public abstract record PortalUserCmd
    {
        public string? EmailAddress { get; set; }
        public Guid? IdentityId { get; set; }
        public ContactRoleCode? ContactRoleCode { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public Guid? OrgId { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    };
    public record UpdatePortalUserCmd : PortalUserCmd
    {
        public Guid Id { get; set; }
        public DateTimeOffset? TermAgreeTime { get; set; }
    };
    public record CreatePortalUserCmd : PortalUserCmd
    {
        public PortalUserServiceCategoryEnum? PortalUserServiceCategory { get; set; }
    };

}
