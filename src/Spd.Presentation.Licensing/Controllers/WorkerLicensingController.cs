
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Licence;
using Spd.Utilities.LogonUser;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;


namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
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

        #region bcsc authenticated
        /// <summary>
        /// Create Security Worker Licence Application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceUpsertResponse> SaveSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceUpsertRequest");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest, info.Sub));
        }

        /// <summary>
        /// Create Security Worker Licence Application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{id}")]
        [HttpGet]
        public async Task<WorkerLicenceResponse> GetSecurityWorkerLicenceApplication([FromRoute][Required] Guid id)
        {
            return await _mediator.Send(new GetWorkerLicenceQuery(id));
        }


        #endregion

        /// <summary>
        /// Create Security Worker Licence Application Anonymously
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/anonymous-worker-licences")]
        [HttpPost]
        public async Task<WorkerLicenceUpsertResponse> CreateWorkerLicenceAnonymously([FromBody][Required] WorkerLicenceUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get CreateWorkerLicenceAnonymously");
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest));
        }


    }

}