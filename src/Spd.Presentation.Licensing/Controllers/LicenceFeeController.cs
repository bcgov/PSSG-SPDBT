using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceFeeController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        public LicenceFeeController(
            IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get licence fee
        /// Sample: api/licence-fee?serviceTypeCode=SecurityWorkerLicence
        /// </summary>
        /// <param name="serviceTypeCode"></param>
        /// <returns></returns>
        [Route("api/licence-fee")]
        [HttpGet]
        public async Task<LicenceFeeListResponse> GetLicenceFee([FromQuery] ServiceTypeCode? serviceTypeCode = null)
        {
            return await _mediator.Send(new GetLicenceFeeListQuery(serviceTypeCode));
        }
    }
}