using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.ApplicationInvite
{
    internal class ApplicationInviteRepository : IApplicationInviteRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public ApplicationInviteRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ApplicationInviteRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
        }

        public async Task<ApplicationInviteListResp> QueryAsync(ApplicationInviteQuery query, CancellationToken cancellationToken)
        {
            if (query == null || query.FilterBy?.OrgId == null)
                throw new ArgumentNullException("query.FilterBy.OrgId", "Must query applications by organization id.");

            var invites = _dynaContext.spd_portalinvitations
                    .Where(i => i.spd_invitationtype != null && i.spd_invitationtype == (int)InvitationTypeOptionSet.ScreeningRequest)
                    .Where(i => i._spd_organizationid_value == query.FilterBy.OrgId && i.statecode == DynamicsConstants.StateCode_Active);

            string? filterValue = query.FilterBy.EmailOrNameContains;
            if (!string.IsNullOrWhiteSpace(filterValue))
                invites = invites.Where(i => i.spd_firstname.Contains(filterValue) || i.spd_surname.Contains(filterValue) || i.spd_email.Contains(filterValue));

            if (query.SortBy == null)
                invites = invites.OrderByDescending(a => a.createdon);
            if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && (bool)query.SortBy.SubmittedDateDesc)
                invites = invites.OrderByDescending(a => a.createdon);
            if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && !(bool)query.SortBy.SubmittedDateDesc)
                invites = invites.OrderBy(a => a.createdon);

            int count = invites.AsEnumerable().Count();

            if (query.Paging != null)
            {
                invites = invites
                    .Skip(query.Paging.Page * query.Paging.PageSize)
                    .Take(query.Paging.PageSize);
            }

            var response = new ApplicationInviteListResp();

            response.ApplicationInvites = _mapper.Map<IEnumerable<ApplicationInviteResult>>(invites);

            if (query.Paging != null)
            {
                response.Pagination = new PaginationResp();
                response.Pagination.PageSize = query.Paging.PageSize;
                response.Pagination.PageIndex = query.Paging.Page;
                response.Pagination.Length = count;
            }

            return response;
        }

        public async Task AddApplicationInvitesAsync(ApplicationInvitesCreateCmd createInviteCmd, CancellationToken cancellationToken)
        {
            account? org = await GetOrgById(createInviteCmd.OrgId);
            spd_portaluser? user = await GetUserById(createInviteCmd.CreatedByUserId);

            foreach (var item in createInviteCmd.ApplicationInvites)
            {
                spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(item);
                _dynaContext.AddTospd_portalinvitations(invitation);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), org);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), user);
            }
            await _dynaContext.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteApplicationInvitesAsync(ApplicationInviteDeleteCmd applicationInviteDeleteCmd, CancellationToken cancellationToken)
        {
            spd_portalinvitation invite = GetPortalInvitationById(applicationInviteDeleteCmd.OrgId, applicationInviteDeleteCmd.ApplicationInviteId);

            // Inactivate the invite
            invite.statecode = DynamicsConstants.StateCode_Inactive;
            invite.statuscode = DynamicsConstants.StatusCode_Inactive;
            _dynaContext.UpdateObject(invite);

            await _dynaContext.SaveChangesAsync(cancellationToken);
            return;
        }

        public async Task<bool> CheckInviteInvitationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = await _dynaContext.spd_portalinvitations.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_surname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefaultAsync(cancellationToken);
            return orginvitation != null;
        }

        public async Task<bool> CheckInviteApplicationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = await _dynaContext.spd_applications.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_lastname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefaultAsync(cancellationToken);
            return orginvitation != null;
        }

        private async Task<spd_portaluser?> GetUserById(Guid userId)
          => await _dynaContext.spd_portalusers.Where(a => a.spd_portaluserid == userId).SingleOrDefaultAsync();

        private async Task<account?> GetOrgById(Guid organizationId)
           => await _dynaContext.accounts.Where(a => a.accountid == organizationId).SingleOrDefaultAsync();

        private account? GetOrgById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();
            if (account == null)
                throw new NotFoundException(HttpStatusCode.BadRequest, $"Organization {organizationId} is not found");
            if (account?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(HttpStatusCode.BadRequest, $"Organization {organizationId} is inactive");
            return account;
        }

        private spd_portalinvitation? GetPortalInvitationById(Guid organizationId, Guid portalInvitationId)
        {
            var spd_portalinvitation = _dynaContext.spd_portalinvitations
                .Where(a => a.spd_portalinvitationid == portalInvitationId && a._spd_organizationid_value == organizationId)
                .FirstOrDefault();
            if (spd_portalinvitation == null)
                throw new NotFoundException(HttpStatusCode.BadRequest, $"Organization {organizationId} with Portal Invitation {portalInvitationId} is not found");
            if (spd_portalinvitation?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(HttpStatusCode.BadRequest, $"Organization {organizationId} with Portal Invitation {portalInvitationId} is inactive");

            return spd_portalinvitation;
        }
    }
}
