using Spd.Resource.Repository.Registration;

namespace Spd.Resource.Repository.Identity
{
    public interface IIdentityRepository
    {
        Task<IdentityQueryResult> Query(IdentityQry query, CancellationToken ct);
        Task<IdentityCmdResult?> Manage(IdentityCmd query, CancellationToken ct);
    }

    //query
    public record IdentityQry(string? UserGuid, Guid? OrgGuid, IdentityProviderType? IdentityProviderType, bool includeInactive = false);
    public record IdentityQueryResult(IEnumerable<Identity> Items);

    //cmd
    public abstract record IdentityCmd;
    public record CreateIdentityCmd(string UserGuid, Guid? OrgGuid, IdentityProviderType IdentityProviderType) : IdentityCmd;
    public record IdentityCmdResult()
    {
        public Guid Id { get; set; }
    };

    //shared content
    public record Identity
    {
        public string? OrgId { get; set; }
        public string? IdentityNumber { get; set; }
        public Guid Id { get; set; }
        public Guid? ContactId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly? BirthDate { get; set; }
        public Gender? Gender { get; set; }
        public string? Sub { get; set; }
    }

}
