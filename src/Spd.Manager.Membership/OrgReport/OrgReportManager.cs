using AutoMapper;
using MediatR;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Organizations.Report;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Membership.Report
{
    internal class OrgReportManager
    : IRequestHandler<OrgReportListQuery, OrgReportListResponse>,
    IRequestHandler<ReportFileQuery, ReportFileResponse>,
    IReportManager
    {
        private readonly IOrgReportRepository _reportRepository;
        private readonly IMapper _mapper;
        private readonly IDocumentRepository _documentUrlRepository;
        private readonly IFileStorageService _fileStorageService;

        public OrgReportManager(IOrgReportRepository reportRepository, IMapper mapper, IDocumentRepository documentUrlRepository, IFileStorageService fileStorageService)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _documentUrlRepository = documentUrlRepository;
            _fileStorageService = fileStorageService;
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

        public async Task<ReportFileResponse> Handle(ReportFileQuery query, CancellationToken ct)
        {
            DocumentQry qry = new DocumentQry(ReportId: query.ReportId);
            var docList = await _documentUrlRepository.QueryAsync(qry, ct);
            if (docList == null || !docList.Items.Any())
                return new ReportFileResponse();

            var docUrl = docList.Items.OrderByDescending(f => f.UploadedDateTime).FirstOrDefault();
            FileQueryResult fileResult = (FileQueryResult)await _fileStorageService.HandleQuery(
                new FileQuery { Key = docUrl.DocumentUrlId.ToString(), Folder = $"spd_pdfreport/{docUrl.ReportId}" },
                ct);
            return new ReportFileResponse
            {
                Content = fileResult.File.Content,
                ContentType = fileResult.File.ContentType,
                FileName = fileResult.File.FileName
            };
        }
    }
}