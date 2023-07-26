using Spd.Resource.Organizations.Registration;

namespace Spd.Resource.Organizations.Identity
{
    public interface IIdentityRepository
    {
        Task<IdentityQueryResult?> Query(IdentityQuery query, CancellationToken ct);
    }

    //query
    public abstract record IdentityQuery;
    public record UserIdentityQuery(Guid UserGuid, Guid? OrgGuid) : IdentityQuery;
    public record ApplicantIdentityQuery(string UserGuid, IdentityProviderTypeEnum IdentityProviderType) : IdentityQuery;
    public abstract record IdentityQueryResult;
    public record UserIdentityQueryResult(IEnumerable<Identity> Identities) : IdentityQueryResult;
    public record ApplicantIdentityQueryResult : IdentityQueryResult
    {
        public Guid ContactId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    //shared content
    public record Identity
    {
        public string? OrgId { get; set; }
        public string? IdentityNumber { get; set; }
        public Guid Id { get; set; }
    }

}
