namespace Spd.Resource.Organizations.Report
{
    public interface IOrgReportRepository
    {
        Task<OrgReportsResult> QueryReportsAsync(OrgReportListQry qry, CancellationToken ct);
        public Task<ReportFileResp> QueryReportFileAsync(ReportFileQry clearanceLetterQry, CancellationToken ct);
    }

    public abstract record OrgReportQryResult;
    public record OrgReportsResult(IEnumerable<OrgReportResult> ReportResults) : OrgReportQryResult;
    public abstract record OrgReportQry;
    public record OrgReportListQry(Guid? OrgId = null) : OrgReportQry;
    public record OrgReportResult
    {
        public Guid? Id { get; set; }
        public DateTimeOffset ReportDate { get; set; }
    }
    public record ReportFileQry(Guid ReportId);
    public record ReportFileResp
    {
        public string? ContentType { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string? FileName { get; set; } = null!;
    }
}
