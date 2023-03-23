using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    public class OrgRegistrationController : SpdControllerBase
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
        [Authorize]
        public async Task<ActionResult> Register([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            await _mediator.Send(new OrgRegistrationCreateCommand(orgRegistrationCreateRequest));
            return Ok();
        }

        [Route("api/org-registrations/detect-duplicate")]
        [HttpPost]
        [Authorize]
        public async Task<CheckDuplicateResponse> DetectDuplicate([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            return await _mediator.Send(new CheckOrgRegistrationDuplicateQuery(orgRegistrationCreateRequest));
        }
    }
}