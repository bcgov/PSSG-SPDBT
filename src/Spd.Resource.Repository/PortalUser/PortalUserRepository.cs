using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.PortalUser;
internal class PortalUserRepository : IPortalUserRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PortalUserRepository> _logger;

    public PortalUserRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<PortalUserRepository> logger)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PortalUserListResp> QueryAsync(PortalUserQry qry, CancellationToken cancellationToken)
    {
        IQueryable<spd_portaluser> users = _context.spd_portalusers
            .Expand(u => u.spd_spd_role_spd_portaluser)
            .Expand(d => d.spd_OrganizationId);

        if (!qry.IncludeInactive)
            users = users.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.OrgId != null) users = users.Where(d => d._spd_organizationid_value == qry.OrgId);
        if (qry.UserEmail != null) users = users.Where(d => d.spd_emailaddress1 == qry.UserEmail);
        if (qry.IdentityId != null) users = users.Where(d => d._spd_identityid_value == qry.IdentityId);
        if (qry.PortalUserServiceCategory == null || qry.PortalUserServiceCategory == PortalUserServiceCategoryEnum.Screening)
            users = users.Where(d => d.spd_servicecategory == null || d.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Screening);
        else
            users = users.Where(d => d.spd_servicecategory == (int)PortalUserServiceCategoryOptionSet.Licensing);

        List<spd_portaluser> userList = users.ToList();
        IEnumerable<spd_portaluser> results = userList;
        if (qry.ParentOrgId != null)
        {
            results = userList.Where(u => u.spd_OrganizationId._parentaccountid_value == qry.ParentOrgId);
        }
        if (qry.OrgIdOrParentOrgId != null)
        {
            results = userList.Where(d => d._spd_organizationid_value == qry.OrgIdOrParentOrgId || d.spd_OrganizationId?._parentaccountid_value == qry.OrgIdOrParentOrgId);
        }
        return new PortalUserListResp
        {
            Items = _mapper.Map<IEnumerable<PortalUserResp>>(results)
        };
    }

    public async Task<PortalUserResp> ManageAsync(PortalUserCmd cmd, CancellationToken cancellationToken)
    {
        return cmd switch
        {
            UpdatePortalUserCmd c => await UpdatePortalUserAsync(c, cancellationToken),
            CreatePortalUserCmd c => await CreatePortalUserAsync(c, cancellationToken),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<PortalUserResp> UpdatePortalUserAsync(UpdatePortalUserCmd c, CancellationToken ct)
    {
        spd_portaluser? portalUser = await _context.GetUserById(c.Id, ct);
        if (portalUser == null)
        {
            throw new ArgumentException($"Cannot find the user for userId {c.Id}");
        }
        account? org = null;
        spd_identity? identity = null;
        if (c.FirstName != null) portalUser.spd_firstname = c.FirstName;
        if (c.LastName != null) portalUser.spd_surname = c.LastName;
        if (c.EmailAddress != null) portalUser.spd_emailaddress1 = c.EmailAddress;
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
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<PortalUserResp>(portalUser);
    }

    private async Task<PortalUserResp> CreatePortalUserAsync(CreatePortalUserCmd c, CancellationToken ct)
    {
        spd_portaluser portaluser = _mapper.Map<spd_portaluser>(c);
        _context.AddTospd_portalusers(portaluser);
        account? org = await _context.GetOrgById((Guid)c.OrgId, ct);
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
        if (org == null)
        {
            _logger.LogError($"no valid org is found by orgId {c.OrgId}");
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "The organization is not valid.");
        }
        _context.SetLink(portaluser, nameof(portaluser.spd_OrganizationId), org);
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
        await _context.SaveChangesAsync(ct);
        PortalUserResp userResp = _mapper.Map<PortalUserResp>(portaluser);
        userResp.OrganizationId = c.OrgId;
        userResp.ContactRoleCode = c.ContactRoleCode;
        return userResp;
    }
}


