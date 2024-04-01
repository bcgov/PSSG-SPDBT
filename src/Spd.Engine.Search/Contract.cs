using Spd.Manager.Shared;

namespace Spd.Engine.Search
{
    public interface ISearchEngine
    {
        public Task<SearchResponse> SearchAsync(SearchRequest request, CancellationToken ct);
    }

    public abstract record SearchRequest;
    public abstract record SearchResponse;
    public record ShareableClearanceSearchRequest(Guid OrgId, string BcscId, ServiceTypeCode ServiceType) : SearchRequest;
    public record ShareableClearanceSearchResponse : SearchResponse
    {
        public IEnumerable<ShareableClearance> Items { get; set; } = Array.Empty<ShareableClearance>();
    }
    public record ShareableClearance()
    {
        public Guid OrgId { get; set; }
        public string OrgName { get; set; } = null!;
        public string ServiceType { get; set; } = null!;
        public DateTimeOffset? GrantedDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public Guid ClearanceId { get; set; }
    }
}