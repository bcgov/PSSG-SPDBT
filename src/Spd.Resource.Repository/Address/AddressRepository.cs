using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Biz;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Address;
internal class AddressRepository : IAddressRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<BizRepository> _logger;

    public AddressRepository(IDynamicsContextFactory ctx,
            IMapper mapper,
            ILogger<BizRepository> logger)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
        _logger = logger;
    }

    public async Task DeleteAddressesAsync(List<Guid?> addressIds, CancellationToken ct)
    {
        foreach (var addressId in addressIds)
        {
            spd_address? address = _context.spd_addresses.Where(a =>
                a.spd_addressid == addressId &&
                a.statecode == DynamicsConstants.StateCode_Active
            ).FirstOrDefault();

            if (address == null)
            {
                _logger.LogError($"Address to be deleted was not found");
                throw new ArgumentException("cannot find address to be deleted");
            }

            address.statecode = DynamicsConstants.StateCode_Inactive;
            address.statuscode = DynamicsConstants.StatusCode_Inactive;
            _context.UpdateObject(address);
        }

        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAddressAsync(UpdateAddressCmd cmd, CancellationToken ct)
    {
        foreach (BranchAddr address in cmd.Addresses)
        {
            spd_address? existingAddress = _context.spd_addresses.Where(a =>
                a.spd_addressid == address.BranchId &&
                a.statecode == DynamicsConstants.StateCode_Active
            ).FirstOrDefault();

            if (existingAddress == null)
            {
                _logger.LogError($"Address to be updated was not found");
                throw new ArgumentException("cannot find address to be updated");
            }

            _mapper.Map(address, existingAddress);
            _context.UpdateObject(existingAddress);
        }
        await _context.SaveChangesAsync(ct);
    }
}
