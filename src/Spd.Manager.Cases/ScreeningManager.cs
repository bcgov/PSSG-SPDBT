using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class ScreeningManager
        : IRequestHandler<ScreeningInviteCreateCommand, IList<ScreeningInviteCreateResponse>>,
        IScreeningManager
    {
        private readonly IScreeningRepository _screeningRepository;
        private readonly IMapper _mapper;
        public ScreeningManager(IScreeningRepository screeningRepository, IMapper mapper)
        {
            _screeningRepository = screeningRepository;
            _mapper = mapper;
        }

        public async Task<IList<ScreeningInviteCreateResponse>> Handle(ScreeningInviteCreateCommand request, CancellationToken cancellationToken)
        {
            //todo: duplication check?

            var cmd = _mapper.Map<ScreeningInviteCreateCmd>(request);
            var resp = await _screeningRepository.AddScreeningInvitesAsync(cmd, cancellationToken);
            return _mapper.Map<IList<ScreeningInviteCreateResponse>>(resp);
        }
    }
}