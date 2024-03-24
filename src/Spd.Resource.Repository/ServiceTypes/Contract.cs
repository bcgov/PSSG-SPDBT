namespace Spd.Resource.Repository.ServiceTypes;
public partial interface IServiceTypeRepository
{
    public Task<ServiceTypeListResp> QueryAsync(ServiceTypeQry query, CancellationToken cancellationToken);
}


public record ServiceTypeQry
{
    public Guid ServiceTypeId { get; set; }
};

public record ServiceTypeResp()
{
    public Guid Id { get; set; }
    public decimal? ScreeningCost { get; set; }
    public ServiceTypeCategoryEnum ServiceCategoryCode { get; set; }
    public string ServiceTypeName { get; set; }
}

public record ServiceTypeListResp
{
    public IEnumerable<ServiceTypeResp> Items { get; set; } = Array.Empty<ServiceTypeResp>();
}


