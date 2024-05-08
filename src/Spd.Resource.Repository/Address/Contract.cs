using Spd.Resource.Repository.Biz;

namespace Spd.Resource.Repository.Address;
public interface IAddressRepository
{
    Task<AddressListResp> QueryAsync(AddressQry qry, CancellationToken ct);
    Task DeleteAddressesAsync(List<Guid?> addressIds, CancellationToken cancellationToken);
    Task UpdateAddressesAsync(UpdateAddressCmd cmd, CancellationToken ct);
}

public record AddressQry
{
    public Guid? OrganizationId { get; set; }
    public AddressTypeEnum? Type { get; set; }
    public bool IncludeInactive { get; set; }
}

public record UpdateAddressCmd
{
    public IEnumerable<BranchAddr> Addresses { get; set; } = [];
}

public record AddressListResp
{
    public IEnumerable<AddressResp> Items { get; set; } = [];
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