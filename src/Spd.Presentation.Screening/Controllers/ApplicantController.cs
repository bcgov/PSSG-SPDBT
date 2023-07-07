using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ManagerContract;
using Spd.Utilities.Shared.Tools;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    public class ApplicantController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPrincipal _currentUser;
        private readonly IRecaptchaVerificationService _verificationService;

        public ApplicantController(IMediator mediator, IPrincipal currentUser, IRecaptchaVerificationService verificationService)
        {
            _mediator = mediator;
            _currentUser = currentUser;
            _verificationService = verificationService;
        }

        #region application-invites
        /// <summary>
        /// Verify if the current application invite is correct, and return needed info
        /// </summary>
        /// <param name="appInviteVerifyRequest">which include InviteEncryptedCode</param>
        /// <returns></returns>
        [Route("api/applicants/invites")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<AppOrgResponse> VerifyAppInvitation([FromBody][Required] AppInviteVerifyRequest appInviteVerifyRequest)
        {
            return await _mediator.Send(new ApplicationInviteVerifyCommand(appInviteVerifyRequest));
        }

        #endregion

        #region applicant-application

        /// <summary>
        /// create application
        /// </summary>
        /// <param name="appCreateRequest"></param>
        /// <returns></returns>
        [Authorize(Policy = "OnlyBcsc")]
        [Route("api/applicants/screenings")]
        [HttpPost]
        public async Task<ApplicationCreateResponse> CreateApplicantApp([FromBody] ApplicantAppCreateRequest appCreateRequest)
        {
            var applicantInfo = _currentUser.GetApplicantIdentityInfo();
            appCreateRequest.OriginTypeCode = ApplicationOriginTypeCode.Portal;

            //bcsc user name and birth date must be the same as name inside ApplicantAppCreateRequest          
            DateOnly requestBirthDate = DateOnly.FromDateTime(((DateTimeOffset)appCreateRequest.DateOfBirth).Date);
            if (!string.Equals(applicantInfo.FirstName, appCreateRequest.GivenName, StringComparison.InvariantCultureIgnoreCase) ||
                !string.Equals(applicantInfo.LastName, appCreateRequest.Surname, StringComparison.InvariantCultureIgnoreCase) ||
                applicantInfo.BirthDate != requestBirthDate)
                throw new ApiException(HttpStatusCode.BadRequest, "Submitted user pi data is different than bscs identity info data.");

            return await _mediator.Send(new ApplicantApplicationCreateCommand(appCreateRequest, applicantInfo.Sub));
        }

        /// <summary>
        /// anonymous applicant create application
        /// </summary>
        /// <param name="anonymAppCreateRequest"></param>
        /// <returns></returns>
        [Route("api/applicants/screenings/anonymous")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ApplicationCreateResponse> CreateApplicantAppAnonymous([FromBody] AnonymousApplicantAppCreateRequest anonymAppCreateRequest, CancellationToken ct)
        {
            if (anonymAppCreateRequest == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Request cannot be null");

            var isValid = await _verificationService.VerifyAsync(anonymAppCreateRequest.Recaptcha, ct);
            if (!isValid)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid recaptcha value");
            }

            anonymAppCreateRequest.OriginTypeCode = ApplicationOriginTypeCode.WebForm;
            return await _mediator.Send(new ApplicantApplicationCreateCommand(anonymAppCreateRequest));
        }

        /// <summary>
        /// Applicant checks for existing shareable clearance
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        /// GET api/applicants/clearances/shareable?withOrgId={withOrgId}&serviceType={serviceType}
        [Route("api/applicants/clearances/shareable")]
        [Authorize(Policy = "OnlyBcsc")]
        [HttpGet]
        public async Task<ShareableClearanceResponse> GetShareableClearanceWithOrg([FromQuery] Guid withOrgId, [FromQuery] ServiceTypeCode serviceType, CancellationToken ct)
        {
            var applicantInfo = _currentUser.GetApplicantIdentityInfo();
            return await _mediator.Send(new ShareableClearanceQuery(withOrgId, applicantInfo.Sub, serviceType), ct);
        }

        [Authorize(Policy = "OnlyBcsc")]
        [Route("api/applicants/{applicantId}/screenings")]
        [HttpGet]
        public async Task<ApplicantApplicationListResponse> ApplicantApplicationsList([FromRoute] Guid applicantId)
        {
            return await _mediator.Send(new ApplicantApplicationListQuery(applicantId));
        }
        #endregion

        #region userinfo
        /// <summary>
        /// used for Applicants logs in with BCSC to submit an application
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/userinfo")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantUserInfo> ApplicantUserInfo()
        {
            var info = _currentUser.GetApplicantIdentityInfo();
            string? str = info.Gender?.ToLower();
            GenderCode? gender = str switch
            {
                "female" => GenderCode.F,
                "male" => GenderCode.M,
                "diverse" => GenderCode.U,
                _ => null,
            };

            return new ApplicantUserInfo
            {
                Email = StringHelper.ToTitleCase(info.Email),
                EmailVerified = info.EmailVerified,
                Age = info.Age,
                BirthDate = new DateTimeOffset(info.BirthDate.Year, info.BirthDate.Month, info.BirthDate.Day, 0, 0, 0, TimeSpan.Zero),
                DisplayName = StringHelper.ToTitleCase(info.DisplayName),
                FirstName = StringHelper.ToTitleCase(info.FirstName),
                LastName = StringHelper.ToTitleCase(info.LastName),
                GenderCode = gender,
                Sub = info.Sub,
                MiddleName1 = StringHelper.ToTitleCase(info.MiddleName1),
                MiddleName2 = StringHelper.ToTitleCase(info.MiddleName2),
            };
        }

        #endregion

        #region applicant-file
        /// <summary>
        /// Get the list of all files the applicant has uploaded for the application.
        /// </summary>
        /// <returns></returns>
        [Authorize(Policy = "OnlyBcsc")]
        [Route("api/applicants/screenings/{applicationId}/files")]
        [HttpGet]
        public async Task<ApplicantApplicationFileListResponse> GetApplicantAppFiles([FromRoute] Guid applicationId)
        {
            var applicantInfo = _currentUser.GetApplicantIdentityInfo();

            return await _mediator.Send(new ApplicantApplicationFileQuery(applicationId, applicantInfo.Sub));
        }

        /// <summary>
        /// Upload applicant app files
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applicants/screenings/{applicationId}/files")]
        [HttpPost]
        public async Task<ApplicantAppFileCreateResponse> UploadApplicantAppFile([FromForm][Required] ApplicantAppFileUploadRequest fileUploadRequest, [FromRoute] Guid applicationId, CancellationToken ct)
        {
            var applicantInfo = _currentUser.GetApplicantIdentityInfo();

            //validation file
            string? fileexe = FileNameHelper.GetFileExtension(fileUploadRequest.File.FileName);
            if (!SpdConstants.VALID_UPLOAD_FILE_EXE.Contains(fileexe, StringComparer.InvariantCultureIgnoreCase))
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"file type is not supported.");
            }
            long fileSize = fileUploadRequest.File.Length;
            if (fileSize > SpdConstants.UPLOAD_FILE_MAX_SIZE)
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"max supported file size is {SpdConstants.UPLOAD_FILE_MAX_SIZE}.");
            }
            return await _mediator.Send(new CreateApplicantAppFileCommand(fileUploadRequest, applicantInfo.Sub, applicationId), ct);
        }

        /// <summary>
        /// download the template document
        /// </summary>
        /// <returns></returns>
        /// http://localhost/api/applicants/screenings/file-templates?fileTemplateType=FingerprintPkg
        [Authorize(Policy = "OnlyBcsc")]
        [Route("api/applicants/screenings/file-templates")]
        [HttpGet]
        public async Task<FileStreamResult> DownloadFileTemplate([FromQuery][Required] FileTemplateTypeCode fileTemplateType )
        {
            FileResponse response = await _mediator.Send(new FileTemplateQuery(fileTemplateType));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion
    }
}

/// <summary>
/// for Anonymous Applicant Application submission
/// </summary>
public record AnonymousApplicantAppCreateRequest : ApplicantAppCreateRequest
{
    public string Recaptcha { get; set; } = null!;
}

public class AnonymousApplicantAppCreateRequestValidator : AbstractValidator<AnonymousApplicantAppCreateRequest>
{
    public AnonymousApplicantAppCreateRequestValidator()
    {
        Include(new ApplicantAppCreateRequestValidator());
    }
}

public class ApplicantUserInfo
{
    public string? MiddleName2 { get; set; }
    public string? MiddleName1 { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public GenderCode? GenderCode { get; set; }
    public string? Age { get; set; }
    public string? Sub { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public bool? EmailVerified { get; set; }
}





