using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    public class ApplicationController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        public ApplicationController(ILogger<OrgController> logger, IMediator mediator)
        {
            _mediator = mediator;
        }

        [Route("api/orgs/{orgId}/application-invites")]
        [HttpPost]
        public async Task<Unit> Add([FromBody][Required] IEnumerable<ApplicationInviteCreateRequest> inviteCreateRequests, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new ApplicationInviteCreateCommand(orgId, inviteCreateRequests));
        }

        [Route("api/orgs/{orgId}/detect-invite-duplicates")]
        [HttpPost]
        public async Task<IEnumerable<CheckApplicationInviteDuplicateResponse>> DetectDuplicates([FromBody][Required] IEnumerable<ApplicationInviteCreateRequest> inviteCreateRequests, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new CheckApplicationInviteDuplicateQuery(orgId, inviteCreateRequests));
        }

        [Route("api/orgs/{orgId}/application")]
        [HttpPost]
        public async Task<Unit> Add([FromBody][Required] ApplicationCreateRequest applicationCreateRequest, [FromRoute] Guid orgId)
        {
            applicationCreateRequest.OrgId = orgId;
            return await _mediator.Send(new ApplicationCreateCommand(applicationCreateRequest));
        }

        [Route("api/orgs/{orgId}/detect-application-duplicate")]
        [HttpPost]
        public async Task<CheckApplicationDuplicateResponse> DetectDuplicate([FromBody][Required] ApplicationCreateRequest applicationCreateRequest, [FromRoute] Guid orgId)
        {
            applicationCreateRequest.OrgId = orgId;
            return await _mediator.Send(new CheckApplicationDuplicateQuery(applicationCreateRequest));
        }

        /// <summary>
        /// return active applications belong to the organization.
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications")]
        [HttpGet]
        public async Task<ApplicationListResponse> GetList([FromRoute] Guid orgId, [FromQuery] uint? page, [FromQuery] uint? pageSize)
        {
            page = (page == null || page == 0) ? 1 : page;
            pageSize = (pageSize == null || pageSize == 0 || pageSize > 100) ? 10 : pageSize;
            return await _mediator.Send(new ApplicationListQuery(orgId, (int)page, (int)pageSize));
        }
    }
}

