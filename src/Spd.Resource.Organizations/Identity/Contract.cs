namespace Spd.Resource.Organizations.Identity
{
    public interface IIdentityRepository
    {
        Task<IdentityQueryResult> QueryIdentity(IdentityQuery query, CancellationToken ct);
    }

    public abstract record IdentityQuery();
    //public record IdentityByOrgGuidQuery(Guid OrgGuid): IdentityQuery;
    public record IdentityByUserGuidOrgGuidQuery(Guid UserGuid, Guid OrgGuid) : IdentityQuery;
    public record IdentityQueryResult(IdentityInfo IdentityInfo);
    public record IdentityInfo
    {
        public string? OrgId { get; set; }
        public string? IdentityNumber { get; set; }
        public Guid Id { get; set; }
    }

}
