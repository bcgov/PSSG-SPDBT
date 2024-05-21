using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.BizApplication;
internal class BizApplicationRepository : IBizApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public BizApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<BizLicenceApplicationCmdResp> SaveBizLicenceApplicationAsync(SaveBizLicenceApplicationCmd cmd, CancellationToken ct)
    {
        return null;
    }
}
