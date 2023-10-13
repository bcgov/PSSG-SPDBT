using Spd.Utilities.Dynamics;

namespace Spd.Engine.Validation
{
    internal partial class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        public async Task<AppInviteDuplicateCheckResponse> AppInviteDuplicateCheckAsync(AppInviteDuplicateCheckRequest appInviteRequest, CancellationToken ct)
        {
            List<AppInviteDuplicateCheckResult> results = new List<AppInviteDuplicateCheckResult>();
            foreach (var item in appInviteRequest.AppInviteChecks)
            {
                //duplicated in portal invitation
                bool hasDuplicateInvitation = await CheckInvitationDuplicateAsync(item, appInviteRequest.OrgId, ct);
                if (hasDuplicateInvitation)
                {
                    AppInviteDuplicateCheckResult dupResp = _mapper.Map<AppInviteDuplicateCheckResult>(item);
                    dupResp.HasPotentialDuplicate = true;
                    results.Add(dupResp);
                }

                if (!hasDuplicateInvitation)
                {
                    //duplicated in application
                    bool hasDuplicateApplication = await CheckInviteApplicationDuplicateAsync(item, appInviteRequest.OrgId, ct);
                    if (hasDuplicateApplication)
                    {
                        AppInviteDuplicateCheckResult dupResp = _mapper.Map<AppInviteDuplicateCheckResult>(item);
                        dupResp.HasPotentialDuplicate = true;
                        results.Add(dupResp);
                    }
                }
            }

            AppInviteDuplicateCheckResponse resp = new AppInviteDuplicateCheckResponse(results);
            return resp;
        }

        private async Task<bool> CheckInvitationDuplicateAsync(AppInviteDuplicateCheck query, Guid orgId, CancellationToken cancellationToken)
        {
            var orginvitation = await _context.spd_portalinvitations.Where(o =>
                o.spd_OrganizationId.accountid == orgId &&
                o.spd_firstname == query.FirstName &&
                o.spd_surname == query.LastName &&
                o.spd_invitationtype == (int)InvitationTypeOptionSet.ScreeningRequest &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefaultAsync(cancellationToken);
            return orginvitation != null;
        }

        private async Task<bool> CheckInviteApplicationDuplicateAsync(AppInviteDuplicateCheck query, Guid orgId, CancellationToken cancellationToken)
        {
            var orginvitation = await _context.spd_applications.Where(o =>
                o.spd_OrganizationId.accountid == orgId &&
                o.spd_firstname == query.FirstName &&
                o.spd_lastname == query.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefaultAsync(cancellationToken);
            return orginvitation != null;
        }

    }
}