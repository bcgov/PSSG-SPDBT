using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Licence;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceFeeController : ControllerBase
    {
        private readonly ILogger<LicenceFeeController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;

        public LicenceFeeController(
            ILogger<LicenceFeeController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
        }

        /// <summary>
        /// Get licence fee
        /// </summary>
        /// <param name="workerLicenceType"></param>
        /// <returns></returns>
        [Route("api/licence-fee/{workerLicenceType}")]
        [HttpGet]
        public async Task<LicenceFeeListResponse> GetLicenceFee([FromRoute][Required] string workerLicenceType)
        {
            Enum.TryParse<WorkerLicenceTypeCode>(workerLicenceType, out WorkerLicenceTypeCode workerLicenceTypeCode);
            return await _mediator.Send(new GetLicenceFeeListQuery(workerLicenceTypeCode));
        }
    }
}