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
        /// sample: /application-invites?filters=searchText@=str
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

            return await _mediator.Send(new ApplicationInviteListQuery(orgId, Filters: filters, (int)page, (int)pageSize));
        }

        /// <summary>
        /// remove the invitation for a organization
        /// </summary>
        /// <param name="applicationInviteId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
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
            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);
            return await _mediator.Send(new ApplicationCreateCommand(applicationCreateRequest, orgId, Guid.Parse(userId)));
        }

        /// <summary>
        /// return all applications belong to the organization.
        /// sort: submittedon, name, companyname , add - in front of name means descending.
        /// filters: status, use | to filter multiple status : if no filters specified, endpoint returns all applications.
        /// search:wild card search in name, email and caseID, such as searchText@=test
        /// sample: api/orgs/4165bdfe-7cb4-ed11-b83e-00505683fbf4/applications?filters=status==AwaitingPayment|AwaitingApplicant,searchText@=str&sorts=name&page=1&pageSize=15
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
            page = (page == null || page < 0) ? 0 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            if (string.IsNullOrWhiteSpace(sorts)) sorts = "-submittedOn";
            return await _mediator.Send(
                new ApplicationListQuery(OrgId: orgId, 
                    Page: (int)page, 
                    PageSize: (int)pageSize,
                    Filters: filters, 
                    Sorts: sorts));
        }

        /// <summary>
        /// return the application statistics for a particular organization.
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application-statistics")]
        [HttpGet]
        public async Task<ApplicationStatisticsResponse> GetAppStatsList([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new ApplicationStatisticsRequest(orgId));
        }
    }
}

