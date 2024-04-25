using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizLicensingController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        public BizLicensingController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Save Business Licence Application
        /// </summary>
        /// <param name="bizUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/business-licence")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<Unit> SaveBusinessLicenceApplication([FromBody][Required] BizLicenceAppUpsertRequest bizUpsertRequest, CancellationToken ct)
        {
            return default;
        }
    }
}