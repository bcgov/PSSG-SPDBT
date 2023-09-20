using Amazon.S3.Model;

namespace Spd.Resource.Applicants.PortalUser
{
    public interface IPortalUserRepository
    {
        public Task<PortalUserListResp> QueryAsync(PortalUserQry cmd, CancellationToken cancellationToken);
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
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public record PortalUserQry
    {
        public Guid? OrganizationId { get; set; }
        public Guid? IdentityId { get; set; }
        public string? UserEmail { get; set; }
        public bool IncludeInactive { get; set; } = false;
    };


    public abstract record PortalUserCmd 
    {
        public string? EmailAddress { get; set; }
        public Guid? IdentityId { get; set; }
    };
    public record UpdatePortalUserCmd : PortalUserCmd
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public Guid? OrgId { get; set; }
    };
    public record CreatePortalUserCmd : PortalUserCmd
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Guid OrgId { get; set; }
    }

}
