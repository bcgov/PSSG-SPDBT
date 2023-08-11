using Spd.Resource.Organizations.Registration;

namespace Spd.Resource.Organizations.Identity
{
    public interface IIdentityRepository
    {
        Task<IdentityQueryResult> Query(IdentityQry query, CancellationToken ct);
        Task<IdentityCmdResult?> Manage(IdentityCmd query, CancellationToken ct);
    }

    //query
    public record IdentityQry(string? UserGuid, Guid? OrgGuid, IdentityProviderTypeEnum? IdentityProviderType, bool includeInactive = false);
    public record IdentityQueryResult(IEnumerable<Identity> Items);

    //cmd
    public abstract record IdentityCmd;
    public record CreateIdentityCmd(string UserGuid, Guid? OrgGuid, IdentityProviderTypeEnum IdentityProviderType) : IdentityCmd;
    public abstract record IdentityCmdResult(Guid Id);

    //shared content
    public record Identity
    {
        public string? OrgId { get; set; }
        public string? IdentityNumber { get; set; }
        public Guid Id { get; set; }
        public Guid? ContactId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

}
