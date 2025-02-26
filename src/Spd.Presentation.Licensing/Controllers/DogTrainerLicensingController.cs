using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.Recaptcha;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class DogTrainerLicensingController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public DogTrainerLicensingController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
        }

        #region anonymous

        /// <summary>
        /// Submit/new Dog Trainer Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousSubmitRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/dog-trainer-app/anonymous/submit")]
        [HttpPost]
        public async Task<GDSDAppCommandResponse> SubmitDogTrainerAppAnonymous(GDSDTeamLicenceAppAnonymousSubmitRequest anonymousSubmitRequest, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Submit/new GDSD Team Certification application Anonymously
        /// After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
        /// The session keycode is stored in the cookies.
        /// </summary>
        /// <param name="anonymousChangeRequest">PermitAppAnonymousSubmitRequest data</param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/dog-trainer-app/anonymous/change")]
        [HttpPost]
        public async Task<GDSDAppCommandResponse> RenewReplaceDogTrainerAppAnonymous(GDSDTeamLicenceAppChangeRequest anonymousChangeRequest, CancellationToken ct)
        {
            throw new NotImplementedException();

        }
        #endregion anonymous
    }
}