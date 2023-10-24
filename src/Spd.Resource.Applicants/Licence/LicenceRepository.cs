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
            SaveLicenceCmd c => await SaveLicenceAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<LicenceResp> SaveLicenceAsync(SaveLicenceCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceId != null)
        {
            app = await _context.GetApplicationById((Guid)cmd.LicenceId, ct);
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveLicenceCmd, spd_application>(cmd, app);
            _context.UpdateObject(app);
            
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        await _context.SaveChangesAsync();
        return new LicenceResp(app.spd_applicationid)
    }


}


