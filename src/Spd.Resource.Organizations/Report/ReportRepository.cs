using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Resource.Applicants.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;

namespace Spd.Resource.Organizations.Report
{
    internal class ReportRepository : IOrgReportRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ReportRepository> _logger;
        private readonly IFileStorageService _fileStorage;

        public ReportRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ReportRepository> logger, IFileStorageService fileStorage)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
            _fileStorage = fileStorage;
        }

        public async Task<OrgReportsResult> QueryReportsAsync(OrgReportListQry qry, CancellationToken ct)
        {
            IQueryable<spd_pdfreport> reports = _dynaContext.spd_pdfreports
            .Where(r => r._spd_organizationid_value == qry.OrgId)
            .OrderByDescending(r => r.spd_reportdate);

            return new OrgReportsResult(_mapper.Map<IEnumerable<OrgReportResult>>(reports));
        }

        public async Task<ReportFileResp> QueryReportFileAsync(ReportFileQry reportFileQry, CancellationToken ct)
        {
            var docUrl = await _dynaContext.bcgov_documenturls.Where(d => d._spd_pdfreportid_value == reportFileQry.ReportId)
                .OrderByDescending(d => d.createdon).FirstOrDefaultAsync(ct);

            if (docUrl == null || docUrl.bcgov_documenturlid == null)
                return new ReportFileResp(); // no report

            FileQueryResult fileResult = (FileQueryResult)await _fileStorage.HandleQuery(
                new FileQuery { Key = docUrl.bcgov_documenturlid.ToString(), Folder = $"spd_pdfreport/{docUrl._spd_pdfreportid_value}" },
                ct);
            return new ReportFileResp()
            {
                Content = fileResult.File.Content,
                ContentType = fileResult.File.ContentType,
                FileName = fileResult.File.FileName
            };
        }
    }
}
