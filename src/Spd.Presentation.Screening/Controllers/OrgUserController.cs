using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgUser;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    //[Authorize] //temp comment out
    public class OrgUserController : ControllerBase
    {
        private readonly ILogger<OrgRegistrationController> _logger;
        private readonly IMediator _mediator;

        public OrgUserController(ILogger<OrgRegistrationController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Route("api/org-user")]
        [HttpPost]
        public async Task<ActionResult> Add([FromBody][Required] OrgUserCreateRequest orgUserCreateRequest)
        {
            orgUserCreateRequest.OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4");
            await _mediator.Send(new CreateOrgUserCommand(orgUserCreateRequest));
            return Ok();
        }
    }
}