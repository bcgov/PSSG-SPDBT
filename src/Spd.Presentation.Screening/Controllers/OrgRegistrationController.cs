using Microsoft.AspNetCore.Mvc;
using Spd.Infrastructure.Common;
using Spd.Manager.Membership;
using Spd.Manager.Membership.ViewModels;
using Spd.Utilities.Messaging.Contract;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class OrgRegistrationController : ControllerBase
    {
        private readonly ILogger<OrgRegistrationController> _logger;

        public OrgRegistrationController(ILogger<OrgRegistrationController> logger)
        {
            _logger = logger;
        }

        [Route("api/org-registrations")]
        [HttpPost]
        public async Task<ActionResult> Register([FromBody][Required] OrgRegistrationCreateRequest orgRegistrationCreateRequest)
        {
            var ctx = AppExecutionContext.Current;

            var bus = ctx.Services.GetRequiredService<IBus>();

            await bus.Send(new CreateOrgRegistrationCommand(orgRegistrationCreateRequest));

            return Ok();
        }
    }
}