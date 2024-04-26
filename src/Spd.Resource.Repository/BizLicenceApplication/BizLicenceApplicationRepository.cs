using AutoMapper;
using Spd.Utilities.Dynamics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.BizLicenceApplication;
internal class BizLicenceApplicationRepository : IBizLicenceApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public BizLicenceApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<Guid> CreateBizLicenceApplicationAsync(CreateBizLicenceApplicationCmd cmd, CancellationToken ct)
    {
        return Guid.NewGuid();
    }
}
