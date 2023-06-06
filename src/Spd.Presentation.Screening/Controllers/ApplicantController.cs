using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Cases;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ManagerContract;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spd.Presentation.Screening.Controllers
{

    public class ApplicantController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IValidator<ApplicationCreateRequest> _appCreateRequestValidator;

        public ApplicantController(IMediator mediator,
            IValidator<ApplicationCreateRequest> appCreateRequestValidator,
            IValidator<ApplicationCreateRequestFromBulk> appCreateRequestFromBulkValidator,
            IConfiguration configuration)
        {
            _mediator = mediator;
            _appCreateRequestValidator = appCreateRequestValidator;
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
        /// create application. if checkDuplicate is true, it will check if there is existing duplicated applications 
        /// </summary>
        /// <param name="createApplication"></param>
        /// <param name="orgId">organizationId</param>
        /// <returns></returns>
        [Authorize(Policy = "OnlyBcsc")]
        [Route("api/applicants/screenings")]
        [HttpPost]
        public async Task<ApplicationCreateResponse> CreateApplication([FromForm][Required] ApplicantAppCreateRequest createApplication, [FromRoute] Guid orgId)
        {
            //return await _mediator.Send(new ApplicationCreateCommand(appCreateRequest, orgId));
            return null;
        }

        #endregion
    }

    public record ApplicantAppCreateRequest: ApplicationCreateRequest
    {
        public Guid AppInviteId { get; set; }
    }
}

