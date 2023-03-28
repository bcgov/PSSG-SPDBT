using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants
{
    internal class ApplicationRepository : IApplicationRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ApplicationRepository> _logger;
        public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ApplicationRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ApplicationInviteCreateResp>> AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken)
        {
            //todo
            return null;
        }
    }
}
