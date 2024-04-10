using AutoMapper;
using MediatR;
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

    public async Task<Unit> CreateAliasAsync(CreateAliasCommand cmd, CancellationToken ct)
    {
        contact? contact = await _context.GetContactById(cmd.ContactId, ct);

        if (cmd.Alias.Id == Guid.Empty)
            cmd.Alias.Id = null;

        await _context.CreateAlias(contact, _mapper.Map<spd_alias>(cmd.Alias), ct);
        await _context.SaveChangesAsync(ct);

        return default;
    }

    public async Task DeleteAliasAsync(Guid aliasId, CancellationToken ct)
    {
        spd_alias? alias = _context.spd_aliases.Where(a =>
            a.spd_aliasid == aliasId &&
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
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAliasAsync(UpdateAliasCommand cmd, CancellationToken ct)
    {
        foreach (Alias alias in cmd.Aliases)
        {
            spd_alias? existingAlias = _context.spd_aliases.Where(a =>
                a.spd_aliasid == alias.Id &&
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
}
