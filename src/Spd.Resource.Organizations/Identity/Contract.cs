namespace Spd.Resource.Organizations.Identity
{
    public interface IIdentityRepository
    {
        Task<IdentityQueryResult?> QueryIdentity(IdentityQuery query, CancellationToken ct);
    }

    //query
    public abstract record IdentityQuery;
    public record IdentityByUserGuidOrgGuidQuery(Guid UserGuid, Guid OrgGuid) : IdentityQuery;
    public record IdentityByUserGuidQuery(Guid UserGuid) : IdentityQuery;
    public record IdentityQueryResult(IEnumerable<Identity> Identities);

    //shared content
    public record Identity
    {
        public string? OrgId { get; set; }
        public string? IdentityNumber { get; set; }
        public Guid Id { get; set; }
    }

}
