namespace Spd.Engine.Validation
{
    public interface IDuplicateCheckEngine
    {
        public Task<DuplicateCheckResponse> DuplicateCheckAsync(DuplicateCheckRequest request, CancellationToken ct);
    }

    public abstract record DuplicateCheckRequest;
    public abstract record DuplicateCheckResponse;

    #region bulk upload duplicate check
    public record BulkUploadAppDuplicateCheckRequest(IEnumerable<AppBulkDuplicateCheck> BulkDuplicateChecks) : DuplicateCheckRequest;
    public record AppBulkDuplicateCheck : AppDuplicateCheck
    {
        public int LineNumber { get; set; }
    }
    public record AppDuplicateCheck
    {
        public Guid OrgId { get; set; }
        public string? FirstName { get; set; }
        public string LastName { get; set; } = null!;
        public DateTimeOffset DateOfBirth { get; set; }
    }
    public record BulkUploadAppDuplicateCheckResponse(IEnumerable<AppBulkDuplicateCheckResult> BulkDuplicateChecks) : DuplicateCheckResponse;
    public record AppBulkDuplicateCheckResult : AppDuplicateCheckResult
    {
        public int LineNumber { get; set; }
        public string? Msg { get; set; } = null;
        public bool HasPotentialDuplicateInTsv { get; set; } = false;
        public bool HasPotentialDuplicateInDb { get; set; } = false;
    }
    public record AppDuplicateCheckResult
    {
        public bool HasPotentialDuplicate { get; set; } = false;
        public string? FirstName { get; set; }
        public string LastName { get; set; } = null!;
    }
    #endregion

    #region app invite duplicate check
    public record AppInviteDuplicateCheckRequest(IEnumerable<AppInviteDuplicateCheck> AppInviteChecks, Guid OrgId) : DuplicateCheckRequest;
    public record AppInviteDuplicateCheck
    {
        public string? FirstName { get; set; }
        public string LastName { get; set; } = null!;
    }
    public record AppInviteDuplicateCheckResponse(IEnumerable<AppInviteDuplicateCheckResult> AppInviteCheckResults) : DuplicateCheckResponse;
    public record AppInviteDuplicateCheckResult : AppInviteDuplicateCheck
    {
        public bool HasPotentialDuplicate { get; set; } = false;
    }
    #endregion

}
