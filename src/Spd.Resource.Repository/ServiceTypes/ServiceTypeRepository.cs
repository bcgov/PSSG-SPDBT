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

    public async Task<ServiceTypeListResp> QueryAsync(ServiceTypeQry query, CancellationToken cancellationToken)
    {
        if (query.ServiceTypeCode == null && query.ServiceTypeId == null)
        {
            throw new ArgumentException("must be at leaset one qry parameter.");
        }

        IEnumerable<spd_servicetype> servicetypes = await _cache.GetAsync(
            "spd_servicetypes",
            async ct => (await _context.spd_servicetypes.GetAllPagesAsync(ct)).ToList(),
            TimeSpan.FromMinutes(60),
            cancellationToken) ?? [];

        if (query.ServiceTypeId != null)
        {
            servicetypes = servicetypes.Where(s => s.spd_servicetypeid == query.ServiceTypeId);
        }
        if (query.ServiceTypeCode != null && DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(query.ServiceTypeCode.ToString()!, out Guid guid))
        {
            servicetypes = servicetypes.Where(s => s.spd_servicetypeid == guid);
        }
        var list = _mapper.Map<IEnumerable<ServiceTypeResp>>(servicetypes);
        var response = new ServiceTypeListResp();
        response.Items = list;
        return response;
    }
}