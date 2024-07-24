using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.User
{
    internal class OrgUserRepository : IOrgUserRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<OrgUserRepository> _logger;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public OrgUserRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgUserRepository> logger, IDataProtectionProvider dpProvider)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
            _dataProtector = dpProvider.CreateProtector(nameof(UserCreateCmd)).ToTimeLimitedDataProtector();
        }

        public async Task<OrgUserQryResult> QueryOrgUserAsync(OrgUserQry qry, CancellationToken ct)
        {
            return qry switch
            {
                OrgUserByIdQry q => await GetUserAsync(q.UserId, ct),
                OrgUsersSearch q => await SearchUsers(q.OrgId, q.IdentityId, ct),
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
                UserUpdateLoginCmd c => await UpdateUserLoginAsync(c.Id, ct),
                UserInvitationVerify v => await VerifyOrgUserInvitationAsync(v, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            }; ;
        }

        private async Task<OrgUserManageResult> VerifyOrgUserInvitationAsync(UserInvitationVerify verify, CancellationToken ct)
        {
            Guid inviteId;
            try
            {
                string inviteIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(verify.InviteIdEncryptedCode));
                inviteId = Guid.Parse(inviteIdStr);
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");
            }

            var invite = await _dynaContext.spd_portalinvitations
                .Expand(i => i.spd_OrganizationId)
                .Where(i => i.spd_portalinvitationid == inviteId)
                .Where(i => i.spd_invitationtype == (int)InvitationTypeOptionSet.PortalUser)
                .Where(i => i.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefaultAsync(ct);
            if (invite == null)
                throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");
            if (invite.spd_OrganizationId.spd_orgguid != verify.OrgGuid.ToString())
                throw new ApiException(HttpStatusCode.Accepted, "There is a mismatch between the invite organization and your bceid organization.");

            //verified, now add/link identity to user.
            spd_identity? identity = await _dynaContext.spd_identities
                .Where(i => i.spd_userguid == verify.UserGuid.ToString() && i.spd_orgguid == verify.OrgGuid.ToString())
                .Where(i => i.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefaultAsync(ct);
            if (identity == null)
            {
                identity = new spd_identity()
                {
                    spd_identityid = Guid.NewGuid(),
                    spd_orgguid = verify.OrgGuid.ToString(),
                    spd_userguid = verify.UserGuid.ToString(),
                };
                _dynaContext.AddTospd_identities(identity);
            }
            else //the user already has identity in the system, probably used by other org.
            {
                //check if current org already has the same user
                spd_portaluser? dupUser = await _dynaContext.spd_portalusers
                    .Where(u => u.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Screening || u.spd_servicecategory == null)
                    .Where(u => u._spd_identityid_value == identity.spd_identityid)
                    .Where(u => u.statecode == DynamicsConstants.StateCode_Active)
                    .Where(u => u._spd_organizationid_value == invite._spd_organizationid_value)
                    .Where(u => u.spd_portaluserid != invite._spd_portaluserid_value)
                    .FirstOrDefaultAsync(ct);
                if (dupUser != null)
                    throw new ApiException(HttpStatusCode.Accepted, "Your BCeID is already associated to a user in this organization.");
            }

            Guid userId = invite._spd_portaluserid_value ?? Guid.Empty;
            var user = await _dynaContext.GetUserById(userId, ct);
            _dynaContext.SetLink(user, nameof(user.spd_IdentityId), identity);

            //set invite views
            invite.spd_views = (invite.spd_views ?? 0) + 1;
            _dynaContext.UpdateObject(invite);

            await _dynaContext.SaveChangesAsync(ct);
            return new OrgUserManageResult(new UserResult() { OrganizationId = invite._spd_organizationid_value });
        }

        private async Task<OrgUserManageResult> AddUserAsync(UserCreateCmd createUserCmd, CancellationToken ct)
        {
            if (createUserCmd.User.OrganizationId == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Organization cannot be null");

            var organization = await _dynaContext.GetOrgById((Guid)createUserCmd.User.OrganizationId, ct);

            // create user
            spd_portaluser user = _mapper.Map<spd_portaluser>(createUserCmd.User);
            user.spd_portaluserid = Guid.NewGuid();
            _dynaContext.AddTospd_portalusers(user);
            _dynaContext.SetLink(user, nameof(spd_portaluser.spd_OrganizationId), organization);

            if (createUserCmd.IdentityId != null)
            {
                var id = await _dynaContext.GetIdentityById((Guid)createUserCmd.IdentityId, ct);
                _dynaContext.SetLink(user, nameof(spd_portaluser.spd_IdentityId), id);
            }

            if (createUserCmd.User.OrganizationId == SpdConstants.BcGovOrgId)
            {
                //psso: no role, no invitation.
                await _dynaContext.SaveChangesAsync(ct);
                return new OrgUserManageResult(_mapper.Map<UserResult>(user));
            }

            //crrp
            spd_role? role = _dynaContext.LookupRole(createUserCmd.User.ContactAuthorizationTypeCode.ToString());
            if (role != null)
            {
                _dynaContext.AddLink(role, nameof(role.spd_spd_role_spd_portaluser), user);
            }

            // create portal invitation
            if (createUserCmd.IdentityId == null)
            {
                spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(createUserCmd.User);
                Guid inviteId = Guid.NewGuid();
                invitation.spd_portalinvitationid = inviteId;
                var encryptedInviteId = WebUtility.UrlEncode(_dataProtector.Protect(inviteId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.UserInviteValidDays)));
                invitation.spd_invitationlink = $"{createUserCmd.HostUrl}{SpdConstants.UserInviteLink}{encryptedInviteId}";
                _dynaContext.AddTospd_portalinvitations(invitation);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), organization);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), user);
                if (createUserCmd.CreatedByUserId != null)
                {
                    spd_portaluser invitedBy = await _dynaContext.GetUserById((Guid)createUserCmd.CreatedByUserId, ct);
                    _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_InvitedBy), invitedBy);
                }
            }

            await _dynaContext.SaveChangesAsync(ct);

            UserResult userResult = _mapper.Map<UserResult>(user);
            userResult.OrganizationId = createUserCmd.User.OrganizationId;
            userResult.ContactAuthorizationTypeCode = createUserCmd.User.ContactAuthorizationTypeCode;
            return new OrgUserManageResult(userResult);
        }

        private async Task<OrgUserManageResult> UpdateUserAsync(UserUpdateCmd updateUserCmd, CancellationToken cancellationToken)
        {
            DataServiceCollection<spd_portaluser> users = new(_dynaContext.spd_portalusers
                    .Expand(m => m.spd_spd_role_spd_portaluser)
                    .Expand(m => m.spd_IdentityId)
                    .Where(a => a.spd_portaluserid == updateUserCmd.Id)
                    .Where(u => u.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Screening || u.spd_servicecategory == null));
            spd_portaluser? user = users.Any() ? users[0] : null;
            if (user == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the updating user with userId = {updateUserCmd.Id}");
            }
            if (updateUserCmd.OnlyChangePhoneJob)
            {
                user.spd_phonenumber = updateUserCmd.User.PhoneNumber;
                user.spd_jobtitle = updateUserCmd.User.JobTitle;
            }
            else
            {
                _mapper.Map(updateUserCmd.User, user);
            }

            spd_role existingRole = user.spd_spd_role_spd_portaluser.First();

            string existingRoleName = _dynaContext.LookupRoleKeyById((Guid)existingRole.spd_roleid);
            if (existingRoleName != updateUserCmd.User.ContactAuthorizationTypeCode.ToString()) //role changed
            {
                _dynaContext.DeleteLink(existingRole, nameof(existingRole.spd_spd_role_spd_portaluser), user);

                spd_role newRole = _dynaContext.LookupRole(updateUserCmd.User.ContactAuthorizationTypeCode.ToString());
                if (newRole != null)
                {
                    _dynaContext.AddLink(newRole, nameof(newRole.spd_spd_role_spd_portaluser), user);
                }
            }
            await _dynaContext.SaveChangesAsync(cancellationToken);

            UserResult userResult = _mapper.Map<UserResult>(user);
            userResult.ContactAuthorizationTypeCode = updateUserCmd.User.ContactAuthorizationTypeCode;
            return new OrgUserManageResult(userResult);
        }

        private async Task<OrgUserManageResult> DeleteUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await GetUserById(userId, cancellationToken);
            if (user._spd_identityid_value.HasValue)
            {
                // Inactivate the user
                user.statecode = DynamicsConstants.StateCode_Inactive;
                user.statuscode = DynamicsConstants.StatusCode_Inactive;
                _dynaContext.UpdateObject(user);
            }
            else
            {
                var invition = GetPortalInvitationByUserId(userId);
                _dynaContext.DeleteObject(invition);

                // Delete user and invitation
                _dynaContext.DeleteObject(user);
            }

            await _dynaContext.SaveChangesAsync(cancellationToken);
            return new OrgUserManageResult();
        }

        private async Task<OrgUserResult> GetUserAsync(Guid userId, CancellationToken ct)
        {
            var user = await GetUserById(userId, ct);
            return new OrgUserResult(_mapper.Map<UserResult>(user));
        }

        private async Task<OrgUsersResult> SearchUsers(Guid? organizationId, Guid? identityId, CancellationToken cancellationToken)
        {
            IQueryable<spd_portaluser> users = _dynaContext.spd_portalusers
                .Expand(u => u.spd_spd_role_spd_portaluser)
                .Expand(u => u.spd_IdentityId)
                .Where(u => u.statecode == DynamicsConstants.StateCode_Active)
                .Where(u => u.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Screening || u.spd_servicecategory == null);

            if (organizationId != null)
                users = users.Where(u => u._spd_organizationid_value == organizationId);
            if (identityId != null)
                users = users.Where(a => a._spd_identityid_value == identityId);

            return new OrgUsersResult(_mapper.Map<IEnumerable<UserResult>>(users));
        }

        private async Task<OrgUserManageResult> UpdateUserLoginAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await GetUserById(userId, cancellationToken);
            user.spd_lastloggedin = DateTime.UtcNow;
            _dynaContext.UpdateObject(user);
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return new OrgUserManageResult();
        }

        private spd_portalinvitation? GetPortalInvitationByUserId(Guid userId)
        {
            var spd_portalinvitation = _dynaContext.spd_portalinvitations
                .Where(a => a._spd_portaluserid_value == userId)
                .FirstOrDefault();

            return spd_portalinvitation;
        }

        private async Task<spd_portaluser> GetUserById(Guid userId, CancellationToken ct)
        {
            try
            {
                var user = await _dynaContext.spd_portalusers
                    .Expand(m => m.spd_spd_role_spd_portaluser)
                    .Expand(m => m.spd_IdentityId)
                    .Where(a => a.spd_portaluserid == userId)
                    .Where(u => u.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Screening || u.spd_servicecategory == null)
                    .FirstOrDefaultAsync(ct);

                if (user?.statecode == DynamicsConstants.StateCode_Inactive)
                    throw new InactiveException(HttpStatusCode.BadRequest, $"User {userId} is inactive");

                if (user != null)
                    return user;
                else
                    throw new NotFoundException(HttpStatusCode.BadRequest, $"Cannot find the user with userId {userId}");
            }
            catch (DataServiceQueryException ex)
            {
                _logger.LogWarning($"Cannot find the user with userId {userId}, message={ex.Message}");
                throw;
            }
        }
    }
}