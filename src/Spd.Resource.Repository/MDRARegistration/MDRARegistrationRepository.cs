using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.MDRARegistration;
internal class MDRARegistrationRepository : IMDRARegistrationRepository
{
    public MDRARegistrationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    { }

    public async Task<MDRARegistrationResp> CreateMDRARegistrationAsync(CreateMDRARegistrationCmd cmd, CancellationToken ct)
    {

        //await _context.SaveChangesAsync(ct);
        //if (app == null || contact == null)
        //    throw new ApiException(HttpStatusCode.InternalServerError);
        return new MDRARegistrationResp(Guid.Empty);
    }

}
