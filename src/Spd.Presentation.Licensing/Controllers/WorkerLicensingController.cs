using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Membership.UserProfile;
using Spd.Presentation.Licensing.Configurations;
using Spd.Presentation.Licensing.Services;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class WorkerLicensingController : SpdControllerBase
    {
        private readonly ILogger<WorkerLicensingController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<WorkerLicenceAppSubmitRequest> _wslSubmitValidator;
        private readonly IValidator<AnonymousWorkerLicenceSubmitCommand> _anonymousWslCommandValidator;
        private readonly IMultipartRequestService _multipartRequestService;
        private readonly IMapper _mapper;

        public WorkerLicensingController(ILogger<WorkerLicensingController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<WorkerLicenceAppSubmitRequest> wslSubmitValidator,
            IValidator<AnonymousWorkerLicenceSubmitCommand> anonymousWslCommandValidator,
            IMultipartRequestService multipartRequestService,
            IMapper mapper)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _wslSubmitValidator = wslSubmitValidator;
            _multipartRequestService = multipartRequestService;
            _mapper = mapper;
            _anonymousWslCommandValidator = anonymousWslCommandValidator;
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
        [RequestSizeLimit(26214400)] //25M
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
                string? fileexe = FileHelper.GetFileExtension(file.FileName);
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
        /// <param name="WorkerLicenceAppSubmitRequest"></param>
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
            return await _mediator.Send(new WorkerLicenceSubmitCommand(licenceSubmitRequest, info.Sub));
        }


        /// <summary>
        /// Get List of draft or InProgress Security Worker Licence Application
        /// </summary>
        /// <returns></returns>
        [Route("api/worker-licence-applications")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<IEnumerable<WorkerLicenceAppListResponse>> GetLicenceApplications(CancellationToken ct)
        {
            _logger.LogInformation("Get GetLicenceApplications");
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new GetApplicantProfileQuery(info.Sub));
            if (response == null)
            {
                //no contact found for this person
                return Array.Empty<WorkerLicenceAppListResponse>();
            }
            return await _mediator.Send(new GetWorkerLicenceAppListQuery(response.ApplicantId));
        }
        #endregion

        #region anonymous APIs
        /// <summary>
        /// Submit Security Worker Licence Application Anonymously
        /// </summary>
        /// <param name="WorkerLicenceAppAnonymousSubmitRequest"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/submit/anonymous")]
        [HttpPost]
        [DisableFormValueModelBinding]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<WorkerLicenceAppUpsertResponse> SubmitSecurityWorkerLicenceApplicationAnonymous(CancellationToken ct)
        {
            ICollection<UploadFileInfo> uploadedFileInfoList = null;

            try
            {
                _logger.LogInformation("Get SubmitSecurityWorkerLicenceApplicationAnonymous");
                var request = HttpContext.Request;
                var (model, uploadFileInfoList) = await _multipartRequestService.UploadMultipleFilesAsync<WorkerLicenceAppAnonymousSubmitRequest>(request, ModelState);
                uploadedFileInfoList = uploadFileInfoList;
                AnonymousWorkerLicenceSubmitCommand command = new AnonymousWorkerLicenceSubmitCommand(
                    model, 
                    _mapper.Map<ICollection<UploadFileRequest>>(uploadFileInfoList));
                var validateResult = await _anonymousWslCommandValidator.ValidateAsync(command, ct);
                if (!validateResult.IsValid)
                    throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

                return await _mediator.Send(command);
            }
            catch(ApiException ex)
            {
                throw ex;
            }
            finally
            {
                //cleanup the temp file
                if (uploadedFileInfoList != null)
                {
                    var existingFiles = uploadedFileInfoList.Where(f => System.IO.File.Exists(f.FilePath));

                    foreach (UploadFileInfo uploadedFileInfo in existingFiles)
                        System.IO.File.Delete(uploadedFileInfo.FilePath);
                }
            }
        }
        #endregion
    }

}