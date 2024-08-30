using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Manager.Licence;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Net;
using System.Security.Principal;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class BizMembersController : SpdLicenceControllerBase
    {
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public BizMembersController(IPrincipal currentUser,
            IMediator mediator,
            IConfiguration configuration,
            IRecaptchaVerificationService recaptchaVerificationService,
            IDistributedCache cache,
            IDataProtectionProvider dpProvider) : base(cache, dpProvider, recaptchaVerificationService, configuration)
        {
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// Get Biz controlling members and employees, controlling member includes swl and non-swl
        /// This is the latest active biz controlling members and employees, irrelevent to application.
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{bizId}/members")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<Members> GetMembers([FromRoute] Guid bizId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizMembersQuery(bizId), ct);
        }

        /// <summary>
        /// Upsert Biz Application controlling members and employees, controlling members include swl and non-swl
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/{bizId}/members")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<ActionResult> UpsertMembers([FromRoute] Guid bizId, [FromBody] MembersRequest members, CancellationToken ct)
        {
            IEnumerable<LicAppFileInfo> newDocInfos = await GetAllNewDocsInfoAsync(members.ControllingMemberDocumentKeyCodes, ct);
            if (newDocInfos.Count() != members.ControllingMemberDocumentKeyCodes.Count())
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot find all files in the cache.");
            }
            await _mediator.Send(new UpsertBizMembersCommand(bizId, null, members, newDocInfos), ct);
            return Ok();
        }

        /// <summary>
        /// Create controlling member crc invitation for this biz contact
        /// </summary>
        /// <param name="bizContactId"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/controlling-member-invitation/{bizContactId}")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpGet]
        public async Task<ControllingMemberInvitesCreateResponse> CreateControllingMemberCrcAppInvitation([FromRoute][Required] Guid bizContactId, CancellationToken ct)
        {
            var userIdStr = _currentUser.GetUserId();
            if (userIdStr == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized);
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            if (hostUrl == null)
                throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");
            var inviteCreateCmd = new BizControllingMemberNewInviteCommand(bizContactId, Guid.Parse(userIdStr), hostUrl);
            return await _mediator.Send(inviteCreateCmd, ct);
        }
    }
}