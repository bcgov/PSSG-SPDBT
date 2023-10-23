using AutoMapper;
using Microsoft.Dynamics.CRM;
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
        return cmd switch
        {
            CreateLicenceCmd c => await LicenceCreateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<LicenceResp> LicenceCreateAsync(CreateLicenceCmd cmd, CancellationToken ct)
    {
        if (cmd.LicenceId != null)
        {
            spd_application? application = await _context.GetApplicationById((Guid)cmd.LicenceId, ct);
            if (application == null)
                throw new ArgumentException("invalid application id");
        }

        return null;
    }


}


