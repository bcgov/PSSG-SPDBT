using Spd.Utilities.Dynamics;

namespace Spd.Engine.Validation
{
    internal partial class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        public async Task<IEnumerable<ApplicationInviteDuplicateResponse>> AppInviteDuplicateCheckAsync(AppInviteDuplicateCheckRequest appInviteCheckRequest, CancellationToken ct)
        {
            return true;
        }

        public async Task<bool> CheckInviteInvitationDuplicateAsync(AppInviteDuplicateCheckRequest searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = await _context.spd_portalinvitations.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_surname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefaultAsync(cancellationToken);
            return orginvitation != null;
        }

        public async Task<bool> CheckInviteApplicationDuplicateAsync(AppInviteDuplicateCheckRequest searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = await _context.spd_applications.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_lastname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefaultAsync(cancellationToken);
            return orginvitation != null;
        }

    }
}