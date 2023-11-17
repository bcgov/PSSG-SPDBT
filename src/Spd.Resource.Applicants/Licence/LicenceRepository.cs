using AutoMapper;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Resource.Applicants.Licence;
internal class LicenceRepository : ILicenceRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicenceRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        IFileStorageService fileStorageService,
        ITempFileStorageService tempFileService)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }
    public async Task<LicenceListResp> QueryAsync(LicenceQry qry, CancellationToken ct)
    {
        if (qry.LicenceNumber == null)
        {
            return new LicenceListResp();
        }

        var app = await _context.spd_licences
            .Where(a => a.spd_licencenumber == qry.LicenceNumber).SingleOrDefaultAsync(ct);

        var response = new LicenceListResp();
        response.Items = new List<LicenceResp>() { _mapper.Map<LicenceResp>(app) };
        return response;
    }

    public async Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken ct)
    {
        return null;
    }
}


