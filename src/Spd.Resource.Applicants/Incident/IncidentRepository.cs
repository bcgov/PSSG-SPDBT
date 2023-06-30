using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Incident;
internal class IncidentRepository : IIncidentRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public IncidentRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<IncidentResp> ManageAsync(IncidentCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            CreateIncidentCmd c => await IncidentCreateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<IncidentResp> IncidentCreateAsync(CreateIncidentCmd cmd, CancellationToken ct)
    {
        return null;
    }


}


