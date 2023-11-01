
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Licence;
using Spd.Presentation.Licensing.Configurations;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;


namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class WorkerLicensingController : ControllerBase
    {
        private readonly ILogger<WorkerLicensingController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;

        public WorkerLicensingController(ILogger<WorkerLicensingController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
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
        public async Task<WorkerLicenceUpsertResponse> SaveSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceUpsertRequest");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest, info.Sub));
        }

        /// <summary>
        /// Create Security Worker Licence Application
        /// </summary>
        /// <param name="licenceCreateRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}")]
        [HttpGet]
        public async Task<WorkerLicenceResponse> GetSecurityWorkerLicenceApplication([FromRoute][Required] Guid id)
        {
            return await _mediator.Send(new GetWorkerLicenceQuery(id));
        }


        /// <summary>
        /// Upload licence application files
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}/files")]
        [HttpPost]
        [DisableRequestSizeLimit]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<LicenceAppFileCreateResponse>> UploadLicenceAppFiles([FromForm][Required] LicenceAppFileUploadRequest fileUploadRequest, [FromRoute] Guid id, CancellationToken ct)
        {
            UploadFileConfiguration? fileUploadConfig = _configuration.GetSection("UploadFile").Get<UploadFileConfiguration>();
            if (fileUploadConfig == null)
                throw new ConfigurationErrorsException("UploadFile configuration does not exist.");

            var applicantInfo = _currentUser.GetBcscUserIdentityInfo();

            //validation files
            foreach (IFormFile file in fileUploadRequest.Files)
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
            return await _mediator.Send(new CreateLicenceAppFileCommand(fileUploadRequest, applicantInfo.Sub, id), ct);
        }

        /// <summary>
        /// Upload licence application files
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="licenceAppId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}/files/")]
        [HttpPost]
        [DisableRequestSizeLimit]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<LicenceAppFileResponse>> GetLicenceAppFiles([FromRoute] Guid licenceAppId, [FromRoute] LicenceDocumentTypeCode documentTypeCode, CancellationToken ct)
        {
            //var applicantInfo = _currentUser.GetBcscUserIdentityInfo();
            //return await _mediator.Send(new CreateLicenceAppFileCommand(fileUploadRequest, applicantInfo.Sub, licenceAppId), ct);
            return null;
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
        public async Task<WorkerLicenceUpsertResponse> CreateWorkerLicenceAnonymously([FromBody][Required] WorkerLicenceUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get CreateWorkerLicenceAnonymously");
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest));
        }
        #endregion
    }

}