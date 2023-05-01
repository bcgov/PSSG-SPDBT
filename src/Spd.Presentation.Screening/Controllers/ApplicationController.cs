using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    [Authorize]
    public class ApplicationController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        public ApplicationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
        /// </summary>
        /// <param name="invitesCreateRequest"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-invites")]
        [HttpPost]
        public async Task<ApplicationInvitesCreateResponse> AddApplicationInvites([FromBody][Required] ApplicationInvitesCreateRequest invitesCreateRequest, [FromRoute] Guid orgId)
        {
            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);
            return await _mediator.Send(new ApplicationInviteCreateCommand(invitesCreateRequest, orgId, Guid.Parse(userId)));
        }

        /// <summary>
        /// get the active application invites list.
        /// support wildcard search for email and name, it will search email or name contains str.
        /// sample: /application-invites?filter=searchText@=str
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="filters"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-invites")]
        [HttpGet]
        public async Task<ApplicationInviteListResponse> GetInvitesList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] uint? page, [FromQuery] uint? pageSize)
        {
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            string? filterValue = null;
            if (!string.IsNullOrWhiteSpace(filters))
            {
                try
                {
                    var strs = filters.Split("@=");
                    if (strs[0].Equals("searchText", StringComparison.InvariantCultureIgnoreCase))
                        filterValue = strs[1];
                }
                catch
                {
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "invalid filtering string.");
                }
            }
            return await _mediator.Send(new ApplicationInviteListQuery(orgId, SearchContains: filterValue, (int)page, (int)pageSize));
        }


        [Route("api/orgs/{orgId}/application-invites/{applicationInviteId}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteAsync([FromRoute] Guid applicationInviteId, [FromRoute] Guid orgId)
        {
            await _mediator.Send(new ApplicationInviteDeleteCommand(orgId, applicationInviteId));
            return Ok();
        }

        /// <summary>
        /// create application. if checkDuplicate is true, it will check if there is existing duplicated applications 
        /// </summary>
        /// <param name="applicationCreateRequest"></param>
        /// <param name="orgId">organizationId</param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application")]
        [HttpPost]
        public async Task<ApplicationCreateResponse> AddApplication([FromBody][Required] ApplicationCreateRequest applicationCreateRequest, [FromRoute] Guid orgId)
        {
            applicationCreateRequest.OrgId = orgId;
            return await _mediator.Send(new ApplicationCreateCommand(applicationCreateRequest));
        }

        /// <summary>
        /// return active applications belong to the organization.
        /// sample: api/orgs/4165bdfe-7cb4-ed11-b83e-00505683fbf4/applications?filters=status=Pending|completed&sorts=firstname&page=1&pageSize=15
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="filters"></param>
        /// <param name="sorts"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications")]
        [HttpGet]
        public async Task<ApplicationListResponse> GetList([FromRoute] Guid orgId, [FromQuery] string? filters, [FromQuery] string? sorts, [FromQuery] uint? page, [FromQuery] uint? pageSize)
        {
            //todo, when we do filtering and sorting, will complete this.
            string f = filters;
            string s = sorts;

            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            return await _mediator.Send(new ApplicationListQuery(orgId, (int)page, (int)pageSize));
        }
    }
}

