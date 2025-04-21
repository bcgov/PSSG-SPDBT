using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.DogTeam;
internal class DogTeamRepository : IDogTeamRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public DogTeamRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<DogTeamResp> GetAsync(Guid id, CancellationToken ct)
    {
        spd_dogteam? dogteam = _context.spd_dogteams
            .Expand(d => d.spd_DogId)
            .Expand(d => d.spd_ContactId)
            .Where(d => d.spd_dogteamid == id)
            .FirstOrDefault();

        return _mapper.Map<DogTeamResp>(dogteam);
    }

}

