using MediatR;
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
        [Produces("application/json")]
        public async Task<OrgUserResponse> Add([FromBody][Required] OrgUserCreateRequest orgUserCreateRequest)
        {
            orgUserCreateRequest.OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4");
            return await _mediator.Send(new OrgUserCreateCommand(orgUserCreateRequest));
        }

        [Route("api/org-user/{userId}")]
        [HttpPut]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Put(string userId, [FromBody] OrgUserUpdateRequest orgUserUpdateRequest)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid UserId Guid");
            }
            return await _mediator.Send(new OrgUserUpdateCommand(userIdGuid, orgUserUpdateRequest));
        }

        [Route("api/org-user/{userId}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteAsync(string userId)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid UserId Guid");
            }
            await _mediator.Send(new OrgUserDeleteCommand(userIdGuid));
            return Ok();
        }

        [Route("api/org-user/{userId}")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Get(string userId)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid UserId Guid");
            }

            return await _mediator.Send(new OrgUserGetCommand(userIdGuid));
        }

        [Route("api/org-users/{organizationId}")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<OrgUserListResponse> List(string organizationId)
        {
            if (!Guid.TryParse(organizationId, out Guid organizationIdGuid))
            {
                throw new Exception("Invalid OrganizationId Guid");
            }

            return await _mediator.Send(new OrgUserListCommand(organizationIdGuid));
        }
    }
}