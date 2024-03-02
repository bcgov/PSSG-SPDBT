
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;
using Spd.Utilities.Cache;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class ApplicantProfileController : SpdControllerBase
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<LoginController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public ApplicantProfileController(IDistributedCache cache,
            ILogger<LoginController> logger, 
            IPrincipal currentUser, 
            IMediator mediator)
        {
            _cache = cache;
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

        /// <summary>
        /// Upload files for applicant update.
        /// </summary>
        /// <param name="fileUploadRequest"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/applicant/profile-files")]
        [HttpPost]
        [Authorize(Policy = "OnlyBcsc")]
        [RequestSizeLimit(26214400)] //25M
        public async Task<Guid> UploadLicenceAppFiles([FromForm][Required] LicenceAppDocumentUploadRequest fileUploadRequest, CancellationToken ct)
        {
            //todo: add validation, should only be MentalHealthCondition or PoliceBackgroundLetterOfNoConflict
            //todo: add file size checking
            CreateDocumentInCacheCommand command = new CreateDocumentInCacheCommand(fileUploadRequest);
            var newFileInfos = await _mediator.Send(command, ct);
            Guid fileKeyCode = Guid.NewGuid();
            await _cache.Set<IEnumerable<LicAppFileInfo>>(fileKeyCode.ToString(), newFileInfos, TimeSpan.FromMinutes(30));
            return fileKeyCode;
        }
    }
}