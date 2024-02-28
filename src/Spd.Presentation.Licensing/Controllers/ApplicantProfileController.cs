
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Payment;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class ApplicantProfileController : SpdControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public ApplicantProfileController(ILogger<LoginController> logger, IPrincipal currentUser, IMediator mediator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// Get Applicant Profile Info
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/{id}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> ApplicantInfo(Guid id)
        {
            return await _mediator.Send(new GetApplicantProfileQuery(id));
        }

        /// <summary>
        /// Update Applicant Profile Info
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/{id}")]
        [HttpPut]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<Guid?> UpdateApplicantInfo([FromRoute]Guid id, [FromBody][Required]ApplicantProfileUpdateRequest applicantProfileUpdateRequest)
        {
            //to be implemented.
            return null;
        }
    }



}