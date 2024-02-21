using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Configurations;
using Spd.Utilities.Cache;
using Spd.Utilities.Recaptcha;
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
    public class PermitController : SpdLicenceAnonymousControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IConfiguration _configuration;
        private readonly IValidator<PermitAppAnonymousSubmitRequest> _permitAppAnonymousSubmitRequestValidator;

        public PermitController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IValidator<PermitAppAnonymousSubmitRequest> permitAppAnonymousSubmitRequestValidator,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService)
        {
            _mediator = mediator;
            _configuration = configuration;
            _permitAppAnonymousSubmitRequestValidator = permitAppAnonymousSubmitRequestValidator;
        }

        #region anonymous 

        /// <summary>
        /// Get anonymous Permit Application, thus the licenseAppId is retreived from cookies.
        /// </summary>
        /// <returns></returns>
        [Route("api/permit-application")]
        [HttpGet]
        public async Task<PermitLicenceAppResponse> GetPermitApplicationAnonymous()
        {
            string licenceIdsStr = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationContext);
            string? licenceAppId;
            try
            {
                licenceAppId = licenceIdsStr.Split("*")[1];
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Unauthorized, "license app id is incorrect");
            }

            return await _mediator.Send(new GetPermitApplicationQuery(Guid.Parse(licenceAppId)));
        }

        /// <summary>
        /// Upload Body Armour or Armour Vehicle permit application first step: frontend needs to make this first request to get a Guid code.
        /// </summary>
        /// <param name="recaptcha"></param>
        /// <param name="ct"></param>
        /// <returns>Guid: keyCode</returns>
        [Route("api/permit-applications/anonymous/keyCode")]
        [HttpPost]
        public async Task<IActionResult> GetPermitAppSubmissionAnonymousCode([FromBody] GoogleRecaptcha recaptcha, CancellationToken ct)
        {
            await VerifyGoogleRecaptchaAsync(recaptcha, ct);
            string keyCode = Guid.NewGuid().ToString();
            await Cache.Set<LicenceAppDocumentsCache>(keyCode, new LicenceAppDocumentsCache(), TimeSpan.FromMinutes(20));
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, keyCode);
            return Ok();
        }

        /// <summary>
        /// Upload Body Armor or Armor Vehicle permit application files: frontend use the keyCode (which is in cookies) to upload following files.
        /// Uploading file only save files in cache, the files are not connected to the application yet.
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/permit-applications/anonymous/files")]
        [HttpPost]
        [RequestSizeLimit(26214400)] //25M
        public async Task<Guid> UploadPermitAppFilesAnonymous([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, CancellationToken ct)
        {
            string keyCode = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationSubmitKeyCode);
            //validate keyCode
            LicenceAppDocumentsCache? existingFileInfo = await Cache.Get<LicenceAppDocumentsCache?>(keyCode.ToString());
            if (existingFileInfo == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invalid key code.");
            }

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
            CreateDocumentInCacheCommand command = new CreateDocumentInCacheCommand(fileUploadRequest);
            var newFileInfos = await _mediator.Send(command, ct);
            Guid fileKeyCode = Guid.NewGuid();
            await Cache.Set<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(20));
            return fileKeyCode;
        }

        /// <summary>
        /// Submit Body Armor or Armor Vehicle permit application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="jsonRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/permit-applications/anonymous/submit")]
        [HttpPost]
        public async Task<PermitAppCommandResponse?> SubmitPermitApplicationAnonymous(PermitAppAnonymousSubmitRequest jsonRequest, CancellationToken ct)
        {
            string keyCode = GetInfoFromRequestCookie(SessionConstants.AnonymousApplicationSubmitKeyCode);
            //validate keyCode
            LicenceAppDocumentsCache? keyCodeValue = await Cache.Get<LicenceAppDocumentsCache?>(keyCode.ToString());
            if (keyCodeValue == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invalid key code.");
            }

            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(jsonRequest.DocumentKeyCodes, ct);
            var validateResult = await _permitAppAnonymousSubmitRequestValidator.ValidateAsync(jsonRequest, ct);
            if (!validateResult.IsValid)
                throw new ApiException(HttpStatusCode.BadRequest, JsonSerializer.Serialize(validateResult.Errors));

            PermitAppCommandResponse? response = null;
            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.New)
            {
                AnonymousPermitAppNewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Renewal)
            {
                AnonymousPermitAppRenewCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);
            }

            if (jsonRequest.ApplicationTypeCode == ApplicationTypeCode.Update)
            {
                AnonymousPermitAppUpdateCommand command = new(jsonRequest, newDocInfos);
                response = await _mediator.Send(command, ct);

            }
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationSubmitKeyCode, String.Empty);
            SetValueToResponseCookie(SessionConstants.AnonymousApplicationContext, String.Empty);
            return response;
        }
        #endregion
    }
}