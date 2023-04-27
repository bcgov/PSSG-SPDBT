using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

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
                throw new ArgumentNullException("Must query applications by orgnization id.");

            var invites = _dynaContext.spd_portalinvitations
                    .Where(i => i.spd_invitationtype != null && i.spd_invitationtype == (int)InvitationTypeOptionSet.ScreeningRequest)
                    .Where(i => i._spd_organizationid_value == query.FilterBy.OrgId && i.statecode == DynamicsConstants.StateCode_Active);

            int count = invites.AsEnumerable().Count();

            if (query.SortBy == null)
                invites = invites.OrderByDescending(a => a.createdon);

            if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && (bool)query.SortBy.SubmittedDateDesc)
                invites = invites.OrderByDescending(a => a.createdon);
            if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && !(bool)query.SortBy.SubmittedDateDesc)
                invites = invites.OrderBy(a => a.createdon);
            
            if (query.Paging != null)
            {
                invites = invites
                    .Skip(query.Paging.Page * query.Paging.PageSize)
                    .Take(query.Paging.PageSize);
            }
            var temp = invites.ToList();
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
            account org = GetOrgById(createInviteCmd.OrgId);
            //spd_portaluser user = GetUserById(createInviteCmd.CreatedByUserId); //todo

            foreach (var item in createInviteCmd.ApplicationInvites)
            {
                spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(item);
                _dynaContext.AddTospd_portalinvitations(invitation);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), org);
                //_dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), user); //todo
            }
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return;
        }

        public async Task<bool> CheckInviteInvitationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = _dynaContext.spd_portalinvitations.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_surname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return orginvitation != null;
        }

        public async Task<bool> CheckInviteApplicationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = _dynaContext.spd_applications.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_lastname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return orginvitation != null;
        }



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

    }
}
