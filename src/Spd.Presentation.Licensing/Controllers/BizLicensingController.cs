using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
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
        /// Submit Biz licence update, renew and replace
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="request">BizLicAppSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/change")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpPost]
        public async Task<BizLicAppCommandResponse?> ChangeOnBizLicApp(BizLicAppChangeRequest request, CancellationToken ct)
        {
            BizLicAppCommandResponse? response = null;

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(request.DocumentKeyCodes, ct);

            //add validation here
            //var validateResult = await _permitAppAnonymousSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            //if (!validateResult.IsValid)
            //    throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            if (request.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "New application type is not supported");
            }

            if (request.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                BizLicAppReplaceCommand command = new(request, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (request.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                BizLicAppRenewCommand command = new(request, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (request.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                BizLicAppUpdateCommand command = new(request, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            return response;
        }


        /// <summary>
        /// Get Biz Application controlling members, include swl and non-swl
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/{bizId}/{applicationId}/controlling-members")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<ControllingMembers> GetControllerMembers([FromRoute] Guid bizId, [FromRoute] Guid applicationId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizControllerMembersQuery(bizId, applicationId), ct);
        }

        /// <summary>
        /// Upsert Biz Application controlling members, include swl and non-swl
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/{bizId}/{applicationId}/controlling-members")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<ActionResult> UpsertControllerMembers([FromRoute] Guid bizId, [FromRoute] Guid applicationId, [FromBody] ControllingMembers members, CancellationToken ct)
        {
            await _mediator.Send(new UpsertBizControllerMembersCommand(bizId, applicationId, members), ct);
            return Ok();
        }

        /// <summary>
        /// Get Biz Application employees
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/{bizId}/{applicationId}/employees")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<IEnumerable<SwlContactInfo>> GetEmployees([FromRoute] Guid bizId, [FromRoute] Guid applicationId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizEmployeesQuery(bizId, applicationId), ct);
        }

        /// <summary>
        /// Upsert Biz Application employees
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence/{bizId}/{applicationId}/employees")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<ActionResult> UpsertEmployees([FromRoute] Guid bizId, [FromRoute] Guid applicationId, [FromBody] IEnumerable<SwlContactInfo> employees, CancellationToken ct)
        {
            await _mediator.Send(new UpsertEmployeesCommand(bizId, applicationId, employees), ct);
            return Ok();
        }
    }
}