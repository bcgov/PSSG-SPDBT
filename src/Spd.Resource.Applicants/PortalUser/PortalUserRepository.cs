using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.PortalUser;
internal class PortalUserRepository : IPortalUserRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public PortalUserRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<PortalUserListResp> QueryAsync(PortalUserQry qry, CancellationToken ct)
    {
        IQueryable<spd_portaluser> users = _context.spd_portalusers
            .Expand(d => d.spd_OrganizationId);

        if (!qry.IncludeInactive)
            users = users.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.OrganizationId != null) users = users.Where(d => d._spd_organizationid_value == qry.OrganizationId);
        if (qry.UserEmail != null)
        {
            users = users.Where(d => d.spd_emailaddress1 == qry.UserEmail);
        }
        return new PortalUserListResp
        {
            Items = _mapper.Map<IEnumerable<PortalUserResp>>(users.ToList())
        };
    }

    public async Task<PortalUserResp> ManageAsync(PortalUserCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            UpdatePortalUserCmd c => await UpdatePortalUserAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<PortalUserResp> UpdatePortalUserAsync(UpdatePortalUserCmd c, CancellationToken ct)
    {
        return null;
    }

}


