using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Alias;
internal class AliasRepository : IAliasRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<AliasRepository> _logger;

    public AliasRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<AliasRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Guid?> CreateAliasAsync(CreateAliasCommand cmd, CancellationToken ct)
    {
        contact? contact = await _context.GetContactById(cmd.ContactId, ct);
        spd_alias alias = _mapper.Map<spd_alias>(cmd.Alias);
        CreateAlias(contact, alias);
        await _context.SaveChangesAsync(ct);
        return alias.spd_aliasid;
    }

    public async Task DeleteAliasAsync(List<Guid?> aliasIds, CancellationToken ct)
    {
        foreach (var aliasId in aliasIds)
        {
            spd_alias? alias = _context.spd_aliases.Where(a =>
                a.spd_aliasid == aliasId &&
                a.statecode == DynamicsConstants.StateCode_Active &&
                a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
            ).FirstOrDefault();

            if (alias == null)
            {
                _logger.LogError($"Alias to be deleted was not found");
                throw new ArgumentException("cannot find alias to be deleted");
            }

            alias.statecode = DynamicsConstants.StateCode_Inactive;
            alias.statuscode = DynamicsConstants.StatusCode_Inactive;
            _context.UpdateObject(alias);
        }

        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAliasAsync(UpdateAliasCommand cmd, CancellationToken ct)
    {
        foreach (AliasResp alias in cmd.Aliases)
        {
            spd_alias? existingAlias = _context.spd_aliases.Where(a =>
                a.spd_aliasid == alias.Id &&
                a.statecode == DynamicsConstants.StateCode_Active &&
                a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
            ).FirstOrDefault();

            if (existingAlias == null)
            {
                _logger.LogError($"Alias to be updated was not found");
                throw new ArgumentException("cannot find alias to be updated");
            }

            existingAlias.spd_firstname = alias.GivenName;
            existingAlias.spd_surname = alias.Surname;
            existingAlias.spd_middlename1 = alias.MiddleName1;
            existingAlias.spd_middlename2 = alias.MiddleName2;
            _context.UpdateObject(existingAlias);
        }
        await _context.SaveChangesAsync(ct);
    }

    private void CreateAlias(contact contact,
        spd_alias alias)
    {
        if (AliasExists(alias, contact) == null)
        {
            _context.AddTospd_aliases(alias);
            // associate alias to contact
            _context.SetLink(alias, nameof(alias.spd_ContactId), contact);
        }
    }

    private spd_alias? AliasExists(spd_alias newAlias, contact contact)
    {
        var matchingAlias = _context.spd_aliases.Where(o =>
           o.spd_firstname == newAlias.spd_firstname &&
           o.spd_middlename1 == newAlias.spd_middlename1 &&
           o.spd_middlename2 == newAlias.spd_middlename2 &&
           o.spd_surname == newAlias.spd_surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contactid_value == contact.contactid &&
           o.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
       ).FirstOrDefault();
        return matchingAlias;
    }
}
