using Spd.Utilities.Shared.ManagerContract;

namespace Spd.Engine.Search
{
    public interface ISearchEngine
    {
        public Task<SearchResponse> SearchAsync(SearchRequest request, CancellationToken ct);
    }

    public abstract record SearchRequest;
    public abstract record SearchResponse;
    public record SharableClearanceSearchRequest(Guid OrgId, string BcscId, ServiceTypeCode ServiceType) : SearchRequest;
    public record SharableClearanceSearchResponse : SearchResponse
    {
        public IEnumerable<SharableClearance> Items { get; set; } = Array.Empty<SharableClearance>();
    }
    public record SharableClearance()
    {
        public Guid OrgId { get; set; }
        public string OrgName { get; set; } = null!;
        public string ServiceType { get; set; } = null!;
        public DateTimeOffset? GrantedDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public Guid ClearanceId { get; set; }
        public string? FirstName { get; set; }
        public string LastName { get; set; } = null!;
    }
}
