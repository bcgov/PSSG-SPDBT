using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LicenceLookupController : SpdControllerBase
    {
        private readonly ILogger<LicenceLookupController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;

        public LicenceLookupController(
            ILogger<LicenceLookupController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
        }

        /// <summary>
        /// Get licence by licence number
        /// </summary>
        /// <param name="licenceNumber"></param>
        /// <returns></returns>
        [Route("api/licence-lookup/{licenceNumber}")]
        [HttpGet]
        public async Task<LicenceLookupResponse> GetLicenceLookup([FromRoute][Required] string licenceNumber)
        {
            return await _mediator.Send(new LicenceLookupQuery(licenceNumber));
        }

        /// <summary>
        /// Get licence by licence number and access code
        /// </summary>
        /// <param name="licenceNumber"></param>
        /// <param name="accessCode"></param>
        /// <returns></returns>
        [Route("api/licence-lookup/access-code")]
        [HttpGet]
        public async Task<LicenceLookupResponse> GetLicenceAccessCodeLookup([FromQuery][Required] string licenceNumber, [FromQuery][Required] string accessCode)
        {
            return await _mediator.Send(new LicenceAccessCodeLookupQuery(licenceNumber, accessCode));
        }
    }
}