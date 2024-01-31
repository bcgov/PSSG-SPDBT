using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<IApplicationRepository> _logger;

    public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<IApplicationRepository> logger)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
        _logger = logger;
    }
}


