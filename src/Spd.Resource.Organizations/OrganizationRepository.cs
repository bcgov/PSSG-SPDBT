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

        public async Task<bool> RegisterAsync(CreateRegistrationCmd createRegistrationCmd, CancellationToken cancellationToken)
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

        public async Task<UserCmdResponse> GetUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = GetUserById(userId);
            return _mapper.Map<UserCmdResponse>(user);
        }

        public async Task<IEnumerable<UserCmdResponse>> GetUsersAsync(Guid organizationId, CancellationToken cancellationToken)
        {
            var users = GetUsersById(organizationId);
            return _mapper.Map<IEnumerable<UserCmdResponse>>(users);
        }

        //public async Task OrgUserDeleteAsync(Guid userId, CancellationToken cancellationToken)
        //{
        //    var user = GetUserById(userId);
        //    user.statuscode = 0;
        //}

        private account GetOrganizationById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();
            if (account == null) throw new Exception("cannot find the organization with organizationId.");
            return account;
        }
        private spd_portaluser GetUserById(Guid userId)
        {
            var user = _dynaContext.spd_portalusers
                .Where(a => a.spd_portaluserid == userId)
                .FirstOrDefault();
            if (user == null) throw new Exception("cannot find the user with userId.");
            return user;
        }
        private IEnumerable<spd_portaluser> GetUsersById(Guid organizationId)
        {
            var users = _dynaContext.spd_portalusers
                .Where(a => a._spd_organizationid_value == organizationId)
                .ToList();
            if (users == null) throw new Exception("cannot find the users with organizationId.");
            return users;
        }
    }
}
