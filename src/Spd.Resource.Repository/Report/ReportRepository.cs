using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Report
{
    internal class ReportRepository : IOrgReportRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;

        public ReportRepository(IDynamicsContextFactory ctx, IMapper mapper)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
        }

        public async Task<OrgReportsResult> QueryReportsAsync(OrgReportListQry qry, CancellationToken ct)
        {
            IQueryable<spd_pdfreport> reports = _dynaContext.spd_pdfreports
            .Where(r => r._spd_organizationid_value == qry.OrgId)
            .OrderByDescending(r => r.spd_reportdate);

            return new OrgReportsResult(_mapper.Map<IEnumerable<OrgReportResult>>(reports));
        }
    }
}
