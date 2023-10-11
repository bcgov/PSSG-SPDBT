
using Microsoft.AspNetCore.Mvc;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class WorkerLicensingController : ControllerBase
    {
        private readonly ILogger<WorkerLicensingController> _logger;

        public WorkerLicensingController(ILogger<WorkerLicensingController> logger)
        {
            _logger = logger;
        }
    }
}