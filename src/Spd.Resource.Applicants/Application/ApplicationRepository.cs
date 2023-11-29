using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<IApplicationRepository> _logger;
    private readonly List<ServiceTypeEnum> ScreeningServiceTypes = new List<ServiceTypeEnum>() { ServiceTypeEnum.PSSO, ServiceTypeEnum.CRRP_EMPLOYEE, ServiceTypeEnum.CRRP_VOLUNTEER };

    public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<IApplicationRepository> logger)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
        _logger = logger;
    }
}


