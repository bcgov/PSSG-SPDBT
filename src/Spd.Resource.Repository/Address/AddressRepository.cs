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

    public async Task<IEnumerable<AddressResp>> QueryAsync(AddressQry qry, CancellationToken ct)
    {
        IQueryable<spd_address> addresses = _context.spd_addresses;

        if (qry.OrganizationId == null && qry.Type == null)
        {
            throw new ArgumentException("at least need 1 parameter to do address query.");
        }

        if (!qry.IncludeInactive)
            addresses = addresses.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.OrganizationId != null)
            addresses = addresses.Where(a => a._spd_organization_value == qry.OrganizationId);

        if (qry.Type != null)
            addresses = addresses.Where(a => a.spd_type == (int)Enum.Parse<AddressTypeOptionSet>(qry.Type.ToString()));

        return _mapper.Map<IEnumerable<AddressResp>>(addresses);
    }

    public async Task<IEnumerable<AddressResp>> CreateAddressesAsync(UpsertAddressCmd cmd, CancellationToken ct)
    {
        List<AddressResp> createdAddresses = new();

        foreach (BranchAddr address in cmd.Addresses)
        {
            spd_address addressToCreate = _mapper.Map<spd_address>(address);
            IQueryable<account> accounts = _context.accounts.Where(a => a.accountid == cmd.BizId && a.statecode != DynamicsConstants.StateCode_Inactive);
            account? biz = await accounts.FirstOrDefaultAsync(ct);

            if (biz == null)
            {
                _logger.LogError($"Biz to be linked to address was not found");
                throw new ArgumentException("cannot find biz to be linked");
            }

            CreateAddress(biz, addressToCreate);
            await _context.SaveChangesAsync(ct);
            AddressResp createdAddress = _mapper.Map<AddressResp>(address);
            createdAddresses.Add(createdAddress);
        }

        return createdAddresses;
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

    public async Task UpdateAddressesAsync(UpsertAddressCmd cmd, CancellationToken ct)
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

    private void CreateAddress(account account, spd_address address)
    {
        _context.AddTospd_addresses(address);
        _context.SetLink(address, nameof(address.spd_Organization), account);
    }
}
