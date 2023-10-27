
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

        /// <summary>
        /// Create Security Worker Licence Application police background
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licences-police-backgroung")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceUpsertResponse> SaveWorkerLicencePoliceBackground([FromBody][Required] PoliceBackgroundUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceUpsertRequest");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return null;
        }

        /// <summary>
        /// Create Security Worker Licence Application mental health
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licences-mental-health")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceUpsertResponse> SaveWorkerLicenceMentalHealth([FromBody][Required] MentalHealthUpsertRequest mentalHealth)
        {
            _logger.LogInformation("Get SaveWorkerLicenceMentalHealth");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return null;
        }

        /// <summary>
        /// Create Security Worker Licence Application fingerprint
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licences-fingerprint")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceUpsertResponse> SaveWorkerLicenceFingerPrint([FromBody][Required] ProofOfFingerprintUpsertRequest fingerprint)
        {
            _logger.LogInformation("Get SaveWorkerLicenceFingerPrint");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return null;
        }

        /// <summary>
        /// Create Security Worker Licence Application PhotographOfYourself
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licences-fingerprint")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceUpsertResponse> SaveWorkerLicencePhotographOfYourself([FromBody][Required] PhotographOfYourselfUpsertRequest fingerprint)
        {
            _logger.LogInformation("Get SaveWorkerLicencePhotographOfYourself");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return null;
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