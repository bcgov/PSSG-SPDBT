using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Screening.Controllers
{
    public class ApplicantController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPrincipal _currentUser;

        public ApplicantController(IMediator mediator, IPrincipal currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
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
        public async Task<AppInviteVerifyResponse> VerifyAppInvitation([FromBody][Required] AppInviteVerifyRequest appInviteVerifyRequest)
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
            return await _mediator.Send(new ApplicantApplicationCreateCommand(appCreateRequest, sub));
        }

        #endregion
    }
}

