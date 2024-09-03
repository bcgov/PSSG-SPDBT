using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.ControllingMemberInvite
{
    internal class ControllingMemberInviteRepository : IControllingMemberInviteRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ITimeLimitedDataProtector _dataProtector;
        public ControllingMemberInviteRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ControllingMemberInviteRepository> logger, IDataProtectionProvider dpProvider)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _dataProtector = dpProvider.CreateProtector(nameof(ControllingMemberInviteCreateCmd)).ToTimeLimitedDataProtector();
        }

        public async Task<IEnumerable<ControllingMemberInviteResp>> QueryAsync(ControllingMemberInviteQuery query, CancellationToken cancellationToken)
        {
            var invites = _dynaContext.spd_portalinvitations
                 .Where(i => i.statecode == DynamicsConstants.StateCode_Active)
                 .Where(i => i.spd_invitationtype != null && i.spd_invitationtype == (int)InvitationTypeOptionSet.ControllingMemberCRC);

            invites = invites.Where(i => i._spd_businesscontact_value == query.BizContactId);
            if (!query.IncludeInactive)
                invites = invites.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);

            return _mapper.Map<IEnumerable<ControllingMemberInviteResp>>(invites.ToList());
        }

        public async Task ManageAsync(ControllingMemberInviteCmd cmd, CancellationToken ct)
        {
            if (cmd is ControllingMemberInviteCreateCmd)
                await CreateControllingMemberInviteAsync((ControllingMemberInviteCreateCmd)cmd, ct);
            else if (cmd is ControllingMemberInviteUpdateCmd)
                await UpdateApplicationInvitesAsync((ControllingMemberInviteUpdateCmd)cmd, ct);
        }

        public async Task CreateControllingMemberInviteAsync(ControllingMemberInviteCreateCmd createInviteCmd, CancellationToken ct)
        {
            spd_portaluser? user = await _dynaContext.GetUserById(createInviteCmd.CreatedByUserId, ct);
            account? biz = await _dynaContext.GetOrgById(createInviteCmd.BizId, ct);
            spd_businesscontact? bizContact = await _dynaContext.GetBizContactById(createInviteCmd.BizContactId, ct);
            spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(createInviteCmd);
            var encryptedInviteId = WebUtility.UrlEncode(_dataProtector.Protect(invitation.spd_portalinvitationid.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.ApplicationInviteValidDays)));
            invitation.spd_invitationlink = $"{createInviteCmd.HostUrl}{SpdConstants.BizPortalControllingMemberInviteLink}{encryptedInviteId}";
            _dynaContext.AddTospd_portalinvitations(invitation);
            _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), biz);
            _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_InvitedBy), user);
            _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_BusinessContact), bizContact);
            spd_servicetype? servicetype = _dynaContext.LookupServiceType(ServiceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC.ToString());
            if (servicetype != null)
            {
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_ServiceTypeId), servicetype);
            }
            await _dynaContext.SaveChangesAsync(ct);
        }

        private async Task UpdateApplicationInvitesAsync(ControllingMemberInviteUpdateCmd cmInviteUpdateCmd, CancellationToken cancellationToken)
        {
            spd_portalinvitation? invite = await _dynaContext.spd_portalinvitations
                 .Where(i => i.statecode == DynamicsConstants.StateCode_Active)
                 .Where(i => i.spd_invitationtype != null && i.spd_invitationtype == (int)InvitationTypeOptionSet.ControllingMemberCRC)
                 .Where(i => i.spd_portalinvitationid == cmInviteUpdateCmd.ControllingMemberInviteId)
                 .FirstOrDefaultAsync(cancellationToken);
            if (invite == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid invite id");

            // Inactivate the invite
            invite.statecode = DynamicsConstants.StateCode_Inactive;
            invite.statuscode = (int)Enum.Parse<InvitationStatus>(cmInviteUpdateCmd.ApplicationInviteStatusEnum.ToString());
            _dynaContext.UpdateObject(invite);

            await _dynaContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<ControllingMemberInviteVerifyResp> VerifyControllingMemberInviteAsync(ControllingMemberInviteVerifyCmd verifyInviteCmd, CancellationToken ct)
        {
            Guid inviteId;
            try
            {
                string inviteIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(verifyInviteCmd.EncryptedInviteId));
                inviteId = Guid.Parse(inviteIdStr);
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");
            }
            var invite = await _dynaContext.spd_portalinvitations
                .Expand(i => i.spd_OrganizationId)
                .Where(i => i.spd_portalinvitationid == inviteId)
                .Where(i => i.spd_invitationtype == (int)InvitationTypeOptionSet.ControllingMemberCRC)
                .Where(i => i.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefaultAsync(ct);
            if (invite == null)
                throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");

            //set invite views
            invite.spd_views = (invite.spd_views ?? 0) + 1;
            _dynaContext.UpdateObject(invite);
            await _dynaContext.SaveChangesAsync(ct);
            return _mapper.Map<ControllingMemberInviteVerifyResp>(invite);
        }
    }
}
