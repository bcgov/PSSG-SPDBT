using Microsoft.AspNetCore.Mvc;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizLicensingController : SpdControllerBase
    {
        private readonly ILogger<BizLicensingController> _logger;

        public BizLicensingController(ILogger<BizLicensingController> logger)
        {
            _logger = logger;
        }
    }
}