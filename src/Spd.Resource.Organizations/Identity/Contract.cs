namespace Spd.Resource.Organizations.Identity
{
    public interface IIdentityRepository
    {
        Task<IdentityQueryResult?> Query(IdentityQuery query, CancellationToken ct);
    }

    //query
    public record IdentityQuery(Guid UserGuid, Guid? OrgGuid);
    public record IdentityQueryResult(IEnumerable<Identity> Identities);

    //shared content
    public record Identity
    {
        public string? OrgId { get; set; }
        public string? IdentityNumber { get; set; }
        public Guid Id { get; set; }
    }

}
