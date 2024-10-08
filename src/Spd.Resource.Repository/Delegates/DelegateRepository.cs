using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Delegates;
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
            .Expand(d => d.spd_PortalUserId)
            .Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.ApplicationId != null) delegates = delegates.Where(d => d._spd_applicationid_value == qry.ApplicationId);
        if (qry.PortalUserId != null) delegates = delegates.Where(d => d._spd_portaluserid_value == qry.PortalUserId);

        var result = delegates.ToList();
        var response = new DelegateListResp();
        var list = _mapper.Map<IEnumerable<DelegateResp>>(result);
        response.Items = list;
        return response;
    }

    public async Task<DelegateResp> ManageAsync(DelegateCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            CreateDelegateCmd c => await CreateDelegateAsync(c, ct),
            DeleteDelegateCmd c => await DeleteDelegateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<DelegateResp> CreateDelegateAsync(CreateDelegateCmd c, CancellationToken ct)
    {
        spd_application app = await _context.GetApplicationById(c.ApplicationId, ct);
        spd_portaluser? user = c.PortalUserId != null ? await _context.GetUserById((Guid)c.PortalUserId, ct) : null;
        spd_delegate d = _mapper.Map<spd_delegate>(c);
        _context.AddTospd_delegates(d);
        _context.SetLink(d, nameof(d.spd_ApplicationId), app);
        if (user != null) _context.SetLink(d, nameof(d.spd_PortalUserId), user);

        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DelegateResp>(d);
    }

    private async Task<DelegateResp> DeleteDelegateAsync(DeleteDelegateCmd c, CancellationToken ct)
    {
        spd_delegate? d = await _context.GetDelegateById(c.Id, ct);
        d.statecode = DynamicsConstants.StateCode_Inactive;
        d.statuscode = DynamicsConstants.StatusCode_Inactive;
        _context.UpdateObject(d);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DelegateResp>(d);
    }
}


