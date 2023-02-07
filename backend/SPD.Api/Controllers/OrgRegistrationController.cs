using MediatR;
using Microsoft.AspNetCore.Mvc;
using SPD.Common.ViewModels.Organization;
using SPD.Handlers.OrgRegistration;
using System.ComponentModel.DataAnnotations;

namespace SPD.Api.Controllers
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