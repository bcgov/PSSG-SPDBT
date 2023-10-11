
using Microsoft.AspNetCore.Mvc;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly ILogger<UserProfileController> _logger;

        public UserProfileController(ILogger<UserProfileController> logger)
        {
            _logger = logger;
        }
    }
}