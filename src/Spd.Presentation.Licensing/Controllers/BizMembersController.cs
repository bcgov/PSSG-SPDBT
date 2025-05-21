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
        [Route("api/business/{bizId}/members")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<Members> GetMembers([FromRoute] Guid bizId, CancellationToken ct)
        {
            return await _mediator.Send(new GetBizMembersQuery(bizId), ct);
        }

        /// <summary>
        /// Deprecated. Upsert Biz Application controlling members and employees, controlling members include swl and non-swl
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="applicationId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/members")]
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
        /// Create Biz employee
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="employee"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/employees")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> CreateEmployee([FromRoute] Guid bizId, [FromBody] SwlContactInfo employee, CancellationToken ct)
        {
            return await _mediator.Send(new CreateBizEmployeeCommand(bizId, employee), ct);
        }

        /// <summary>
        /// Create Biz swl controlling member
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="controllingMember"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/swl-controlling-members")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> CreateSwlControllingMember([FromRoute] Guid bizId, [FromBody] SwlContactInfo controllingMember, CancellationToken ct)
        {
            return await _mediator.Send(new CreateBizSwlStakeholderCommand(bizId, controllingMember, BizContactRoleCode.ControllingMember), ct);
        }

        /// <summary>
        /// Create Biz swl controlling member
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="employee"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/non-swl-controlling-members")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> CreateNonSwlControllingMember([FromRoute] Guid bizId, [FromBody] NonSwlContactInfo controllingMember, CancellationToken ct)
        {
            return await _mediator.Send(new CreateBizNonSwlStakeholderCommand(bizId, controllingMember, BizContactRoleCode.ControllingMember), ct);
        }

        /// <summary>
        /// Update Non swl biz controlling member
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="bizContactId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/non-swl-controlling-members/{bizContactId}")]
        [HttpPut]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> UpdateNonSwlControllingMember([FromRoute] Guid bizId, [FromRoute] Guid bizContactId, NonSwlContactInfo controllingMember, CancellationToken ct)
        {
            return await _mediator.Send(new UpdateBizNonSwlStakeholderCommand(bizId, bizContactId, controllingMember, BizContactRoleCode.BusinessManager), ct);
        }

        /// <summary>
        /// Create Biz swl business manager
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="bizManager"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/swl-business-managers")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> CreateSwlBusinessManager([FromRoute] Guid bizId, [FromBody] SwlContactInfo bizManager, CancellationToken ct)
        {
            return await _mediator.Send(new CreateBizSwlStakeholderCommand(bizId, bizManager, BizContactRoleCode.BusinessManager), ct);
        }

        /// <summary>
        /// Create Biz non-swl business manager
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="employee"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/non-swl-business-managers")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> CreateNonSwlBusinessManager([FromRoute] Guid bizId, [FromBody] NonSwlContactInfo bizManager, CancellationToken ct)
        {
            return await _mediator.Send(new CreateBizNonSwlStakeholderCommand(bizId, bizManager, BizContactRoleCode.BusinessManager), ct);
        }

        /// <summary>
        /// Update Non swl biz business manager
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="bizContactId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/non-swl-business-managers/{bizContactId}")]
        [HttpPut]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<BizMemberResponse> UpdateNonSwlBusinessManager([FromRoute] Guid bizId, [FromRoute] Guid bizContactId, NonSwlContactInfo bizManager, CancellationToken ct)
        {
            return await _mediator.Send(new UpdateBizNonSwlStakeholderCommand(bizId, bizContactId, bizManager, BizContactRoleCode.BusinessManager), ct);
        }

        /// <summary>
        /// Delete Biz member
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="bizContactId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/members/{bizContactId}")]
        [HttpDelete]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<ActionResult> DeleteBizMember([FromRoute] Guid bizId, [FromRoute] Guid bizContactId, CancellationToken ct)
        {
            await _mediator.Send(new DeleteBizMemberCommand(bizId, bizContactId), ct);
            return Ok();
        }

        /// <summary>
        /// Create stakeholder (controlling member, biz manager) crc invitation for this biz contact
        /// Example: http://localhost:5114/api/business-licence-application/controlling-member-invitation/123?inviteType=Update
        /// </summary>
        /// <param name="bizContactId"></param>
        /// <param name="inviteType"></param>
        /// <returns></returns>
        [Route("api/business-licence-application/stakeholder-invitation/{bizContactId}")]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        [HttpGet]
        public async Task<StakeholderInvitesCreateResponse> CreateControllingMemberCrcAppInvitation([FromRoute][Required] Guid bizContactId,
            [FromQuery] StakeholderAppInviteTypeCode inviteType = StakeholderAppInviteTypeCode.New)
        {
            var userIdStr = _currentUser.GetUserId();
            if (userIdStr == null) throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "Unauthorized");
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            if (hostUrl == null)
                throw new ConfigurationErrorsException("HostUrl is not set correctly in configuration.");
            var inviteCreateCmd = new BizStakeholderNewInviteCommand(bizContactId, Guid.Parse(userIdStr), hostUrl, inviteType);
            return await _mediator.Send(inviteCreateCmd);
        }

        /// <summary>
        /// Verify if the current stakeholder (controlling member, biz manager) crc application invite is correct, and return needed info
        /// </summary>
        /// <param name="appInviteVerifyRequest">which include InviteEncryptedCode</param>
        /// <returns></returns>
        [Route("api/stakeholders/invites")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<StakeholderAppInviteVerifyResponse> VerifyCmAppInvitation([FromBody][Required] StakeholderAppInviteVerifyRequest inviteVerifyRequest)
        {
            StakeholderAppInviteVerifyResponse response = await _mediator.Send(new VerifyBizStakeholderInviteCommand(inviteVerifyRequest.InviteEncryptedCode));
            if (response.ContactId != null)
            {
                SetValueToResponseCookie(SessionConstants.AnonymousApplicantContext, response.ContactId.Value.ToString());
            }
            return response;
        }

        /// <summary>
        /// Get non-swl Biz controlling members
        /// </summary>
        /// <param name="bizId"></param>
        /// <param name="bizContactId"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        [Route("api/business/{bizId}/non-swl-controlling-members/{bizContactId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid", Roles = "PrimaryBusinessManager,BusinessManager")]
        public async Task<NonSwlContactInfo> GetNonSwlContactInfo([FromRoute] Guid bizContactId, CancellationToken ct)
        {
            return await _mediator.Send(new GetNonSwlBizMemberCommand(bizContactId), ct);
        }
    }
}