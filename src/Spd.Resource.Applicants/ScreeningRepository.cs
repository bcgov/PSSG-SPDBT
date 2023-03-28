using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants
{
    internal class ScreeningRepository : IScreeningRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ScreeningRepository> _logger;
        public ScreeningRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ScreeningRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IList<ScreeningInviteCreateResp>> AddScreeningInvitesAsync(ScreeningInviteCreateCmd createInviteCmd, CancellationToken cancellationToken)
        {
            //todo
            return null;
        }
    }
}
