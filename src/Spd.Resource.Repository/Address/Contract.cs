using Spd.Resource.Repository.Biz;

namespace Spd.Resource.Repository.Address;
public interface IAddressRepository
{
    Task<IEnumerable<AddressResp>> QueryAsync(AddressQry qry, CancellationToken ct);
    Task<IEnumerable<AddressResp>> CreateAddressesAsync(UpsertAddressCmd cmd, CancellationToken ct);
    Task DeleteAddressesAsync(List<Guid?> addressIds, CancellationToken cancellationToken);
    Task UpdateAddressesAsync(UpsertAddressCmd cmd, CancellationToken ct);
}

public record AddressQry
{
    public Guid? OrganizationId { get; set; }
    public AddressTypeEnum? Type { get; set; }
    public bool IncludeInactive { get; set; }
}

public record UpsertAddressCmd
{
    public Guid BizId { get; set; }
    public IEnumerable<BranchAddr> Addresses { get; set; } = [];
}

public record AddressResp() : Addr
{
    public Guid? BranchId { get; set; }
    public string? BranchManager { get; set; }
    public string? BranchPhoneNumber { get; set; }
    public string? BranchEmailAddr { get; set; }
}

public enum AddressTypeEnum
{
    Physical,
    Mailing,
    Branch
}