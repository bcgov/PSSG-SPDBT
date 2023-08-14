using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Delegates;
internal class DelegateRepository : IDelegateRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public DelegateRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<DelegateListResp> QueryAsync(DelegateQry qry, CancellationToken ct)
    {
        IQueryable<spd_delegate> delegates = _context.spd_delegates
            .Expand(d => d.spd_ApplicationId)
            .Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.ApplicationId != null) delegates = delegates.Where(d => d._spd_applicationid_value == qry.ApplicationId);
        if (qry.PortalUserId != null) delegates = delegates.Where(d => d._spd_portaluserid_value == qry.PortalUserId);
        return new DelegateListResp
        {
            Items = _mapper.Map<IEnumerable<DelegateResp>>(delegates)
        };
    }

    public async Task<DelegateResp> ManageAsync(DelegateCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            CreateDelegateCmd c => await CreatePssoUserAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<DelegateResp> CreatePssoUserAsync(CreateDelegateCmd c, CancellationToken ct)
    {
        spd_application app = await _context.GetApplicationById(c.ApplicationId, ct);
        spd_portaluser user = await _context.GetUserById(c.PortalUserId, ct);
        spd_delegate d = _mapper.Map<spd_delegate>(c);
        _context.AddTospd_delegates(d);
        _context.SetLink(d, nameof(d.spd_ApplicationId), app);
        _context.SetLink(d, nameof(d.spd_PortalUserId), user);

        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DelegateResp>(d);
    }

}


