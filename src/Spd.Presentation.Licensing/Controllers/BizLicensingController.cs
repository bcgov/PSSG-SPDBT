using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.Cache;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IValidator<BizLicAppUpsertRequest> _bizLicAppUpsertValidator;

        public BizLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<BizLicAppUpsertRequest> bizLicAppUpsertValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _bizLicAppUpsertValidator = bizLicAppUpsertValidator;
        }

        /// <summary>
        /// Get Business Licence Application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{licenceAppId}")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpGet]
        public async Task<BizLicAppResponse> GetBizLicenceApplication([FromRoute][Required] Guid licenceAppId)
        {
            return await _mediator.Send(new GetBizLicAppQuery(licenceAppId));
        }

        /// <summary>
        /// Save Business Licence Application
        /// </summary>
        /// <param name="bizUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/business-licence-application")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpPost]
        public async Task<BizLicAppCommandResponse> SaveBusinessLicenceApplication([FromBody][Required] BizLicAppUpsertRequest bizUpsertRequest, CancellationToken ct)
        {
            if (bizUpsertRequest.BizId == Guid.Empty)
                throw new ApiException(HttpStatusCode.BadRequest, "must have business");
            return await _mediator.Send(new BizLicAppUpsertCommand(bizUpsertRequest), ct);
        }

        /// <summary>
        /// Upload business licence application files to transient storage
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="licenceAppId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{licenceAppId}/files")]
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
        [Route("api/business-licence-application/change")]
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
        /// Get Biz Application controlling members and employees, controlling member includes swl and non-swl
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{bizId}/{applicationId}/members")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<Members> GetMembers([FromRoute] Guid bizId, [FromRoute] Guid applicationId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizMembersQuery(bizId, applicationId), ct);
        }

        /// <summary>
        /// Upsert Biz Application controlling members and employees, controlling members include swl and non-swl
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{bizId}/{applicationId}/members")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<ActionResult> UpsertMembers([FromRoute] Guid bizId, [FromRoute] Guid applicationId, [FromBody] MembersRequest members, CancellationToken ct)
        {
            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(members.ControllingMemberDocumentKeyCodes, ct);
            await _mediator.Send(new UpsertBizMembersCommand(bizId, applicationId, members, newDocInfos), ct);
            return Ok();
        }

        ///<summary>
        /// Uploading file only save files in cache, the files are not connected to the biz and application yet.
        /// this is used for uploading member files or update, renew, replace.
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{bizId}/{applicationId}/files")]
        [HttpPost]
        [Authorize(Policy = "OnlyBcsc")]
        [RequestSizeLimit(26214400)] //25M
        public async Task<Guid> UploadFilesToCache([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, CancellationToken ct)
        {
            VerifyFiles(fileUploadRequest.Documents);

            CreateDocumentInCacheCommand command = new(fileUploadRequest);
            var newFileInfos = await _mediator.Send(command, ct);
            Guid fileKeyCode = Guid.NewGuid();
            await Cache.Set<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(20));
            return fileKeyCode;
        }

        /// <summary>
        /// Submit Business Licence Application
        /// </summary>
        /// <param name="bizUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/submit")]
        [Authorize(Policy = "OnlyBceid")]
        [HttpPost]
        public async Task<BizLicAppCommandResponse> SubmitBusinessLicenceApplication([FromBody][Required] BizLicAppUpsertRequest bizUpsertRequest, CancellationToken ct)
        {
            var validateResult = await _bizLicAppUpsertValidator.ValidateAsync(bizUpsertRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            return await _mediator.Send(new BizLicAppSubmitCommand(bizUpsertRequest), ct);
        }
    }
}