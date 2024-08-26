using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

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

        public async Task ManageAsync(ControllingMemberInviteCreateCmd cmd, CancellationToken ct)
        {

        }

        public async Task<ControllingMemberInviteVerifyResp> VerifyControllingMemberInvitesAsync(ControllingMemberInviteVerifyCmd verifyInviteCmd, CancellationToken ct)
        {
            //Guid inviteId;
            //try
            //{
            //    string inviteIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(verifyInviteCmd.InviteEncryptedCode));
            //    inviteId = Guid.Parse(inviteIdStr);
            //}
            //catch
            //{
            //    throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");
            //}
            //var invite = await _dynaContext.spd_portalinvitations
            //    .Expand(i => i.spd_OrganizationId)
            //    .Where(i => i.spd_portalinvitationid == inviteId)
            //    .Where(i => i.spd_invitationtype == (int)InvitationTypeOptionSet.ScreeningRequest)
            //    .Where(i => i.statecode != DynamicsConstants.StateCode_Inactive)
            //    .FirstOrDefaultAsync(ct);
            //if (invite == null)
            //    throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");

            ////set invite views
            //invite.spd_views = (invite.spd_views ?? 0) + 1;
            //_dynaContext.UpdateObject(invite);
            //await _dynaContext.SaveChangesAsync(ct);
            //return _mapper.Map<AppInviteVerifyResp>(invite);
            return null;
        }

        private async Task<spd_portalinvitation?> GetPortalInvitationById(Guid organizationId, Guid portalInvitationId)
           => await _dynaContext.spd_portalinvitations
                .Where(a => a.spd_portalinvitationid == portalInvitationId && a._spd_organizationid_value == organizationId)
                .SingleOrDefaultAsync();
    }
}
