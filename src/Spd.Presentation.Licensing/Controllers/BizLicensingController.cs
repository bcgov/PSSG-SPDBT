using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Utilities.LogonUser;
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
        private readonly IValidator<BizLicAppSubmitRequest> _bizLicAppSubmitValidator;

        public BizLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<BizLicAppUpsertRequest> bizLicAppUpsertValidator,
            IValidator<BizLicAppSubmitRequest> bizLicAppSubmitValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
            _bizLicAppUpsertValidator = bizLicAppUpsertValidator;
            _bizLicAppSubmitValidator = bizLicAppSubmitValidator;
        }

        /// <summary>
        /// Get Business Licence Application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{licenceAppId}")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpGet]
        public async Task<BizLicAppResponse> GetBizLicenceApplication([FromRoute][Required] Guid licenceAppId, CancellationToken ct)
        {
            BizLicAppResponse response = await _mediator.Send(new GetBizLicAppQuery(licenceAppId));
            return response;
        }

        /// <summary>
        /// Get Lastest Security Business Licence Application
        /// </summary>
        /// <param name="applicantId"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/app-latest")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpGet]
        public async Task<BizLicAppResponse> GetLatestBizLicenceApplication([FromRoute][Required] Guid bizId)
        {
            return await _mediator.Send(new GetLatestBizLicenceAppQuery(bizId));
        }

        /// <summary>
        /// Save Business Licence Application
        /// </summary>
        /// <param name="bizUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/business-licence-application")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpPost]
        public async Task<BizLicAppCommandResponse> SaveBusinessLicenceApplication([FromBody][Required] BizLicAppUpsertRequest bizUpsertRequest, CancellationToken ct)
        {
            if (bizUpsertRequest.BizId == Guid.Empty)
                throw new ApiException(HttpStatusCode.BadRequest, "must have business");

            bizUpsertRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            bizUpsertRequest.SubmittedByPortalUserId = Guid.Parse(_currentUser.GetUserId());
            return await _mediator.Send(new BizLicAppUpsertCommand(bizUpsertRequest), ct);
        }

        /// <summary>
        /// Submit Biz licence update, renew and replace
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="request">BizLicAppSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/change")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpPost]
        public async Task<BizLicAppCommandResponse?> ChangeOnBizLicApp(BizLicAppSubmitRequest request, CancellationToken ct)
        {
            BizLicAppCommandResponse? response = null;
            request.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(request.DocumentKeyCodes, ct);

            var validateResult = await _bizLicAppSubmitValidator.ValidateAsync(request, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

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
        /// Submit Business Licence Application
        /// </summary>
        /// <param name="bizUpsertRequest"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/submit")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpPost]
        public async Task<BizLicAppCommandResponse> SubmitBusinessLicenceApplication([FromBody][Required] BizLicAppUpsertRequest bizUpsertRequest, CancellationToken ct)
        {
            var validateResult = await _bizLicAppUpsertValidator.ValidateAsync(bizUpsertRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            bizUpsertRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            bizUpsertRequest.SubmittedByPortalUserId = Guid.Parse(_currentUser.GetUserId());
            var response = await _mediator.Send(new BizLicAppSubmitCommand(bizUpsertRequest), ct);

            //clear the cookie for the sole proprietor swl
            SetValueToResponseCookie(SessionConstants.AnonymousSoleProprietorApplicationContext, string.Empty);
            return response;
        }

        /// <summary>
        /// Get biz brand image from its documentId
        /// </summary>
        /// <param name="documentId"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/brand-image/{documentId}")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpGet]
        public async Task<FileStreamResult> GetBrandImage([FromRoute][Required] Guid documentId, CancellationToken ct)
        {
            FileResponse? response = await _mediator.Send(new BrandImageQuery(documentId), ct);
            MemoryStream content;
            string contentType;
            if (response == null)
            {
                content = new MemoryStream(Array.Empty<byte>());
                contentType = string.Empty;
            }
            else
            {
                content = new MemoryStream(response.Content);
                contentType = response.ContentType ?? "application/octet-stream";
            }

            return File(content, contentType, response?.FileName);
        }
    }
}