using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Report;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Screening
{
    internal class OrgReportManager
    : IRequestHandler<OrgReportListQuery, OrgReportListResponse>,
    IRequestHandler<ReportFileQuery, FileResponse>,
    IReportManager
    {
        private readonly IOrgReportRepository _reportRepository;
        private readonly IMapper _mapper;
        private readonly IDocumentRepository _documentRepository;
        private readonly IMainFileStorageService _fileStorageService;

        public OrgReportManager(IOrgReportRepository reportRepository, IMapper mapper, IDocumentRepository documentRepository, IMainFileStorageService fileStorageService)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _documentRepository = documentRepository;
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

        public async Task<FileResponse> Handle(ReportFileQuery query, CancellationToken ct)
        {
            DocumentQry qry = new(ReportId: query.ReportId);
            var docList = await _documentRepository.QueryAsync(qry, ct);
            if (docList == null || !docList.Items.Any())
                return new FileResponse();

            var docUrl = docList.Items.OrderByDescending(f => f.UploadedDateTime).FirstOrDefault();
            FileQueryResult fileResult = (FileQueryResult)await _fileStorageService.HandleQuery(
                new FileQuery { Key = docUrl.DocumentUrlId.ToString(), Folder = $"spd_pdfreport/{docUrl.ReportId}" },
                ct);
            return new FileResponse
            {
                Content = fileResult.File.Content,
                ContentType = fileResult.File.ContentType,
                FileName = fileResult.File.FileName
            };
        }
    }
}