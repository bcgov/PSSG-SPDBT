using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizLicensingController : SpdControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        public BizLicensingController(IPrincipal currentUser, IMediator mediator)
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
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<Unit> SaveBusinessLicenceApplication([FromBody][Required] BizLicenceAppUpsertRequest bizUpsertRequest, CancellationToken ct)
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
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<LicenceAppDocumentResponse>> UploadLicenceAppFiles([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid licenceAppId, CancellationToken ct)
        {
            VerifyFiles(fileUploadRequest.Documents);
            var applicantInfo = _currentUser.GetBcscUserIdentityInfo();

            return await _mediator.Send(new CreateDocumentInTransientStoreCommand(fileUploadRequest, applicantInfo.Sub, licenceAppId), ct);
        }
    }
}