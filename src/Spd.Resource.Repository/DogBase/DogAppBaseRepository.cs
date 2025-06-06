using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.DogBase;
internal abstract class DogAppBaseRepository : IDogAppBaseRepository
{
    protected readonly DynamicsContext _context;
    protected readonly IMapper _mapper;

    public DogAppBaseRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task CommitAppAsync(CommitAppCmd cmd, CancellationToken ct)
    {
        spd_application? app = await _context.GetApplicationById(cmd.LicenceAppId, ct);
        if (app == null)
            throw new ApiException(HttpStatusCode.BadRequest, "Invalid ApplicationId");

        //spdbt-4143: dog app, no need to verify identification, app go directly to submitted.
        app.statuscode = (int)Enum.Parse<ApplicationStatusOptionSet>(ApplicationStatusEnum.Submitted.ToString());
        app.statecode = DynamicsConstants.StateCode_Inactive;
        app.spd_submittedon = DateTimeOffset.UtcNow;
        app.spd_portalmodifiedon = DateTimeOffset.UtcNow;
        app.spd_licencefee = 0;
        _context.UpdateObject(app);
        await _context.SaveChangesAsync(ct);
    }
}
