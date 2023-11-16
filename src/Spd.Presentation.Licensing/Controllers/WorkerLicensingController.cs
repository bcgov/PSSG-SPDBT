
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Licence;
using Spd.Manager.Cases.Screening;
using Spd.Presentation.Licensing.Configurations;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class WorkerLicensingController : ControllerBase
    {
        private readonly ILogger<WorkerLicensingController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<WorkerLicenceAppSubmitRequest> _wslSubmitValidator;

        public WorkerLicensingController(ILogger<WorkerLicensingController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<WorkerLicenceAppSubmitRequest> wslSubmitValidator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _wslSubmitValidator = wslSubmitValidator;
        }

        #region bcsc authenticated
        /// <summary>
        /// Create Security Worker Licence Application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceAppUpsertResponse> SaveSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceAppUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceAppUpsertRequest");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest, info.Sub));
        }

        /// <summary>
        /// Get Security Worker Licence Application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}")]
        [HttpGet]
        public async Task<WorkerLicenceResponse> GetSecurityWorkerLicenceApplication([FromRoute][Required] Guid licenceAppId)
        {
            return await _mediator.Send(new GetWorkerLicenceQuery(licenceAppId));
        }


        /// <summary>
        /// Upload licence application files
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="licenceAppId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}/files")]
        [HttpPost]
        [DisableRequestSizeLimit]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<LicenceAppDocumentResponse>> UploadLicenceAppFiles([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid licenceAppId, CancellationToken ct)
        {
            UploadFileConfiguration? fileUploadConfig = _configuration.GetSection("UploadFile").Get<UploadFileConfiguration>();
            if (fileUploadConfig == null)
                throw new ConfigurationErrorsException("UploadFile configuration does not exist.");

            var applicantInfo = _currentUser.GetBcscUserIdentityInfo();

            //validation files
            foreach (IFormFile file in fileUploadRequest.Documents)
            {
                string? fileexe = FileNameHelper.GetFileExtension(file.FileName);
                if (!fileUploadConfig.AllowedExtensions.Split(",").Contains(fileexe, StringComparer.InvariantCultureIgnoreCase))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, $"{file.FileName} file type is not supported.");
                }
                long fileSize = file.Length;
                if (fileSize > fileUploadConfig.MaxFileSizeMB * 1024 * 1024)
                {
                    throw new ApiException(HttpStatusCode.BadRequest, $"{file.Name} exceeds maximum supported file size {fileUploadConfig.MaxFileSizeMB} MB.");
                }
            }
            return await _mediator.Send(new CreateLicenceAppDocumentCommand(fileUploadRequest, applicantInfo.Sub, licenceAppId), ct);
        }

        /// <summary>
        /// Submit Security Worker Licence Application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/submit")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpPost]
        public async Task<WorkerLicenceAppUpsertResponse> SubmitSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceAppSubmitRequest licenceSubmitRequest, CancellationToken ct)
        {
            var validateResult = await _wslSubmitValidator.ValidateAsync(licenceSubmitRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));
            _logger.LogInformation("Get SubmitSecurityWorkerLicenceApplication");
            var info = _currentUser.GetBcscUserIdentityInfo();
            //temp: todo: process submit command
            return null;
            //return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceSubmitRequest, info.Sub));
        }

        #endregion

        #region anonymous APIs
        /// <summary>
        /// Create Security Worker Licence Application Anonymously
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/anonymous-worker-licences")]
        [HttpPost]
        public async Task<WorkerLicenceAppUpsertResponse> CreateWorkerLicenceAnonymously([FromBody][Required] WorkerLicenceAppUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get CreateWorkerLicenceAnonymously");
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest));
        }
        #endregion
    }

}