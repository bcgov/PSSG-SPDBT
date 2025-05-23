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
    public class SecurityWorkerLicensingController : SpdLicenceControllerBase
    {
        private readonly ILogger<SecurityWorkerLicensingController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<WorkerLicenceAppUpsertRequest> _wslUpsertValidator;
        private readonly IValidator<WorkerLicenceAppSubmitRequest> _anonymousLicenceAppSubmitRequestValidator;

        public SecurityWorkerLicensingController(ILogger<SecurityWorkerLicensingController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<WorkerLicenceAppUpsertRequest> wslUpsertValidator,
            IValidator<WorkerLicenceAppSubmitRequest> anonymousLicenceAppSubmitRequestValidator,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider,
            IRecaptchaVerificationService recaptchaVerificationService) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _wslUpsertValidator = wslUpsertValidator;
            _anonymousLicenceAppSubmitRequestValidator = anonymousLicenceAppSubmitRequestValidator;
        }

        #region bcsc authenticated

        /// <summary>
        /// Create Security Worker Licence Application, the DocumentInfos under WorkerLicenceAppUpsertRequest should contain all documents this application needs. If the document
        /// is not needed for this application, then remove it from documentInfos.
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceCommandResponse> SaveSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceAppUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceAppUpsertRequest");
            if (licenceCreateRequest.ApplicantId == null)
                throw new ApiException(HttpStatusCode.BadRequest, "must have applicant");
            licenceCreateRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest));
        }

        /// <summary>
        /// Get Security Worker Licence Application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}")]
        [Authorize(Policy = "BcscBCeID")]
        [HttpGet]
        public async Task<WorkerLicenceAppResponse> GetSecurityWorkerLicenceApplication([FromRoute][Required] Guid licenceAppId)
        {
            return await _mediator.Send(new GetWorkerLicenceQuery(licenceAppId));
        }

        /// <summary>
        /// Get Lastest Security Worker Licence Application
        /// </summary>
        /// <param name="applicantId"></param>
        /// <returns></returns>
        [Route("api/applicants/{applicantId}/swl-latest")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<WorkerLicenceAppResponse> GetLatestSecurityWorkerLicenceApplication([FromRoute][Required] Guid applicantId)
        {
            Guid id = await _mediator.Send(new GetLatestWorkerLicenceApplicationIdQuery(applicantId));
            return await _mediator.Send(new GetWorkerLicenceQuery(id));
        }

        /// <summary>
        /// Submit Security Worker Licence Application
        /// </summary>
        /// <param name="licenceSubmitRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceCommandResponse> SubmitSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceAppUpsertRequest licenceSubmitRequest, CancellationToken ct)
        {
            var validateResult = await _wslUpsertValidator.ValidateAsync(licenceSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            licenceSubmitRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            _logger.LogInformation("Get SubmitSecurityWorkerLicenceApplication");
            return await _mediator.Send(new WorkerLicenceSubmitCommand(licenceSubmitRequest));
        }

        /// <summary>
        /// Submit Security Worker Licence Application Json part for authenticated users, supports only: renewal, update and replace
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="jsonRequest">WorkerLicenceAppAnonymousSubmitRequestJson data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/authenticated/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceCommandResponse?> SubmitSecurityWorkerLicenceApplicationJsonAuthenticated(WorkerLicenceAppSubmitRequest jsonRequest, CancellationToken ct)
        {
            WorkerLicenceCommandResponse? response = null;
            jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.Portal;
            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _anonymousLicenceAppSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "New application type is not supported");
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                WorkerLicenceAppReplaceCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                WorkerLicenceAppRenewCommand command = new(jsonRequest, newDocInfos, true);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                WorkerLicenceAppUpdateCommand command = new(jsonRequest, newDocInfos, true);
                response = await _mediator.Send(command, ct);
            }

            return response;
        }

        #endregion bcsc authenticated

        #region anonymous

        /// <summary>
        /// Get Security Worker Licence Application, anonymous one, so, we get the licenceAppId from cookies.
        /// </summary>
        /// <returns></returns>
        [Route("api/worker-licence-application")]
        [HttpGet]
        public async Task<WorkerLicenceAppResponse> GetSecurityWorkerLicenceApplicationAnonymous()
        {
            string licenceIdsStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationContext);
            string? licenceAppId;
            try
            {
                licenceAppId = licenceIdsStr.Split("*")[1];
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "licence app id is incorrect");
            }
            return await _mediator.Send(new GetWorkerLicenceQuery(Guid.Parse(licenceAppId)));
        }

        /// <summary>
        /// Get Security Worker Licence SoleProprietor Application, anonymous one, so, we get the swlAppId from cookies.
        /// Used for sole proprietor, biz app is aborted, fe needs to get the swl application
        /// </summary>
        /// <returns></returns>
        [Route("api/sp-worker-licence-application")]
        [HttpGet]
        public async Task<WorkerLicenceAppResponse> GetSPSecurityWorkerLicenceApplicationAnonymous()
        {
            string swlApplicationId = GetInfoFromRequestCookie(SessionConstants.AnonymousSoleProprietorApplicationContext);
            return await _mediator.Send(new GetWorkerLicenceQuery(Guid.Parse(swlApplicationId)));
        }

        /// <summary>
        /// Submit Security Worker Licence Application Json part Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="jsonRequest">WorkerLicenceAppAnonymousSubmitRequestJson data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/anonymous/submit")]
        [HttpPost]
        public async Task<WorkerLicenceCommandResponse?> SubmitSecurityWorkerLicenceApplicationJsonAnonymous(WorkerLicenceAppSubmitRequest jsonRequest, CancellationToken ct)
        {
            await VerifyKeyCode();
            jsonRequest.ApplicationOriginTypeCode = ApplicationOriginTypeCode.WebForm;
            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _anonymousLicenceAppSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            WorkerLicenceCommandResponse? response = null;
            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                WorkerLicenceAppNewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                WorkerLicenceAppReplaceCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                WorkerLicenceAppRenewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                WorkerLicenceAppUpdateCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);

            //if it is sole proprietor, we have to support connect two flows together and we have to support user abort the second flow, user can still go back to the first flow.
            if (response?.LicenceAppId != null && (jsonRequest.BizTypeCode == BizTypeCode.NonRegisteredSoleProprietor || jsonRequest.BizTypeCode == BizTypeCode.RegisteredSoleProprietor))
            {
                SetValueToResponseCookie(SessionConstants.AnonymousSoleProprietorApplicationContext, response.LicenceAppId.ToString(), 180);
            }
            return response;
        }

        #endregion anonymous
    }
}