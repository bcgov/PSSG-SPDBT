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

        public async Task<bool> AddApplicationAsync(ApplicationCreateCmd createApplicationCmd, CancellationToken cancellationToken)
        {
            spd_application application = _mapper.Map<spd_application>(createApplicationCmd);
            account org = GetOrgById(createApplicationCmd.OrgId);
            _dynaContext.AddTospd_applications(application);
            _dynaContext.SetLink(application, nameof(spd_application.spd_OrganizationId), org);

            contact contact = GetContact(createApplicationCmd);
            // if not found, create new contact
            if (contact == null)
            {
                contact = _mapper.Map<contact>(createApplicationCmd);
                _dynaContext.AddTocontacts(contact);
            }

            // associate contact to application
            _dynaContext.SetLink(application, nameof(application.spd_ApplicantId_contact), contact);

            // create the aliases
            foreach (var item in createApplicationCmd.Aliases)
            {
                spd_alias matchingAlias = GetAlias(item);
                // if not found, create new alias
                if (matchingAlias == null)
                {
                    spd_alias alias = _mapper.Map<spd_alias>(item);
                    _dynaContext.AddTospd_aliases(alias);
                    // associate alias to contact
                    _dynaContext.SetLink(alias, nameof(alias.spd_ContactId), contact);
                }
            }

            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<ApplicationListResp> GetApplicationListAsync(Guid orgId, CancellationToken cancellationToken)
        {
            var applications = _dynaContext.spd_applications
                .Where(a => a._spd_organizationid_value == orgId && a.statecode == DynamicsConstants.StateCode_Active)
                .ToList();

            var response = new ApplicationListResp();

            //response.FollowUpBusinessDays = organization.spd_followupbusinessdays ?? 6; // todo - update to use value from dynamics
            response.FollowUpBusinessDays = 9;

            response.Applications = _mapper.Map<IEnumerable<ApplicationResp>>(applications);
            return response;
        }

        public async Task<bool> CheckApplicationDuplicateAsync(SearchApplicationQry searchApplicationQry, CancellationToken cancellationToken)
        {
            var application = _dynaContext.spd_applications.Where(o =>
                o.spd_OrganizationId.accountid == searchApplicationQry.OrgId &&
                o.spd_firstname.Equals(searchApplicationQry.GivenName, StringComparison.InvariantCultureIgnoreCase) &&
                o.spd_lastname.Equals(searchApplicationQry.Surname, StringComparison.InvariantCultureIgnoreCase) &&
                o.spd_dateofbirth == new Microsoft.OData.Edm.Date(searchApplicationQry.DateOfBirth.Value.Year, searchApplicationQry.DateOfBirth.Value.Month, searchApplicationQry.DateOfBirth.Value.Day) &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return application != null;
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

        private spd_alias? GetAlias(AliasCreateCmd aliasCreateCmd)
        {
            var matchingAlias = _dynaContext.spd_aliases.Where(o =>
               o.spd_firstname.Equals(aliasCreateCmd.GivenName, StringComparison.InvariantCultureIgnoreCase) &&
               o.spd_middlename1.Equals(aliasCreateCmd.MiddleName1, StringComparison.InvariantCultureIgnoreCase) &&
               o.spd_middlename2.Equals(aliasCreateCmd.MiddleName2, StringComparison.InvariantCultureIgnoreCase) &&
               o.spd_surname.Equals(aliasCreateCmd.Surname, StringComparison.InvariantCultureIgnoreCase) &&
               o.statecode != DynamicsConstants.StateCode_Inactive
           ).FirstOrDefault();
            return matchingAlias;
        }

        private contact? GetContact(ApplicationCreateCmd createApplicationCmd)
        {
            var contact = _dynaContext.contacts
                .Where(o =>
                o.firstname.Equals(createApplicationCmd.GivenName, StringComparison.InvariantCultureIgnoreCase) &&
                o.lastname.Equals(createApplicationCmd.Surname, StringComparison.InvariantCultureIgnoreCase) &&
                o.emailaddress1.Equals(createApplicationCmd.EmailAddress, StringComparison.InvariantCultureIgnoreCase) &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return contact;

        }
    }
}
