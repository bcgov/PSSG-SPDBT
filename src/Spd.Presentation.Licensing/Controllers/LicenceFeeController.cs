using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceFeeController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        public LicenceFeeController(
            IMediator mediator,
            IConfiguration configuration) : base(configuration)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get licence fee
        /// Sample: api/licence-fee?workerLicenceTypeCode=SecurityWorkerLicence
        /// </summary>
        /// <param name="workerLicenceTypeCode"></param>
        /// <returns></returns>
        [Route("api/licence-fee")]
        [HttpGet]
        public async Task<LicenceFeeListResponse> GetLicenceFee([FromQuery] WorkerLicenceTypeCode? workerLicenceTypeCode = null)
        {
            return await _mediator.Send(new GetLicenceFeeListQuery(workerLicenceTypeCode));
        }
    }
}