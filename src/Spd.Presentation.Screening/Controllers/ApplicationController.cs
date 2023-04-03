using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    public class ApplicationController : SpdControllerBase
    {
        private readonly ILogger<OrgController> _logger;
        private readonly IMediator _mediator;

        public ApplicationController(ILogger<OrgController> logger, IMediator mediator)
        {
            _logger = logger;
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

        [Route("api/orgs/{orgId}/application-submission")]
        [HttpPost]
        public async Task<Unit> Add([FromBody][Required] ApplicationSubmissionCreateRequest submissionCreateRequest, [FromRoute] Guid orgId)
        {
            submissionCreateRequest.OrganizationId = orgId;
            return await _mediator.Send(new ApplicationSubmissionCreateCommand(submissionCreateRequest));
        }

        [Route("api/orgs/{orgId}/detect-application-duplicate")]
        [HttpPost]
        public async Task<CheckApplicationSubmissionDuplicateResponse> DetectDuplicate([FromBody][Required] ApplicationSubmissionCreateRequest submissionCreateRequest, [FromRoute] Guid orgId)
        {
            submissionCreateRequest.OrganizationId = orgId;
            return await _mediator.Send(new CheckApplicationSubmissionDuplicateQuery(submissionCreateRequest));
        }
    }
}
