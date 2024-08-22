using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.WorkerLicenceCategory;

internal class WorkerLicenceCategoryRepository : IWorkerLicenceCategoryRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;

    public WorkerLicenceCategoryRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _cache = cache;
    }

    public async Task<WorkerLicenceCategoryListResp> QueryAsync(WorkerLicenceCategoryQry qry, CancellationToken cancellationToken)
    {
        if (qry.WorkerCategoryType == null && qry.WorkerCategoryTypeId == null)
        {
            throw new ArgumentException("must have at least one qry parameter.");
        }

        //Yossi, please revert back to your code when you figure out the root cause
        //change
        //var categories = await _cache.GetAsync("spd_licencecategory", async ct => await _context.spd_licencecategories.GetAllPagesAsync(ct), TimeSpan.FromMinutes(10), cancellationToken);
        //to
        IEnumerable<spd_licencecategory>? categories = await _cache.GetAsync<IEnumerable<spd_licencecategory>>("spd_licencecategory", cancellationToken);
        if (categories == null)
        {
            categories = _context.spd_licencecategories.ToList();
            await _cache.SetAsync<IEnumerable<spd_licencecategory>>("spd_licencecategory", categories, new TimeSpan(1, 0, 0));
        }
        //change

        if (qry.WorkerCategoryTypeId != null)
        {
            categories = categories.Where(s => s.spd_licencecategoryid == qry.WorkerCategoryTypeId);
        }
        if (qry.WorkerCategoryType != null)
        {
            var keyExisted = DynamicsContextLookupHelpers.LicenceCategoryDictionary.TryGetValue(qry.WorkerCategoryType.ToString(), out Guid guid);
            categories = categories.Where(s => s.spd_licencecategoryid == guid);
        }
        var list = _mapper.Map<IEnumerable<WorkerLicenceCategoryResp>>(categories);
        var response = new WorkerLicenceCategoryListResp();
        response.Items = list;
        return response;
    }
}