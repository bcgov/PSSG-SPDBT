namespace Spd.Resource.Applicants.BulkHistory;

public interface IBulkHistoryRepository
{
    public Task<BulkHistoryListResp> QueryAsync(BulkHistoryListQry query, CancellationToken cancellationToken);
}

//application list
public record BulkHistoryListQry
{
    public Guid OrgId { get; set; }
    public BulkHistorySortBy? SortBy { get; set; } //null means no sorting
    public Paging Paging { get; set; } = null!;
}

public record BulkHistorySortBy(bool? SubmittedDateDesc = true);
public record BulkHistoryListResp
{ 
    public IEnumerable<BulkHistoryResp> BulkUploadHistorys { get; set; } = Array.Empty<BulkHistoryResp>();
    public PaginationResp Pagination { get; set; } = null!;
}
public record BulkHistoryResp
{
    public Guid Id { get; set; }
    public string BatchNumber { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public Guid UploadedByUserId { get; set; } = Guid.Empty;
    public string UploadedByUserFullName { get; set; } = null!;
    public DateTimeOffset UploadedDateTime { get; set; }
}
