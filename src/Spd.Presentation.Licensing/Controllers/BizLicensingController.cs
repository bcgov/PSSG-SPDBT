

using Microsoft.AspNetCore.Mvc;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizLicensingController : ControllerBase
    {
        private readonly ILogger<BizLicensingController> _logger;

        public BizLicensingController(ILogger<BizLicensingController> logger)
        {
            _logger = logger;
        }
    }
}