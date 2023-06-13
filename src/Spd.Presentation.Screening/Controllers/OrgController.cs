﻿using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Manager.Membership.Org;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Authorize(Policy = "OnlyBCeID", Roles = "Primary,Contact")]
    public class OrgController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public OrgController( IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
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

        [Route("api/orgs/{orgId}")]
        [HttpGet]
        public async Task<OrgResponse> Get([FromRoute] Guid orgId)
        {
            return await _mediator.Send(new OrgGetQuery(orgId));
        }

        [Route("api/orgs/access-code/{accessCode}")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<AppOrgResponse> GetOrgFromAccessCode([FromRoute] string accessCode)
        {
            var orgResponse =  await _mediator.Send(new OrgGetQuery(null, accessCode));
            return _mapper.Map<AppOrgResponse>(orgResponse);
        }
    }
}
