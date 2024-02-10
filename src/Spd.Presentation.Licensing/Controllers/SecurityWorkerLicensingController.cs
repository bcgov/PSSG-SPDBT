using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Configurations;
using Spd.Presentation.Licensing.Services;
using Spd.Utilities.Cache;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class SecurityWorkerLicensingController : SpdControllerBase
    {
        private readonly ILogger<SecurityWorkerLicensingController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<WorkerLicenceAppSubmitRequest> _wslSubmitValidator;
        private readonly IValidator<WorkerLicenceAppAnonymousSubmitRequest> _anonymousLicenceAppSubmitRequestValidator;
        private readonly IMapper _mapper;
        private readonly IRecaptchaVerificationService _recaptchaVerificationService;
        private readonly IDistributedCache _cache;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public SecurityWorkerLicensingController(ILogger<SecurityWorkerLicensingController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<WorkerLicenceAppSubmitRequest> wslSubmitValidator,
            IValidator<WorkerLicenceAppAnonymousSubmitRequest> anonymousLicenceAppSubmitRequestValidator,
            IDataProtectionProvider dpProvider,
            IMapper mapper,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
            _wslSubmitValidator = wslSubmitValidator;
            _mapper = mapper;
            _recaptchaVerificationService = recaptchaVerificationService;
            _cache = cache;
            _anonymousLicenceAppSubmitRequestValidator = anonymousLicenceAppSubmitRequestValidator;
            _dataProtector = dpProvider.CreateProtector("AppAnonymousSubmitRequest").ToTimeLimitedDataProtector();
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
        public async Task<WorkerLicenceCommandResponse> SaveSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceAppUpsertRequest licenceCreateRequest)
        {
            _logger.LogInformation("Get WorkerLicenceAppUpsertRequest");
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new WorkerLicenceUpsertCommand(licenceCreateRequest, info.Sub));
        }

        /// <summary>
        /// Get Security Worker Licence Application
        /// </summary>
        /// <param name="licenceAppId"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/{licenceAppId}")]
        [Authorize(Policy = "OnlyBcsc")]
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
        public async Task<WorkerLicenceCommandResponse> SubmitSecurityWorkerLicenceApplication([FromBody][Required] WorkerLicenceAppSubmitRequest licenceSubmitRequest, CancellationToken ct)
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

        #region anonymous 

        /// <summary>
        /// Get Security Worker Licence Application, anonymous one, so, we get the licenceAppId from cookies.
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Route("api/worker-licence-application")]
        [HttpGet]
        public async Task<WorkerLicenceResponse> GetSecurityWorkerLicenceApplicationAnonymous()
        {
            string? licenceAppIdStr;
            Request.Cookies.TryGetValue("LicenceApplicationContext", out licenceAppIdStr);
            if (string.IsNullOrEmpty(licenceAppIdStr))
                throw new ApiException(HttpStatusCode.Unauthorized);
            string? licenceAppId;
            try
            {
                licenceAppId = _dataProtector.Unprotect(licenceAppIdStr);
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "licence app id is incorrect");
            }
            return await _mediator.Send(new GetWorkerLicenceQuery(Guid.Parse(licenceAppId)));
        }

        /// <summary>
        /// Upload licence application first step: frontend needs to make this first request to get a Guid code.
        /// </summary>
        /// <param name="ct"></param>
        /// <returns>Guid: keyCode</returns>
        [Route("api/worker-licence-applications/anonymous/keyCode")]
        [HttpPost]
        public async Task<Guid> GetLicenceAppSubmissionAnonymousCode([FromBody] GoogleRecaptcha recaptcha, CancellationToken ct)
        {
            _logger.LogInformation("do Google recaptcha verification");
            var isValid = await _recaptchaVerificationService.VerifyAsync(recaptcha.RecaptchaCode, ct);
            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha value");
            }
            Guid keyCode = Guid.NewGuid();
            await _cache.Set<LicenceAppDocumentsCache>(keyCode.ToString(), new LicenceAppDocumentsCache(), TimeSpan.FromMinutes(30));
            return keyCode;
        }

        /// <summary>
        /// Upload licence application files: frontend use the keyCode to upload following files.
        /// Uploading file only save files in cache, the files are not connected to the appliation yet.
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="keyCode"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/anonymous/{keyCode}/files")]
        [HttpPost]
        [RequestSizeLimit(26214400)] //25M
        public async Task<Guid> UploadLicenceAppFilesAnonymous([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid keyCode, CancellationToken ct)
        {
            UploadFileConfiguration? fileUploadConfig = _configuration.GetSection("UploadFile").Get<UploadFileConfiguration>();
            if (fileUploadConfig == null)
                throw new ConfigurationErrorsException("UploadFile configuration does not exist.");

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

            //validate keyCode
            LicenceAppDocumentsCache? existingFileInfo = await _cache.Get<LicenceAppDocumentsCache?>(keyCode.ToString());
            if (existingFileInfo == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invalid key code.");
            }

            CreateDocumentInCacheCommand command = new CreateDocumentInCacheCommand(fileUploadRequest);
            var newFileInfos = await _mediator.Send(command, ct);
            Guid fileKeyCode = Guid.NewGuid();
            await _cache.Set<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(30));
            return fileKeyCode;
        }

        /// <summary>
        /// Submit Security Worker Licence Application Json part Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="jsonRequest">WorkerLicenceAppAnonymousSubmitRequestJson data</param>
        /// <param name="keyCode"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/worker-licence-applications/anonymous/{keyCode}/submit")]
        [HttpPost]
        public async Task<WorkerLicenceCommandResponse> SubmitSecurityWorkerLicenceApplicationJsonAnonymous(WorkerLicenceAppAnonymousSubmitRequest jsonRequest, Guid keyCode, CancellationToken ct)
        {
            //validate keyCode
            if (await _cache.Get<LicenceAppDocumentsCache?>(keyCode.ToString()) == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invalid key code.");
            }

            _logger.LogInformation("validate payload");
            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _anonymousLicenceAppSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                AnonymousWorkerLicenceAppNewCommand command = new(jsonRequest, newDocInfos, keyCode);
                return await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                AnonymousWorkerLicenceAppReplaceCommand command = new(jsonRequest, newDocInfos, keyCode);
                return await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                AnonymousWorkerLicenceAppRenewCommand command = new(jsonRequest, newDocInfos, keyCode);
                return await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                AnonymousWorkerLicenceAppUpdateCommand command = new(jsonRequest, newDocInfos, keyCode);
                return await _mediator.Send(command, ct);
            }
            return null;
        }
        #endregion

        private async Task<IEnumerable<LicAppFileInfo>> GetAllNewDocsInfoAsync(IEnumerable<Guid> docKeyCodes, CancellationToken ct)
        {
            if (docKeyCodes == null || !docKeyCodes.Any()) return Enumerable.Empty<LicAppFileInfo>();
            List<LicAppFileInfo> results = new List<LicAppFileInfo>();
            foreach (Guid docKey in docKeyCodes)
            {
                IEnumerable<LicAppFileInfo> items = await _cache.Get<IEnumerable<LicAppFileInfo>>(docKey.ToString());
                if (items.Any())
                {
                    results.AddRange(items);
                }
            }
            return results;
        }
    }
}