using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Report
{
    internal class ReportRepository : IOrgReportRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ReportRepository> _logger;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public ReportRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ReportRepository> logger, IDataProtectionProvider dpProvider)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
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
