using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.WorkerLicenceCategory;
public partial interface IWorkerLicenceCategoryRepository
{
    public Task<WorkerLicenceCategoryListResp> QueryAsync(WorkerLicenceCategoryQry query, CancellationToken cancellationToken);
}

public record WorkerLicenceCategoryQry(Guid? WorkerCategoryTypeId, WorkerCategoryTypeEnum? WorkerCategoryType);

public record WorkerLicenceCategoryResp()
{
    public Guid Id { get; set; }
    public WorkerCategoryTypeEnum WorkerCategoryTypeCode { get; set; }
    public string WorkerCategoryTypeName { get; set; }
}

public record WorkerLicenceCategoryListResp
{
    public IEnumerable<WorkerLicenceCategoryResp> Items { get; set; } = Array.Empty<WorkerLicenceCategoryResp>();
}


