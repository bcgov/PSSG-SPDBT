using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Ministry;
internal class MinistryRepository : IMinistryRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public MinistryRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<MinistryListResp> QueryAsync(MinistryQry qry, CancellationToken ct)
    {
        var ministries = _context.spd_ministries.ToList();
        return new MinistryListResp
        {
            Items = _mapper.Map<IEnumerable<MinistryResp>>(ministries)
        };
    }




}


