using MediatR;
using Spd.Utilities.Shared.ManagerContract;

namespace Spd.Manager.Membership.Report
{
    public interface IReportManager
    {
        public Task<OrgReportListResponse> Handle(OrgReportListQuery request, CancellationToken ct);
    }

    public record OrgReportListQuery(Guid orgId) : IRequest<OrgReportListResponse>;

    public class OrgReportListResponse
    {
        public IEnumerable<OrgReportResponse> Reports { get; set; } = Array.Empty<OrgReportResponse>();
        public PaginationResponse Pagination { get; set; } = null!;
    }

    public class OrgReportResponse
    {
        public Guid Id { get; set; }
        public DateTimeOffset ReportDate { get; set; }
    }
}
