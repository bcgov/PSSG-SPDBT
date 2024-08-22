using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
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
        if (qry.ServiceTypeCode == null && qry.ServiceTypeId == null)
        {
            throw new ArgumentException("must be at leaset one qry parameter.");
        }

        //Yossi, please revert back to your code when you figure out the root cause
        //change
        //var servicetypes = await _cache.GetAsync("spd_servicetypes", async ct => await _context.spd_servicetypes.GetAllPagesAsync(ct), TimeSpan.FromMinutes(60), cancellationToken);
        //to 
        IEnumerable<spd_servicetype>? servicetypes = await _cache.GetAsync<IEnumerable<spd_servicetype>>("spd_servicetypes", cancellationToken);
        if (servicetypes == null)
        {
            servicetypes = _context.spd_servicetypes.ToList();
            await _cache.SetAsync<IEnumerable<spd_servicetype>>("spd_servicetypes", servicetypes, new TimeSpan(1, 0, 0));
        }
        //change

        if (qry.ServiceTypeId != null)
        {
            servicetypes = servicetypes.Where(s => s.spd_servicetypeid == qry.ServiceTypeId);
        }
        if (qry.ServiceTypeCode != null)
        {
            var keyExisted = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(qry.ServiceTypeCode.ToString(), out Guid guid);
            servicetypes = servicetypes.Where(s => s.spd_servicetypeid == guid);
        }
        var list = _mapper.Map<IEnumerable<ServiceTypeResp>>(servicetypes);
        var response = new ServiceTypeListResp();
        response.Items = list;
        return response;
    }
}