using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Common.Admin;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Screening.Controllers
{
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