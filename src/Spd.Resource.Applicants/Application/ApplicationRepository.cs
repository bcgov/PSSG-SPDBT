using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }
}


