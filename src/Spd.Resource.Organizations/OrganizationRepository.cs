using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations
{
    public class OrganizationRepository : IOrganizationRepository
    {
        public readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public OrganizationRepository(IDynamicsContextFactory ctx, IMapper mapper)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
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
            return _mapper.Map<UserCmdResponse>(user);
        }

        public async Task<UserCmdResponse> UpdateUserAsync(UpdateUserCmd updateUserCmd, CancellationToken cancellationToken)
        {
            var user = GetUserById(updateUserCmd.Id);

            user.spd_surname = updateUserCmd.LastName;
            user.spd_firstname = updateUserCmd.FirstName;
            user.spd_fullname = updateUserCmd.FirstName + ' ' + updateUserCmd.LastName;
            user.spd_emailaddress1 = updateUserCmd.Email;
            user.spd_dateofbirth = updateUserCmd.DateOfBirth;
            user.spd_jobtitle = updateUserCmd.JobTitle;
            user.spd_phonenumber = updateUserCmd.PhoneNumber;

            //var currentRole = GetRoleByUserId(updateUserCmd.Id);
            //_dynaContext.DeleteLink(currentRole, nameof(currentRole.spd_spd_role_spd_portaluserid), user);

            //spd_role? role = _dynaContext.LookupRole(updateUserCmd.ContactAuthorizationTypeCode.ToString());
            //if (role != null)
            //{
            //    _dynaContext.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), user);
            //}

            _dynaContext.UpdateObject(user);
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return _mapper.Map<UserCmdResponse>(user);
        }

        public async Task DeleteUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = GetUserById(userId);

            // Inactivate the user
            user.statecode = 1;
            user.statuscode = 2;

            _dynaContext.UpdateObject(user);
            await _dynaContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<UserCmdResponse> GetUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = GetUserById(userId);
            var response = _mapper.Map<UserCmdResponse>(user);
            var role = GetRoleByUserId(userId);

            if (role != null && role.spd_roleid == Guid.Parse("47ca4197-12ba-ed11-b83e-00505683fbf4"))
            {
                response.ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Contact;
            }
            else
            {
                response.ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Primary;
            }
            return response;
        }

        public async Task<IEnumerable<UserCmdResponse>> GetUsersAsync(Guid organizationId, CancellationToken cancellationToken)
        {
            var users = GetUsersById(organizationId);
            var responses = _mapper.Map<IEnumerable<UserCmdResponse>>(users);
            foreach (UserCmdResponse user in responses)
            {
                var role = GetRoleByUserId(user.Id);
                if (role != null && role.spd_roleid == Guid.Parse("47ca4197-12ba-ed11-b83e-00505683fbf4"))
                {
                    user.ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Contact;
                }
                else
                {
                    user.ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Primary;
                }
            }
            return responses;
        }

        private account GetOrganizationById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();
            if (account == null) throw new Exception($"Cannot find the organization with organizationId {organizationId}");
            return account;
        }
        private spd_portaluser GetUserById(Guid userId)
        {
            var user = _dynaContext.spd_portalusers
                .Where(a => a.spd_portaluserid == userId)
                .FirstOrDefault();
            if (user == null) throw new Exception($"Cannot find the user with userId {userId}");
            return user;
        }
        private spd_spd_role_spd_portaluser GetRoleByUserId(Guid userId)
        {
            var role = _dynaContext.spd_spd_role_spd_portaluserset
                .Where(a => a.spd_portaluserid == userId)
                .FirstOrDefault();
            if (role == null) throw new Exception($"Cannot find the role with userId {userId}");
            return role;
        }
        private IEnumerable<spd_portaluser> GetUsersById(Guid organizationId)
        {
            var users = _dynaContext.spd_portalusers
                .Where(a => a._spd_organizationid_value == organizationId && a.statecode == 0)
                .ToList();
            if (users == null) throw new Exception($"Cannot find the users with organizationId {organizationId}");
            return users;
        }
    }
}
