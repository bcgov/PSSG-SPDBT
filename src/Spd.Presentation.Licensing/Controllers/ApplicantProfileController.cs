
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Manager.Payment;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
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
        /// Get applicant profile
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/{id}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> ApplicantInfo(Guid id)
        {
            return await _mediator.Send(new GetApplicantProfileQuery(id));
        }

        //todo: add update endpoint here.

        /// <summary>
        /// Get applicants who has the same name and birthday as login person
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/search")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<IEnumerable<ApplicantListResponse>> SearchApplicantsSameAsloginUser()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            return await _mediator.Send(new ApplicantSearchCommand(info, false));
        }
    }



}