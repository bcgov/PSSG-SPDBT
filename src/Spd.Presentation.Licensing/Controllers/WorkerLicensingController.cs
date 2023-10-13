
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.License;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;
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

        public WorkerLicensingController(ILogger<WorkerLicensingController> logger, IPrincipal currentUser)
        {
            _logger = logger;
            _currentUser = currentUser;
        }

        [Route("api/licenses")]
        [HttpPost]
        public async Task<WorkerLicenseCreateResponse> CreateWorkerLicense([FromForm][Required] WorkerLicenseCreateRequest createApplication)
        {
            var userId = this.HttpContext.User.GetUserId();
            if (userId == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);
            return null;
        }
    }
}