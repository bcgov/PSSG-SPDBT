using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership;
using Spd.Manager.Membership.ViewModels;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class OrgRegistrationController : ControllerBase
    {
        private readonly ILogger<OrgRegistrationController> _logger;
        private readonly IMediator _mediator;

        public OrgRegistrationController(ILogger<OrgRegistrationController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Route("api/org-registrations")]
        [HttpPost]
        public async Task<ActionResult> Register([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            await _mediator.Send(new CreateOrgRegistrationCommand(orgRegistrationCreateRequest));
            return Ok();
        }
    }
}