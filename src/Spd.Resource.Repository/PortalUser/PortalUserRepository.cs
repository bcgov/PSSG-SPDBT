using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.PortalUser;
internal class PortalUserRepository : IPortalUserRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PortalUserRepository> _logger;
    private readonly ITimeLimitedDataProtector _dataProtector;

    public PortalUserRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<PortalUserRepository> logger,
        IDataProtectionProvider dpProvider)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
        _logger = logger;
        _dataProtector = dpProvider.CreateProtector(nameof(CreatePortalUserCmd)).ToTimeLimitedDataProtector();
    }

    public async Task<PortalUserQryResp> QueryAsync(PortalUserQry qry, CancellationToken cancellationToken)
    {
        return qry switch
        {
            PortalUserByIdQry q => await GetUserAsync(q.UserId, cancellationToken),
            PortalUserQry q => await ListUsersAsync(qry, cancellationToken)
        };
    }
    public async Task<PortalUserResp> ManageAsync(PortalUserCmd cmd, CancellationToken cancellationToken)
    {
        return cmd switch
        {
            UpdatePortalUserCmd c => await UpdatePortalUserAsync(c, cancellationToken),
            CreatePortalUserCmd c => await CreatePortalUserAsync(c, cancellationToken),
            PortalUserUpdateLoginCmd c => await UpdatePortalUserLoginAsync(c.Id, cancellationToken),
            PortalUserDeleteCmd c => await DeleteProtalUserAsync(c.Id, cancellationToken),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }
    private async Task<PortalUserListResp> ListUsersAsync(PortalUserQry qry, CancellationToken cancellationToken)
    {
        IQueryable<spd_portaluser> users = _context.spd_portalusers
                    .Expand(u => u.spd_spd_role_spd_portaluser)
                    .Expand(d => d.spd_OrganizationId);
        IEnumerable<spd_portaluser> userList;

        if (!qry.IncludeInactive)
            users = users.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.OrgId != null) users = users.Where(d => d._spd_organizationid_value == qry.OrgId);
        if (qry.UserEmail != null) users = users.Where(d => d.spd_emailaddress1 == qry.UserEmail);
        if (qry.IdentityId != null) users = users.Where(d => d._spd_identityid_value == qry.IdentityId);
        if (qry.PortalUserServiceCategory == null || qry.PortalUserServiceCategory == PortalUserServiceCategoryEnum.Screening)
            users = users.Where(d => d.spd_servicecategory == null || d.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Screening);
        else
            users = users.Where(d => d.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Licensing);
        if (qry.ContactRoleCode != null && qry.ContactRoleCode.Any())
        {
            IEnumerable<Guid> crIds = qry.ContactRoleCode.Select(c => DynamicsContextLookupHelpers.RoleGuidDictionary.GetValueOrDefault(c.ToString()));
            userList = users.AsEnumerable().Where(u => crIds.Any(c => u.spd_spd_role_spd_portaluser.Any(role => role.spd_roleid == c)));
        }
        else
        {
            userList = users.ToList();
        }
        IEnumerable<spd_portaluser> results = userList;
        if (qry.ParentOrgId != null)
        {
            results = userList.Where(u => u.spd_OrganizationId._parentaccountid_value == qry.ParentOrgId);
        }
        if (qry.OrgIdOrParentOrgId != null)
        {
            results = userList.Where(d => d._spd_organizationid_value == qry.OrgIdOrParentOrgId || d.spd_OrganizationId._parentaccountid_value == qry.OrgIdOrParentOrgId);
        }
        return new PortalUserListResp
        {
            Items = _mapper.Map<IEnumerable<PortalUserResp>>(results)
        };
    }
    private async Task<PortalUserResp> DeleteProtalUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await GetUserById(userId, cancellationToken);
        if (user._spd_identityid_value.HasValue)
        {
            // Inactivate the user
            user.statecode = DynamicsConstants.StateCode_Inactive;
            user.statuscode = DynamicsConstants.StatusCode_Inactive;
            _context.UpdateObject(user);
        }
        else
        {
            //TODO: is there any situation user may not have invition? (what is invition and how to assign it to user? or vice versa)
            var invition = GetPortalInvitationByUserId(userId);
            if (invition is not null) _context.DeleteObject(invition);

            // Delete user and invitation
            _context.DeleteObject(user);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return new PortalUserResp();
    }
    private spd_portalinvitation? GetPortalInvitationByUserId(Guid userId)
    {
        var spd_portalinvitation = _context.spd_portalinvitations
            .Where(a => a._spd_portaluserid_value == userId)
            .FirstOrDefault();

        return spd_portalinvitation;
    }

    private async Task<PortalUserResp> UpdatePortalUserLoginAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await GetUserById(userId, cancellationToken);
        user.spd_lastloggedin = DateTimeOffset.UtcNow;
        _context.UpdateObject(user);
        await _context.SaveChangesAsync(cancellationToken);
        return new PortalUserResp();
    }
    private async Task<PortalUserResp> UpdatePortalUserAsync(UpdatePortalUserCmd c, CancellationToken ct)
    {
        spd_portaluser portalUser = await GetUserById(c.Id, ct);
        account? org = null;
        spd_identity? identity = null;
        if (c.FirstName != null) portalUser.spd_firstname = c.FirstName;
        if (c.LastName != null) portalUser.spd_surname = c.LastName;
        if (c.EmailAddress != null) portalUser.spd_emailaddress1 = c.EmailAddress;
        if (c.PhoneNumber != null) portalUser.spd_phonenumber = c.PhoneNumber;
        if (c.TermAgreeTime != null) portalUser.spd_lastloggedin = c.TermAgreeTime;
        _context.UpdateObject(portalUser);

        if (c.OrgId != null && portalUser._spd_organizationid_value != c.OrgId)
        {
            org = await _context.GetOrgById((Guid)c.OrgId, ct);
            _context.SetLink(portalUser, nameof(portalUser.spd_OrganizationId), org);
        }
        if (c.IdentityId != null && portalUser._spd_identityid_value != c.IdentityId)
        {
            identity = await _context.GetIdentityById((Guid)c.IdentityId, ct);
            _context.SetLink(portalUser, nameof(portalUser.spd_IdentityId), identity);
        }

        ContactRoleCode? currentContactRoleCode = SharedMappingFuncs.GetContactRoleCode(portalUser.spd_spd_role_spd_portaluser);

        if (c.ContactRoleCode != null && currentContactRoleCode != c.ContactRoleCode)
        {
            spd_role? currentRole = portalUser.spd_spd_role_spd_portaluser.FirstOrDefault();
            if (currentRole != null)
            {
                _context.DeleteLink(portalUser, nameof(portalUser.spd_spd_role_spd_portaluser), currentRole);
            }
            spd_role? role = _context.LookupRole(c.ContactRoleCode.ToString());
            if (role != null)
            {
                _context.AddLink(portalUser, nameof(portalUser.spd_spd_role_spd_portaluser), role);
            }
        }
        await _context.SaveChangesAsync(ct);

        portalUser = await GetUserById(c.Id, ct);
        return _mapper.Map<PortalUserResp>(portalUser);
    }

    private async Task<PortalUserResp> CreatePortalUserAsync(CreatePortalUserCmd c, CancellationToken ct)
    {
        spd_portaluser portaluser = _mapper.Map<spd_portaluser>(c);
        _context.AddTospd_portalusers(portaluser);
        account? org = await _context.GetOrgById((Guid)c.OrgId, ct);
        if (org == null)
        {
            _logger.LogError($"no valid org is found by orgId {c.OrgId}");
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "The organization is not valid.");
        }
        _context.SetLink(portaluser, nameof(portaluser.spd_OrganizationId), org);

        spd_identity? identity = null;
        if (c.IdentityId != null)
        {
            identity = await _context.GetIdentityById((Guid)c.IdentityId, ct);
            if (identity == null)
            {
                _logger.LogError($"no valid identity for {c.IdentityId}");
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "The identity is not valid.");
            }
        }
        if (identity != null)
            _context.SetLink(portaluser, nameof(portaluser.spd_IdentityId), identity);

        if (c.ContactRoleCode != null)
        {
            spd_role? role = _context.LookupRole(c.ContactRoleCode.ToString());
            if (role != null)
            {
                _context.AddLink(portaluser, nameof(portaluser.spd_spd_role_spd_portaluser), role);
            }
        }

        // create portal invitation
        if (c.IdentityId == null)
        {
            spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(c);
            var encryptedInviteId = WebUtility.UrlEncode(_dataProtector.Protect(invitation.spd_portalinvitationid.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.UserInviteValidDays)));
            invitation.spd_invitationlink = $"{c.HostUrl}{SpdConstants.UserInviteLink}{encryptedInviteId}";
            _context.AddTospd_portalinvitations(invitation);
            _context.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), org);
            _context.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), portaluser);
            if (c.CreatedByUserId != null)
            {
                spd_portaluser invitedBy = await _context.GetUserById((Guid)c.CreatedByUserId, ct);
                _context.SetLink(invitation, nameof(spd_portalinvitation.spd_InvitedBy), invitedBy);
            }
        }
        await _context.SaveChangesAsync(ct);

        PortalUserResp userResp = _mapper.Map<PortalUserResp>(portaluser);
        userResp.OrganizationId = c.OrgId;
        userResp.ContactRoleCode = c.ContactRoleCode;
        return userResp;
    }

    private async Task<spd_portaluser> GetUserById(Guid userId, CancellationToken ct)
    {
        try
        {
            var user = await _context.GetUserById(userId, ct);

            if (user?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(HttpStatusCode.BadRequest, $"User '{userId}' is inactive.");

            if (user != null)
                return user;
            else
                throw new NotFoundException(HttpStatusCode.BadRequest, $"The user with userId '{userId}' cannot be found.");
        }
        catch (DataServiceQueryException ex)
        {
            //is logger needed?
            //_logger.LogWarning($"Cannot find the user with userId {userId}, message={ex.Message}");
            throw;
        }
    }
    private async Task<PortalUserResp> GetUserAsync(Guid userId, CancellationToken ct)
    {
        var user = await GetUserById(userId, ct);
        var response = _mapper.Map<PortalUserResp>(user);
        return response;
    }
}