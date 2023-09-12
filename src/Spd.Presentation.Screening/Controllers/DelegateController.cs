using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Application;
using Spd.Manager.Membership.Org;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Authorize(Policy = "OnlyIdir", Roles = "BCGovStaff")]
    public class DelegateController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public DelegateController( IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        #region application-delegates

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application/{applicationId}/delegates")]
        [HttpGet]
        public async Task<DelegateListResponse> GetDelegateList([FromRoute] Guid applicationId, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new DelegateListQuery(orgId, applicationId));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application/{applicationId}/delegate")]
        [HttpPost]
        public async Task<ActionResult> AddDelegate([FromBody][Required] DelegateCreateRequest delegateRequest, [FromRoute] Guid applicationId, [FromRoute] Guid orgId)
        {
            await _mediator.Send(new CreateDelegateCommand(orgId, applicationId, delegateRequest));
            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="delegateId"></param>
        /// <param name="applicationId"></param>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/application/{applicationId}/delegate/{delegateId}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteDelegate([FromRoute] Guid delegateId, [FromRoute] Guid applicationId, [FromRoute] Guid orgId)
        {
            return Ok();
        }

        #endregion
    }
}
