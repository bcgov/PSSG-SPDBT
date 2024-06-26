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
        /// Get Applicant most recent application for same service type
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/{applicantId}/licence-application")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<IEnumerable<LicenceAppListResponse>> GetLastestApplicantLicenceApplication(Guid applicantId, CancellationToken ct)
        {
            return await _mediator.Send(new GetLicenceAppListQuery(applicantId), ct);
        }
    }
}