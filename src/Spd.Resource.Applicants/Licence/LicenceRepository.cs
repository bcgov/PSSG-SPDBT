using AutoMapper;
using Spd.Resource.Applicants.LicenceApplication;
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
        return null;
    }
    public async Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken ct)
    {
        return null;
    }

    public async Task<LicenceLookupResp> GetLicenceLookupAsync(string licenceNumber, CancellationToken ct)
    {
        var app = await _context.spd_licences
            .Where(a => a.spd_licencenumber == licenceNumber).SingleOrDefaultAsync(ct);

        return _mapper.Map<LicenceLookupResp>(app);
    }


}


