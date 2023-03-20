using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.Org;

namespace Spd.Presentation.Screening.Controllers
{
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
        [Produces("application/json")]
        public async Task<OrgResponse> Put([FromBody] UpdateOrgRequest updateOrgRequest, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new UpdateOrgCommand(updateOrgRequest, orgId));
        }

        [Route("api/org/{orgId}")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<OrgResponse> Get([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new GetOrgCommand(orgId));
        }
    }
}
