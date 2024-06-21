using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class LoginController : SpdControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public LoginController(ILogger<LoginController> logger, IPrincipal currentUser, IMediator mediator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// login, for swl/permit portal, bc service card login
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantLoginResponse?> ApplicantPortalLogin()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new ApplicantLoginCommand(info));
            return response;
        }

        /// <summary>
        /// when user select agree to the Term. Call this endpoint.
        /// </summary>
        /// <returns></returns>
        [Route("api/applicant/{applicantId}/term-agree")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ActionResult> ApplicantPortalTermAgree([FromRoute] Guid applicantId)
        {
            await _mediator.Send(new ApplicantTermAgreeCommand(applicantId));
            return Ok();
        }


        /// <summary>
        /// user calls this endpoint to get the list of the biz that are already existing in system.
        /// </summary>
        /// <returns></returns>
        [Route("api/bizs")]
        [Authorize(Policy = "OnlyBCeID")]
        [HttpGet]
        public async Task<IEnumerable<BizListResponse>> BizList()
        {
            var info = _currentUser.GetBceidUserIdentityInfo();
            //string test = @"{
            //    ""BCeIDUserName"": ""VictoriaCharity"",
            //    ""DisplayName"": ""Qu Tester"",
            //    ""FirstName"": ""Qu Tester"",
            //    ""LastName"": """",
            //    ""PreferredUserName"": ""846597a702244ba0884bdc3ac8cb21b5@bceidbusiness"",
            //    ""UserGuid"": ""846597a7-0224-4ba0-884b-dc3ac8cb21b5"",
            //    ""BizGuid"": ""fbb17094-2532-4fd8-befc-b6bbcd679df3"",
            //    ""BizName"": ""Victoria Charity"",
            //    ""Issuer"": ""https://dev.loginproxy.gov.bc.ca/auth/realms/standard"",
            //    ""EmailVerified"": false,
            //    ""Email"": ""peggy.zhang@quartech.com""
            //}";
            //BceidIdentityInfo info = JsonSerializer.Deserialize<BceidIdentityInfo>(test);
            return await _mediator.Send(new GetBizsQuery(info.BizGuid));
        }
        /// <summary>
        /// login, for biz licensing portal, bceid login, sample: api/biz/login?bizId=123
        /// or api/biz/login
        /// </summary>
        /// <returns></returns>
        [Route("api/biz/login")]
        [HttpGet]
        //[Authorize(Policy = "OnlyBCeID")]
        public async Task<BizUserLoginResponse?> BizLicencePortalLogin([FromQuery] Guid? bizId)
        {
            var info = _currentUser.GetBceidUserIdentityInfo();
            var response = await _mediator.Send(new BizLoginCommand(info, bizId));
            return response;
        }

        /// <summary>
        /// when manager select agree to the Term. Call this endpoint.
        /// </summary>
        /// <returns></returns>
        [Route("api/biz/{bizId}/manager/{bizUserId}/term-agree")]
        [Authorize(Policy = "OnlyBCeID")]
        [HttpGet]
        public async Task<ActionResult> BizLicencePortalTermAgree([FromRoute] Guid bizId, Guid bizUserId)
        {
            await _mediator.Send(new BizTermAgreeCommand(bizId, bizUserId));
            return Ok();
        }
    }



}