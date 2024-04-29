using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Screening;
using Spd.Manager.Shared;
using Spd.Utilities.Shared;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// </summary>
    public class OrgReportController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly ClaimsPrincipal _currentUser;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mediator"></param>
        /// <param name="currentUser"></param>
        public OrgReportController(IMediator mediator, IPrincipal currentUser, IMapper mapper, IConfiguration configuration) : base(configuration)
        {
            _mediator = mediator;
            _mapper = mapper;
            _currentUser = (ClaimsPrincipal)currentUser;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/reports")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<OrgReportListResponse> Reports([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgReportListQuery(orgId));
        }

        /// <summary>
        /// download the report
        /// </summary>
        /// <param name="reportId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/orgs/{orgId}/reports/{reportId}/file")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<FileStreamResult> DownloadReportAsync([FromRoute] Guid reportId, CancellationToken ct)
        {
            FileResponse response = await _mediator.Send(new ReportFileQuery(reportId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
    }
}