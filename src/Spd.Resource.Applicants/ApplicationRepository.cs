using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Applicants
{
    internal class ApplicationRepository : IApplicationRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ApplicationRepository> _logger;
        public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ApplicationRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<bool> AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken)
        {
            account org = GetOrgById(createInviteCmd.OrgId);
            //spd_portaluser user = GetUserById(createInviteCmd.CreatedByUserId); //todo

            foreach (var item in createInviteCmd.ApplicationInviteCreateReqs)
            {
                spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(item);
                _dynaContext.AddTospd_portalinvitations(invitation);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), org);
                //_dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), user); //todo
            }
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> CheckInviteInvitationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = _dynaContext.spd_portalinvitations.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname.Equals(searchInvitationQry.FirstName, StringComparison.InvariantCultureIgnoreCase) &&
                o.spd_surname.Equals(searchInvitationQry.LastName, StringComparison.InvariantCultureIgnoreCase) &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return orginvitation != null;
        }

        public async Task<bool> CheckInviteApplicationDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = _dynaContext.spd_applications.Where(o =>
                o.spd_OrganizationId.accountid == searchInvitationQry.OrgId &&
                o.spd_firstname.Equals(searchInvitationQry.FirstName, StringComparison.InvariantCultureIgnoreCase) &&
                o.spd_lastname.Equals(searchInvitationQry.LastName, StringComparison.InvariantCultureIgnoreCase) &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return orginvitation != null;
        }

        public async Task<bool> AddApplicationSubmissionAsync(ApplicationSubmissionCreateCmd createSubmissionCmd, CancellationToken cancellationToken)
        {
            spd_application application = _mapper.Map<spd_application>(createSubmissionCmd);
            _dynaContext.AddTospd_applications(application);
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        private account? GetOrgById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();
            if (account == null)
                throw new NotFoundException(HttpStatusCode.BadRequest, $"Organization {organizationId} is not found.");
            if (account?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(HttpStatusCode.BadRequest, $"Organization {organizationId} is inactive.");
            return account;
        }

        private spd_portaluser? GetUserById(Guid userId)
        {
            var user = _dynaContext.spd_portalusers
                .Where(a => a.spd_portaluserid == userId)
                .FirstOrDefault();
            if (user == null)
                throw new NotFoundException(HttpStatusCode.BadRequest, $"User {userId} is not found.");
            if (user?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(HttpStatusCode.BadRequest, $"User {userId} is inactive.");
            return user;

        }
    }
}
