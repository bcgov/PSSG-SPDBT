using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Collections.ObjectModel;
using System.Net;

namespace Spd.Resource.Organizations.User
{
    internal class OrgUserRepository : IOrgUserRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<OrgUserRepository> _logger;
        public OrgUserRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgUserRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<OrgUserQryResult> QueryOrgUserAsync(OrgUserQry qry, CancellationToken ct)
        {
            return qry switch
            {
                OrgUserByIdQry q => await GetUserAsync(q.UserId, ct),
                OrgUsersByIdentityIdQry q => await GetUsersByIdentityIdAsync(q.IdentityId, ct),
                OrgUsersByOrgIdQry q => await GetUsersByOrgIdAsync(q.OrgId, ct),
                _ => throw new NotSupportedException($"{qry.GetType().Name} is not supported")
            };
        }

        public async Task<OrgUserManageResult> ManageOrgUserAsync(OrgUserCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                UserCreateCmd c => await AddUserAsync(c, ct),
                UserUpdateCmd c => await UpdateUserAsync(c, ct),
                UserDeleteCmd c => await DeleteUserAsync(c.Id, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<OrgUsersResult> GetUsersByIdentityIdAsync(Guid identityId, CancellationToken ct)
        {
            var users = _dynaContext.spd_portalusers
                .Where(a => a._spd_identityid_value == identityId && a.statecode == DynamicsConstants.StateCode_Active)
                .ToList();

            if (users == null) throw new NotFoundException(HttpStatusCode.BadRequest, $"Cannot find the users with identityId {identityId}");

            //todo: investigate why expand does not work here.
            await Parallel.ForEachAsync(users, ct, async (user, cancellationToken) =>
            {
                var role = _dynaContext
                    .spd_spd_role_spd_portaluserset
                    .Where(r => r.spd_portaluserid == user.spd_portaluserid)
                    .FirstOrDefault();
                if (role != null)
                {
                    user.spd_spd_role_spd_portaluser = new Collection<spd_role> { new spd_role() { spd_roleid = role.spd_roleid } };
                }
            });

            return new OrgUsersResult(_mapper.Map<IEnumerable<UserResult>>(users));
        }

        private async Task<OrgUserManageResult> AddUserAsync(UserCreateCmd createUserCmd, CancellationToken cancellationToken)
        {
            if (createUserCmd.User.OrganizationId == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Organization cannot be null");

            var organization = GetOrganizationById((Guid)createUserCmd.User.OrganizationId);

            // create user 
            spd_portaluser user = _mapper.Map<spd_portaluser>(createUserCmd.User);
            user.spd_portaluserid = Guid.NewGuid();
            _dynaContext.AddTospd_portalusers(user);
            _dynaContext.SetLink(user, nameof(spd_portaluser.spd_OrganizationId), organization);
            spd_role? role = _dynaContext.LookupRole(createUserCmd.User.ContactAuthorizationTypeCode.ToString());
            if (role != null)
            {
                _dynaContext.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), user);
            }

            // create portal invitation
            spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(createUserCmd.User);
            invitation.spd_portalinvitationid = Guid.NewGuid();
            _dynaContext.AddTospd_portalinvitations(invitation);
            _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), organization);
            _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), user);

            await _dynaContext.SaveChangesAsync(cancellationToken);

            user._spd_organizationid_value = createUserCmd.User.OrganizationId;
            user.spd_spd_role_spd_portaluser = new Collection<spd_role> { new spd_role() { spd_roleid = role.spd_roleid } };
            return new OrgUserManageResult(_mapper.Map<UserResult>(user));
        }

        private async Task<OrgUserManageResult> UpdateUserAsync(UserUpdateCmd updateUserCmd, CancellationToken cancellationToken)
        {
            var user = GetUserById(updateUserCmd.Id);
            _mapper.Map(updateUserCmd.User, user);

            spd_role existingRole = user.spd_spd_role_spd_portaluser.First();
            spd_role newRole = existingRole;
            string existingRoleName = _dynaContext.LookupRoleKeyById((Guid)existingRole.spd_roleid);
            if (existingRoleName != updateUserCmd.User.ContactAuthorizationTypeCode.ToString()) //role changed
            {
                _dynaContext.DeleteLink(existingRole, nameof(existingRole.spd_spd_role_spd_portaluser), user);

                newRole = _dynaContext.LookupRole(updateUserCmd.User.ContactAuthorizationTypeCode.ToString());
                if (newRole != null)
                {
                    _dynaContext.AddLink(newRole, nameof(newRole.spd_spd_role_spd_portaluser), user);
                }
            }
            _dynaContext.UpdateObject(user);
            await _dynaContext.SaveChangesAsync(cancellationToken);

            user.spd_spd_role_spd_portaluser = new Collection<spd_role> { new spd_role() { spd_roleid = newRole.spd_roleid } };
            return new OrgUserManageResult(_mapper.Map<UserResult>(user));
        }

        private async Task<OrgUserManageResult> DeleteUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = GetUserById(userId);
            if (user._spd_identityid_value.HasValue)
            {
                // Inactivate the user
                user.statecode = DynamicsConstants.StateCode_Inactive;
                user.statuscode = DynamicsConstants.StatusCode_Inactive;
                _dynaContext.UpdateObject(user);
            }
            else
            {
                // Delete user and invitation
                _dynaContext.DeleteObject(user);
                var invition = GetPortalInvitationByUserId(userId);
                _dynaContext.DeleteObject(invition);
            }

            await _dynaContext.SaveChangesAsync(cancellationToken);
            return new OrgUserManageResult(null);
        }

        private async Task<OrgUserResult> GetUserAsync(Guid userId, CancellationToken ct)
        {
            var user = GetUserById(userId);
            return new OrgUserResult(_mapper.Map<UserResult>(user));
        }

        private async Task<OrgUsersResult> GetUsersByOrgIdAsync(Guid organizationId, CancellationToken cancellationToken)
        {
            var users = _dynaContext.spd_portalusers
                .Expand(u => u.spd_spd_role_spd_portaluser)
                .Where(a => a._spd_organizationid_value == organizationId && a.statecode == DynamicsConstants.StateCode_Active)
                .ToList();

            if (users == null) throw new NotFoundException(HttpStatusCode.BadRequest, $"Cannot find the users with organizationId {organizationId}");

            //todo: investigate why expand does not work here.
            await Parallel.ForEachAsync(users, cancellationToken, async (user, cancellationToken) =>
            {
                var role = _dynaContext
                    .spd_spd_role_spd_portaluserset
                    .Where(r => r.spd_portaluserid == user.spd_portaluserid)
                    .FirstOrDefault();
                if (role != null)
                    user.spd_spd_role_spd_portaluser = new Collection<spd_role> { new spd_role() { spd_roleid = role.spd_roleid } };
            });

            return new OrgUsersResult(_mapper.Map<IEnumerable<UserResult>>(users));
        }

        private account? GetOrganizationById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();

            if (account?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(HttpStatusCode.BadRequest, $"Organization {organizationId} is inactive.");
            return account;
        }

        private spd_portalinvitation? GetPortalInvitationByUserId(Guid userId)
        {
            var spd_portalinvitation = _dynaContext.spd_portalinvitations
                .Where(a => a._spd_portaluserid_value == userId)
                .FirstOrDefault();

            return spd_portalinvitation;
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
                    throw new InactiveException(HttpStatusCode.BadRequest, $"User {userId} is inactive.");

                if (user != null)
                    return user;
                else
                    throw new NotFoundException(HttpStatusCode.BadRequest, $"Cannot find the user with userId {userId}");
            }
            catch (DataServiceQueryException ex)
            {
                _logger.LogWarning($"Cannot find the user with userId {userId}");
                throw;
            }
        }
    }
}
