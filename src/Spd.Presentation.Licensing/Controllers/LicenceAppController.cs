using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Licensing.Controllers
{
    /// <summary>
    /// </summary>
    public class LicenceAppController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PaymentController> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mediator"></param>
        /// <param name="logger"></param>
        public LicenceAppController(IMediator mediator,
            ILogger<PaymentController> logger
            )
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Get List of draft or InProgress Security Worker Licence Application or Permit Application
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/{applicantId}/licence-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<IEnumerable<LicenceAppListResponse>> GetApplicantLicenceApplications(Guid applicantId, CancellationToken ct)
        {
            return await _mediator.Send(new GetLicenceAppListQuery(applicantId), ct);
        }

        /// <summary>
        /// Get List of draft or InProgress Security Business Licence Application
        /// </summary>
        /// <returns></returns>
        [Route("api/bizs/{bizId}/licence-applications")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpGet]
        public async Task<IEnumerable<LicenceAppListResponse>> GetBizLicenceApplications(Guid bizId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizLicAppListQuery(bizId), ct);
        }

        /// <summary>
        /// Cancel Draft Application
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applications/{appId}")]
        [HttpDelete]
        [Authorize(Policy = "BcscBCeID")]
        public async Task<ActionResult> CancelDraftApplication([FromRoute] Guid appId, CancellationToken ct)
        {
            await _mediator.Send(new CancelDraftApplicationCommand(appId), ct);
            return Ok();
        }
    }
}