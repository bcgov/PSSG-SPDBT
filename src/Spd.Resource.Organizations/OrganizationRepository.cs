using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using System.Collections.ObjectModel;

namespace Spd.Resource.Organizations
{
    public class OrganizationRepository : IOrganizationRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<OrganizationRepository> _logger;
        public OrganizationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrganizationRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<bool> AddRegistrationAsync(CreateRegistrationCmd createRegistrationCmd, CancellationToken cancellationToken)
        {
            string key;
            if (createRegistrationCmd.RegistrationTypeCode == RegistrationTypeCode.Employee)
            {
                key = $"{createRegistrationCmd.RegistrationTypeCode}-{createRegistrationCmd.EmployeeOrganizationTypeCode}";
            }
            else
            {
                key = $"{createRegistrationCmd.RegistrationTypeCode}-{createRegistrationCmd.VolunteerOrganizationTypeCode}";
            }

            spd_orgregistration orgregistration = _mapper.Map<spd_orgregistration>(createRegistrationCmd);
            _dynaContext.AddTospd_orgregistrations(orgregistration);
            _dynaContext.SetLink(orgregistration, nameof(spd_orgregistration.spd_OrganizationTypeId), _dynaContext.LookupOrganizationType(key));
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<UserCmdResponse> AddUserAsync(CreateUserCmd createUserCmd, CancellationToken cancellationToken)
        {
            var organization = GetOrganizationById(createUserCmd.OrganizationId);
            spd_portaluser user = _mapper.Map<spd_portaluser>(createUserCmd);

            _dynaContext.AddTospd_portalusers(user);
            _dynaContext.SetLink(user, nameof(spd_portaluser.spd_OrganizationId), organization);
            spd_role? role = _dynaContext.LookupRole(createUserCmd.ContactAuthorizationTypeCode.ToString());
            if (role != null)
            {
                _dynaContext.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), user);
            }
            await _dynaContext.SaveChangesAsync(cancellationToken);

            user._spd_organizationid_value = createUserCmd.OrganizationId;
            return _mapper.Map<UserCmdResponse>(user);
        }

        public async Task<UserCmdResponse> UpdateUserAsync(UpdateUserCmd updateUserCmd, CancellationToken cancellationToken)
        {
            var user = GetUserById(updateUserCmd.Id);
            _mapper.Map(updateUserCmd, user);

            spd_role existingRole = user.spd_spd_role_spd_portaluser.First();
            spd_role newRole = existingRole;
            string existingRoleName = _dynaContext.LookupRoleKeyById((Guid)existingRole.spd_roleid);
            if (existingRoleName != updateUserCmd.ContactAuthorizationTypeCode.ToString()) //role changed
            {
                _dynaContext.DeleteLink(existingRole, nameof(existingRole.spd_spd_role_spd_portaluser), user);

                newRole = _dynaContext.LookupRole(updateUserCmd.ContactAuthorizationTypeCode.ToString());
                if (newRole != null)
                {
                    _dynaContext.AddLink(newRole, nameof(newRole.spd_spd_role_spd_portaluser), user);
                }
            }
            _dynaContext.UpdateObject(user);
            await _dynaContext.SaveChangesAsync(cancellationToken);

            user.spd_spd_role_spd_portaluser = new Collection<spd_role> { new spd_role() { spd_roleid = newRole.spd_roleid } };
            return _mapper.Map<UserCmdResponse>(user);
        }

        public async Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = GetUserById(userId);
            // Inactivate the user
            user.statecode = DynamicsConstants.StateCode_Inactive;
            user.statuscode = DynamicsConstants.StatusCode_Inactive;
            _dynaContext.UpdateObject(user);
            await _dynaContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<UserCmdResponse> GetUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = GetUserById(userId);
            var response = _mapper.Map<UserCmdResponse>(user);
            return response;
        }

        public async Task<OrgUserListCmdResponse> GetUserListAsync(Guid organizationId, CancellationToken cancellationToken)
        {
            var users = _dynaContext.spd_portalusers
                .Expand(u => u.spd_spd_role_spd_portaluser)
                .Where(a => a._spd_organizationid_value == organizationId && a.statecode == DynamicsConstants.StateCode_Active)
                .AsEnumerable();

            if (users == null) throw new UserNotFoundException($"Cannot find the users with organizationId {organizationId}");

            //todo: investigate why expand does not work here.
            await Parallel.ForEachAsync(users, cancellationToken, async (user, cancellationToken) =>
            {
                var role = _dynaContext
                    .spd_spd_role_spd_portaluserset
                    .Where(r => r.spd_portaluserid == user.spd_portaluserid)
                    .FirstOrDefault();
                user.spd_spd_role_spd_portaluser = new Collection<spd_role> { new spd_role() { spd_roleid = role.spd_roleid } };
            });

            var organization = GetOrganizationById(organizationId);

            var response = new OrgUserListCmdResponse();
            response.MaximumNumberOfAuthorizedContacts = organization.spd_maximumnumberofcontacts ?? 6;
            response.MaximumNumberOfPrimaryAuthorizedContacts = organization.spd_noofprimaryauthorizedcontacts ?? 2;

            response.Users = _mapper.Map<IEnumerable<UserCmdResponse>>(users);
            return response;
        }

        private account GetOrganizationById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();

            if (account?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new UserInactiveException($"Organization {organizationId} is inactive.");
            return account;
        }
        private spd_portaluser GetUserById(Guid userId)
        {
            try
            {
                var user = _dynaContext.spd_portalusers
                    .Expand(m => m.spd_spd_role_spd_portaluser)
                    .Where(a => a.spd_portaluserid == userId)
                    .FirstOrDefault();

                if (user?.statecode == DynamicsConstants.StateCode_Inactive)
                    throw new UserInactiveException($"User {userId} is inactive.");
                return user;
            }
            catch (DataServiceQueryException ex)
            {
                _logger.LogWarning($"Cannot find the user with userId {userId}");
                throw new UserNotFoundException(ex.Message, ex.InnerException);
            }
        }
    }
}
