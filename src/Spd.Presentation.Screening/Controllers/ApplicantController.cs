using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases.Application;
using Spd.Manager.Cases.Payment;
using Spd.Presentation.Screening.Configurations;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ManagerContract;
using Spd.Utilities.Shared.Tools;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Globalization;
using System.Net;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    public class ApplicantController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPrincipal _currentUser;
        private readonly IRecaptchaVerificationService _verificationService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ApplicationController> _logger;
        private readonly IMapper _mapper;

        public ApplicantController(IMediator mediator,
            IPrincipal currentUser,
            IRecaptchaVerificationService verificationService,
            IConfiguration configuration,
            ILogger<ApplicationController> logger,
            IMapper mapper)
        {
            _mediator = mediator;
            _currentUser = currentUser;
            _verificationService = verificationService;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
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
        [DisableRequestSizeLimit]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<ApplicantAppFileCreateResponse>> UploadApplicantAppFiles([FromForm][Required] ApplicantAppFileUploadRequest fileUploadRequest, [FromRoute] Guid applicationId, CancellationToken ct)
        {
            UploadFileConfiguration? fileUploadConfig = _configuration.GetSection("UploadFile").Get<UploadFileConfiguration>();
            if (fileUploadConfig == null)
                throw new ConfigurationErrorsException("UploadFile configuration does not exist.");

            var applicantInfo = _currentUser.GetApplicantIdentityInfo();

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
            if (fileUploadRequest.FileType != FileTypeCode.ApplicantInformation && fileUploadRequest.Files.Count > 1)
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"Only 1 file upload allowed.");
            }
            if (fileUploadRequest.FileType == FileTypeCode.ApplicantInformation && fileUploadRequest.Files.Count > fileUploadConfig.MaxAllowedNumberOfFiles)
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"Maximum {fileUploadConfig.MaxAllowedNumberOfFiles} files upload allowed.");
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
        public async Task<FileStreamResult> DownloadFileTemplate([FromQuery][Required] FileTemplateTypeCode fileTemplateType)
        {
            FileResponse response = await _mediator.Send(new FileTemplateQuery(fileTemplateType));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion

        #region applicant-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="ApplicantPaymentLinkCreateRequest">which include Payment link create request</param>
        /// <returns></returns>
        [Route("api/applicants/screenings/{applicationId}/payment-link")]
        [HttpPost]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<PaymentLinkResponse> GetPaymentLink([FromBody][Required] ApplicantPaymentLinkCreateRequest paymentLinkCreateRequest)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/applicants/screenings/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/screenings/payment-result")]
        [HttpGet]
         public async Task<ActionResult> ProcessPaymentResult([FromQuery]PaybcPaymentResultViewModel paybcResult)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _configuration.GetValue<string>("ApplicantPortalPaymentSuccessPath");
            string? failPath = _configuration.GetValue<string>("ApplicantPortalPaymentFailPath");

            PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);
            var paymentId = await _mediator.Send(new PaymentUpdateCommand(Request.QueryString.ToString(), paybcPaymentResult));
            if(paybcPaymentResult.Success)
            {
                return Redirect($"{hostUrl}{successPath}{paymentId}");
            }
            else
            {
                return Redirect($"{hostUrl}{failPath}{paymentId}");
            }
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/screenings/payments/{paymentId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<PaymentResponse> GetPaymentResult([FromRoute]Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
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

public class PaybcPaymentResultViewModel
{
    public int trnApproved { get; set; }
    public string? messageText { get; set; }
    public string? cardType { get; set; }
    public string? trnOrderId { get; set; }
    public string? trnAmount { get; set; }
    public string? paymentMethod { get; set; }
    public string? trnDate { get; set; }
    public string? ref1 { get; set; }
    public string? ref2 { get; set; }
    public string? ref3 { get; set; }
    public string? pbcTxnNumber { get; set; }
    public string? trnNumber { get; set; }
    public string? hashValue { get; set; }
    public string? pbcRefNumber { get; set; }
    public string? glDate { get; set; }
    public string? paymentAuthCode { get; set; }
    public string? revenue { get; set; }
}



