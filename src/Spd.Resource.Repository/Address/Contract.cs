using Spd.Resource.Repository.Biz;

namespace Spd.Resource.Repository.Address;
public interface IAddressRepository
{
    Task DeleteAddressesAsync(List<Guid?> addressIds, CancellationToken cancellationToken);
    Task UpdateAddressesAsync(UpdateAddressCmd cmd, CancellationToken ct);
}

public record UpdateAddressCmd
{
    public IEnumerable<BranchAddr> Addresses { get; set; } = [];
}