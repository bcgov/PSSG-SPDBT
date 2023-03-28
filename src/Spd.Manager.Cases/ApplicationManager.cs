using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager
        : IRequestHandler<ApplicationInviteCreateCommand, IEnumerable<ApplicationInviteCreateResponse>>,
        IApplicationManager
    {
        private readonly IApplicationRepository _screeningRepository;
        private readonly IMapper _mapper;
        public ApplicationManager(IApplicationRepository screeningRepository, IMapper mapper)
        {
            _screeningRepository = screeningRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ApplicationInviteCreateResponse>> Handle(ApplicationInviteCreateCommand request, CancellationToken cancellationToken)
        {
            //todo: duplication check?

            var cmd = _mapper.Map<ApplicationInviteCreateCmd>(request);
            var resp = await _screeningRepository.AddApplicationInvitesAsync(cmd, cancellationToken);
            return _mapper.Map<IEnumerable<ApplicationInviteCreateResponse>>(resp);
        }
    }
}