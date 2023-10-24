
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Licence;
using Spd.Utilities.LogonUser;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    [Authorize(Policy = "OnlyBcsc")]
    public class WorkerLicensingController : ControllerBase
    {
        private readonly ILogger<WorkerLicensingController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public WorkerLicensingController(ILogger<WorkerLicensingController> logger, IPrincipal currentUser, IMediator mediator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// Create Security Worker Licence
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licences")]
        [HttpPost]
        public async Task<WorkerLicenceCreateResponse> CreateWorkerLicence([FromForm][Required] WorkerLicenceCreateRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceCreateRequest");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new WorkerLicenceCreateCommand(licenceCreateRequest, info.Sub));
        }
    }
}