using AutoMapper;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;

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
        var ministries = _context.accounts.Where(o => o.parentaccountid.accountid == SpdConstants.BC_GOV_ORG_ID).ToList();
        return new MinistryListResp
        {
            Items = _mapper.Map<IEnumerable<MinistryResp>>(ministries)
        };
    }




}


