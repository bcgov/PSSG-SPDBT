using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Screening
{
    public interface IReportManager
    {
        public Task<OrgReportListResponse> Handle(OrgReportListQuery request, CancellationToken ct);
        public Task<FileResponse> Handle(ReportFileQuery query, CancellationToken ct);
    }

    public record OrgReportListQuery(Guid orgId) : IRequest<OrgReportListResponse>;

    public class OrgReportListResponse
    {
        public IEnumerable<OrgReportResponse> Reports { get; set; } = Array.Empty<OrgReportResponse>();
    }

    public class OrgReportResponse
    {
        public Guid Id { get; set; }
        public DateOnly ReportDate { get; set; }
    }

    public record ReportFileQuery(Guid ReportId) : IRequest<FileResponse>;


}
