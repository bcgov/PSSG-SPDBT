using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgUser;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
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
        [Produces("application/json")]
        public async Task<OrgUserResponse> Add([FromBody][Required] OrgUserCreateRequest orgUserCreateRequest)
        {
            orgUserCreateRequest.OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4");
            return await _mediator.Send(new OrgUserCreateCommand(orgUserCreateRequest));
        }

        [Route("api/org-user")]
        [HttpPut]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Put(string userId, [FromBody] OrgUserUpdateRequest orgUserUpdateRequest)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid User Guid");
            }
            return await _mediator.Send(new OrgUserUpdateCommand(userIdGuid, orgUserUpdateRequest));
        }
    }
}