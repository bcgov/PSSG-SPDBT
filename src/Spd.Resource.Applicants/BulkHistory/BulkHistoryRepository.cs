using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.BulkHistory;
internal class BulkHistoryRepository : IBulkHistoryRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;


    public BulkHistoryRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<BulkHistoryListResp> QueryAsync(BulkHistoryListQry query, CancellationToken cancellationToken)
    {
        IQueryable<spd_genericupload> uploads = _context.spd_genericuploads
            .Where(u => u._spd_organizationid_value == query.OrgId)
            .Where(u => u.statecode==DynamicsConstants.StateCode_Active)
            .
        return null;
    }


}


