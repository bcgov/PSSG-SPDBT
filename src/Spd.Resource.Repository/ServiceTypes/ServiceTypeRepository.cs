using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Cache;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.ServiceTypes;
internal class ServiceTypeRepository : IServiceTypeRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;

    public ServiceTypeRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _cache = cache;
    }

    public async Task<ServiceTypeListResp> QueryAsync(ServiceTypeQry qry, CancellationToken cancellationToken)
    {
        IEnumerable<spd_servicetype>? servicetypes = await _cache.Get<IEnumerable<spd_servicetype>>("spd_servicetypes");
        if (servicetypes == null)
        {
            servicetypes = _context.spd_servicetypes.ToList();
            await _cache.Set<IEnumerable<spd_servicetype>>("spd_servicetypes", servicetypes, new TimeSpan(1, 0, 0));
        }

        servicetypes = servicetypes.Where(s => s.spd_servicetypeid == qry.ServiceTypeId);
        var list = _mapper.Map<IEnumerable<ServiceTypeResp>>(servicetypes);
        var response = new ServiceTypeListResp();
        response.Items = list;
        return response;
    }
}
