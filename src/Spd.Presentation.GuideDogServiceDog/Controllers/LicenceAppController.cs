using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;

namespace Spd.Presentation.GuideDogServiceDog.Controllers
{
    /// <summary>
    /// </summary>
    public class LicenceAppController : SpdControllerBase
    {
        private readonly IMediator _mediator;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mediator"></param>
        /// <param name="logger"></param>
        public LicenceAppController(IMediator mediator
            )
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get List of draft or InProgress dog certification Application
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/{applicantId}/dog-certification-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<IEnumerable<LicenceAppListResponse>> GetGDSDApplications(Guid applicantId, CancellationToken ct)
        {
            return await _mediator.Send(new GetLicenceAppListQuery(applicantId, AppScopeCode.DogCertificationApp), ct);
        }

        /// <summary>
        /// Cancel Draft Application
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applications/{appId}")]
        [HttpDelete]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ActionResult> CancelDraftApplication([FromRoute] Guid appId, CancellationToken ct)
        {
            await _mediator.Send(new CancelDraftApplicationCommand(appId), ct);
            return Ok();
        }
    }
}