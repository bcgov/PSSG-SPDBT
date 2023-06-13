using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Report;

namespace Spd.Manager.Membership.Report
{
    internal class OrgReportManager
    : IRequestHandler<OrgReportListQuery, OrgReportListResponse>,
    IReportManager
    {
        private readonly IOrgReportRepository _reportRepository;
        private readonly IMapper _mapper;
        private readonly IOrgRepository _orgRepository;
        public OrgReportManager(IOrgReportRepository reportRepository, IMapper mapper, IOrgRepository orgRepository)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _orgRepository = orgRepository;
        }

        public async Task<OrgReportListResponse> Handle(OrgReportListQuery request, CancellationToken ct)
        {
            var reports = await _reportRepository.QueryReportsAsync(new OrgReportListQry(request.orgId), ct);
            var reportResps = _mapper.Map<IEnumerable<OrgReportResponse>>(reports.ReportResults);

            return new OrgReportListResponse
            {
                Reports = reportResps
            };
        }
    }
}