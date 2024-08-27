using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.WorkerLicenceCategory;

internal class WorkerLicenceCategoryRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache) : IWorkerLicenceCategoryRepository
{
    private readonly DynamicsContext _context = ctx.Create();

    public async Task<WorkerLicenceCategoryListResp> QueryAsync(WorkerLicenceCategoryQry qry, CancellationToken cancellationToken)
    {
        if (qry.WorkerCategoryType == null && qry.WorkerCategoryTypeId == null)
        {
            throw new ArgumentException("must have at least one qry parameter.");
        }

        IEnumerable<spd_licencecategory> categories = await cache.GetAsync(
            "spd_licencecategory",
            async ct => (await _context.spd_licencecategories.GetAllPagesAsync(ct)).ToList(),
            TimeSpan.FromMinutes(10),
            cancellationToken) ?? [];

        if (qry.WorkerCategoryTypeId != null)
        {
            categories = categories.Where(s => s.spd_licencecategoryid == qry.WorkerCategoryTypeId);
        }
        if (qry.WorkerCategoryType != null && DynamicsContextLookupHelpers.LicenceCategoryDictionary.TryGetValue(qry.WorkerCategoryType.ToString()!, out Guid guid))
        {
            categories = categories.Where(s => s.spd_licencecategoryid == guid);
        }
        var list = mapper.Map<IEnumerable<WorkerLicenceCategoryResp>>(categories);
        return new WorkerLicenceCategoryListResp
        {
            Items = list
        };
    }
}