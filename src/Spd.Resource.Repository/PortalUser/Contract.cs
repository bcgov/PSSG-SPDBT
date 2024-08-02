using Spd.Resource.Repository.User;
namespace Spd.Resource.Repository.PortalUser
{
    public interface IPortalUserRepository
    {
        public Task<PortalUserQryResp> QueryAsync(PortalUserQry qry, CancellationToken cancellationToken);
        public Task<PortalUserResp> ManageAsync(PortalUserCmd cmd, CancellationToken cancellationToken);
    }
    public abstract record PortalUserQryResp;
    public record PortalUserListResp : PortalUserQryResp
    {
        public IEnumerable<PortalUserResp> Items { get; set; } = Array.Empty<PortalUserResp>();
    }

    public record PortalUserResp : PortalUserQryResp
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
        public bool? IsActive { get; set; }
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
        public IEnumerable<ContactRoleCode>? ContactRoleCode { get; set; } = Array.Empty<ContactRoleCode>();
    };
    public record PortalUserByIdQry(Guid UserId) : PortalUserQry;

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
    public record PortalUserUpdateLoginCmd(Guid Id) : PortalUserCmd;
    public record CreatePortalUserCmd : PortalUserCmd
    {
        public PortalUserServiceCategoryEnum? PortalUserServiceCategory { get; set; }
    };
    public record PortalUserDeleteCmd(Guid Id) : PortalUserCmd;

}
