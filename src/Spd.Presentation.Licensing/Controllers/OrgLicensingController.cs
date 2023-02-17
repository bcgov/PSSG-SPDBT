

using Microsoft.AspNetCore.Mvc;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class OrgLicensingController : ControllerBase
    {
        private readonly ILogger<OrgLicensingController> _logger;

        public OrgLicensingController(ILogger<OrgLicensingController> logger)
        {
            _logger = logger;
        }
    }
}