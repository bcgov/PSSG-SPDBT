using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.Org;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// 
    /// </summary>
 
    public class OrgController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        public OrgController(ILogger<OrgController> logger, IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Updating existing organization profile
        /// </summary>
        /// <param name="updateOrgRequest"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Authorize(Roles = "Primary")]
        [Route("api/orgs/{orgId}")]
        [HttpPut]
        public async Task<OrgResponse> Put([FromBody] OrgUpdateRequest updateOrgRequest, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgUpdateCommand(updateOrgRequest, orgId));
        }

        [Authorize(Roles = "Primary,Contact")]
        [Route("api/orgs/{orgId}")]
        [HttpGet]
        public async Task<OrgResponse> Get([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgGetQuery(orgId));
        }
    }
}
