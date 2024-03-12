using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Licensing.Controllers
{
    /// <summary>
    /// </summary>
    public class ApplicantLicenceAppController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PaymentController> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mediator"></param>
        /// <param name="logger"></param>
        public ApplicantLicenceAppController(IMediator mediator,
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
        public async Task<IEnumerable<LicenceAppListResponse>> GetLicenceApplications(Guid applicantId, CancellationToken ct)
        {
            return await _mediator.Send(new GetLicenceAppListQuery(applicantId), ct);
        }
    }


}