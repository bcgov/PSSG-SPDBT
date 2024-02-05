using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Configurations;
using Spd.Presentation.Licensing.Services;
using Spd.Utilities.Cache;
using Spd.Utilities.Recaptcha;
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
    public class BodyArmorPermitController : SpdControllerBase
    {
        private readonly ILogger<BodyArmorPermitController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<BodyArmorAppAnonymousSubmitRequestJson> _anonymousLicenceAppSubmitRequestValidator;
        private readonly IMapper _mapper;
        private readonly IRecaptchaVerificationService _recaptchaVerificationService;
        private readonly IDistributedCache _cache;

        public BodyArmorPermitController(ILogger<BodyArmorPermitController> logger,
            IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<BodyArmorAppAnonymousSubmitRequestJson> anonymousLicenceAppSubmitRequestValidator,
            IMultipartRequestService multipartRequestService,
            IMapper mapper,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
            _configuration = configuration;
             _mapper = mapper;
            _recaptchaVerificationService = recaptchaVerificationService;
            _cache = cache;
            _anonymousLicenceAppSubmitRequestValidator = anonymousLicenceAppSubmitRequestValidator;
        }

        #region anonymous 
        /// <summary>
        /// Upload body armor application first step: frontend needs to make this first request to get a Guid code.
        /// </summary>
        /// <param name="ct"></param>
        /// <returns>Guid: keyCode</returns>
        [Route("api/body-armor-applications/anonymous/keyCode")]
        [HttpPost]
        public async Task<Guid> GetBodyArmorAppSubmissionAnonymousCode([FromBody] GoogleRecaptcha recaptcha, CancellationToken ct)
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
        /// Upload Body Armor application files: frontend use the keyCode to upload following files.
        /// Uploading file only save files in cache, the files are not connected to the appliation yet.
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="keyCode"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/body-armor-applications/anonymous/{keyCode}/files")]
        [HttpPost]
        [RequestSizeLimit(26214400)] //25M
        public async Task<Guid> UploadBodyArmorAppFilesAnonymous([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, [FromRoute] Guid keyCode, CancellationToken ct)
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
        /// Submit Body Armor Permit Application Json part Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// </summary>
        /// <param name="jsonRequest">WorkerLicenceAppAnonymousSubmitRequestJson data</param>
        /// <returns></returns>
        [Route("api/body-armor-applications/anonymous/{keyCode}/submit")]
        [HttpPost]
        public async Task<BodyArmorAppCommandResponse> SubmitBodyArmorPermitApplicationJsonAnonymous(BodyArmorAppAnonymousSubmitRequestJson jsonRequest, Guid keyCode, CancellationToken ct)
        {
            //validate keyCode
            if (await _cache.Get<LicenceAppDocumentsCache?>(keyCode.ToString()) == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invalid key code.");
            }

            _logger.LogInformation("validate payload");
            var validateResult = await _anonymousLicenceAppSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                AnonymousBodyArmorAppNewCommand command = new(jsonRequest, keyCode);
                return await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Replacement)
            {
                AnonymousBodyArmorAppReplaceCommand command = new(jsonRequest, keyCode);
                return await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                AnonymousBodyArmorAppRenewCommand command = new(jsonRequest, keyCode);
                return await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                AnonymousBodyArmorAppUpdateCommand command = new(jsonRequest, keyCode);
                return await _mediator.Send(command, ct);
            }
            return null;
        }
        #endregion
    }
}