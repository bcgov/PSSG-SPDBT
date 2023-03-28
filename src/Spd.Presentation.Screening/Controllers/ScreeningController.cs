using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    public class ScreeningController : SpdControllerBase
    {
        private readonly ILogger<OrgController> _logger;
        private readonly IMediator _mediator;

        public ScreeningController(ILogger<OrgController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Route("api/orgs/{orgId}/screening-invites")]
        [HttpPost]
        public async Task<IList<ScreeningInviteCreateResponse>> Add([FromBody][Required] IList<ScreeningInviteCreateRequest> inviteCreateRequests, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new ScreeningInviteCreateCommand(orgId, inviteCreateRequests));
        }
    }
}
