using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Admin;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
    [Authorize(Roles = "BCGovStaff")]
    public class MinistryController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        public MinistryController(IMediator mediator)
        {
            _mediator = mediator;
        }


        [Route("api/ministries")]
        [HttpGet]
        public async Task<IEnumerable<MinistryResponse>> Get()
        {
            return await _mediator.Send(new GetMinistryQuery());
        }
    }
}