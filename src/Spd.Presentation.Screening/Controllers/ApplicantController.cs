using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
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

        #region application

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
            string? sub = _currentUser.GetBcscSub();
            if (sub == null)
            {
                throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "there is no sub from bcsc.");
            }
            appCreateRequest.OriginTypeCode = ApplicationOriginTypeCode.Portal;

            //add validation, appCreateRequest names must be the same as bcsc official name.
            return await _mediator.Send(new ApplicantApplicationCreateCommand(appCreateRequest, sub));
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
        #endregion
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
}

