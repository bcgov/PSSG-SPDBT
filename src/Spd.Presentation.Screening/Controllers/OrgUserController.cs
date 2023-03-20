using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgUser;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// 
    /// </summary>
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

        [Route("api/orgs/{orgId}/users")]
        [HttpPost]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Add([FromBody][Required] OrgUserCreateRequest orgUserCreateRequest, [FromRoute] Guid orgId)
        {
            orgUserCreateRequest.OrganizationId = orgId;
            return await _mediator.Send(new OrgUserCreateCommand(orgUserCreateRequest));
        }

        [Route("api/orgs/{orgId}/users/{userId}")]
        [HttpPut]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Put([FromRoute] Guid userId, [FromBody] OrgUserUpdateRequest orgUserUpdateRequest, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgUserUpdateCommand(userId, orgUserUpdateRequest));
        }

        [Route("api/orgs/{orgId}/users/{userId}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteAsync([FromRoute] Guid userId, [FromRoute] Guid orgId)
        {
            await _mediator.Send(new OrgUserDeleteCommand(userId, orgId));
            return Ok();
        }

        /// <summary>
        /// Get Organization Authorized User from its user id
        /// </summary>
        /// <param name="userId">Guid of the user</param>
        /// <returns>OrgUserResponse</returns>
        /// <exception cref="Exception"></exception>
        [Route("api/orgs/{orgId}/users/{userId}")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Get([FromRoute] Guid orgId, Guid userId)
        {
            return await _mediator.Send(new OrgUserGetQuery(userId));
        }

        /// <summary>
        /// return active users belong to the organization.
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/users")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<OrgUserListResponse> GetList([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgUserListQuery(orgId));
        }
    }
}