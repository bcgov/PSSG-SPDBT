using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgUser;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class OrgUserController : SpdControllerBase
    {
        private readonly ILogger<OrgUserController> _logger;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IPrincipal _currentUser;

        public OrgUserController(ILogger<OrgUserController> logger, IMediator mediator, IConfiguration configuration, IPrincipal currentUser)
        {
            _logger = logger;
            _mediator = mediator;
            _configuration = configuration;
            _currentUser = currentUser;
        }

        /// <summary>
        /// Verify if the current invite and login user are correct.
        /// </summary>
        /// <param name="orgUserInvitationRequest">which include InviteHashCode</param>
        /// <returns></returns>
        [Route("api/invitation")]
        [HttpPost]
        [Authorize]
        public async Task<InvitationResponse> VerifyUserInvitation([FromBody][Required] InvitationRequest orgUserInvitationRequest)
        {
            return await _mediator.Send(new VerifyUserInvitation(orgUserInvitationRequest, _currentUser.GetBizGuid(), _currentUser.GetUserGuid()));
        }

        [Authorize(Roles = "Primary")]
        [Route("api/orgs/{orgId}/users")]
        [HttpPost]
        public async Task<OrgUserResponse> Add([FromBody][Required] OrgUserCreateRequest orgUserCreateRequest, [FromRoute] Guid orgId)
        {
            orgUserCreateRequest.OrganizationId = orgId;

            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            if (hostUrl == null)
                throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");
            return await _mediator.Send(new OrgUserCreateCommand(orgUserCreateRequest, hostUrl));
        }

        [Authorize(Roles = "Primary,Contact")]
        [Route("api/orgs/{orgId}/users/{userId}")]
        [HttpPut]
        public async Task<OrgUserResponse> Put([FromRoute] Guid userId, [FromBody] OrgUserUpdateRequest orgUserUpdateRequest, [FromRoute] Guid orgId)
        {
            //if role is contact, can only change his own phone number, job title
            if (_currentUser.GetUserRole() == ContactAuthorizationTypeCode.Contact.ToString() &&
                userId.ToString() != _currentUser.GetUserId())
            {
               throw new ApiException(HttpStatusCode.Forbidden, "Authorized Contact can only change his own phone number and job title.");
            }
            return await _mediator.Send(new OrgUserUpdateCommand(userId, orgUserUpdateRequest));
        }

        [Authorize(Roles = "Primary")]
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
        [Authorize(Roles = "Primary,Contact")]
        public async Task<OrgUserResponse> Get([FromRoute] Guid orgId, Guid userId)
        {
            return await _mediator.Send(new OrgUserGetQuery(userId));
        }

        /// <summary>
        /// return active users belong to the organization.
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Primary,Contact")]
        [Route("api/orgs/{orgId}/users")]
        [HttpGet]
        public async Task<OrgUserListResponse> GetList([FromRoute] Guid orgId)
        {
            //if user is contact, he can only see active user list.
            if (_currentUser.GetUserRole() == ContactAuthorizationTypeCode.Contact.ToString())
                return await _mediator.Send(new OrgUserListQuery(orgId, true));

            return await _mediator.Send(new OrgUserListQuery(orgId));
        }
    }
}