namespace Spd.Resource.Repository.Report
{
    public interface IOrgReportRepository
    {
        Task<OrgReportsResult> QueryReportsAsync(OrgReportListQry qry, CancellationToken ct);
    }

    public abstract record OrgReportQryResult;
    public record OrgReportsResult(IEnumerable<OrgReportResult> ReportResults) : OrgReportQryResult;
    public abstract record OrgReportQry;
    public record OrgReportListQry(Guid? OrgId = null) : OrgReportQry;
    public record OrgReportResult
    {
        public Guid? Id { get; set; }
        public DateOnly? ReportDate { get; set; }
    }
}