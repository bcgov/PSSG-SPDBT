namespace Spd.Engine.Validation
{
    public interface IDuplicateCheckEngine
    {
        public Task<DuplicateCheckResponse> DuplicateCheckAsync(DuplicateCheckRequest request, CancellationToken ct);
    }

    public abstract record DuplicateCheckRequest;
    public abstract record DuplicateCheckResponse;
    public record BulkUploadAppDuplicateCheckRequest(IEnumerable<AppBulkDuplicateCheck> BulkDuplicateChecks) : DuplicateCheckRequest;
    public record AppBulkDuplicateCheck : AppDuplicateCheck
    {
        public int LineNumber { get; set; }
    }
    public record AppDuplicateCheck
    {
        public Guid OrgId { get; set; }
        public string? GivenName { get; set; }
        public string SurName { get; set; } = null!;
        public DateTimeOffset DateOfBirth { get; set; }
    }

    public record BulkUploadAppDuplicateCheckResponse(IEnumerable<AppBulkDuplicateCheckResult> BulkDuplicateChecks) : DuplicateCheckResponse;

    public record AppBulkDuplicateCheckResult : AppDuplicateCheckResult
    {
        public int LineNumber { get; set; }
        public string? Msg { get; set; } = null;
    }
    public record AppDuplicateCheckResult
    {
        public bool HasPotentialDuplicate { get; set; } = false;
        public string? FirstName { get; set; }
        public string LastName { get; set; } = null!;
    }
}
