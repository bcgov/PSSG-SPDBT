using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public BizLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// Save Business Licence Application
        /// </summary>
        /// <param name="bizUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/business-licence")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpPost]
        public async Task<Unit> SaveBusinessLicenceApplication([FromBody][Required] BizLicAppUpsertRequest bizUpsertRequest, CancellationToken ct)
        {
            return default;
        }

        /// <summary>
        /// Upload business licence application files to transient storage
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="licenceAppId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/{licenceAppId}/files")]
        [HttpPost]
        [RequestSizeLimit(26214400)] //25M
        [Authorize(Policy = "OnlyBceid")]
        public async Task<IEnumerable<LicenceAppDocumentResponse>> UploadLicenceAppFiles([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid licenceAppId, CancellationToken ct)
        {
            VerifyFiles(fileUploadRequest.Documents);

            return await _mediator.Send(new CreateDocumentInTransientStoreCommand(fileUploadRequest, null, licenceAppId), ct);
        }

        /// <summary>
        /// Get Business profile
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/{bizId}")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpGet]
        public async Task<BizProfileResponse> GetProfile([FromRoute] Guid bizId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizProfileQuery(bizId), ct);
        }
    }
}