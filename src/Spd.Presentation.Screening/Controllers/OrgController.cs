using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.Org;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    [ApiExceptionFilter]
    public class OrgController : Controller
    {
        private readonly ILogger<OrgController> _logger;
        private readonly IMediator _mediator;

        public OrgController(ILogger<OrgController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Route("api/org/{orgId}")]
        [HttpPut]
        public async Task<OrgResponse> Put([FromBody] OrgUpdateRequest updateOrgRequest, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgUpdateCommand(updateOrgRequest, orgId));
        }

        [Route("api/org/{orgId}")]
        [HttpGet]
        public async Task<OrgResponse> Get([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgGetQuery(orgId));
        }
    }
}
