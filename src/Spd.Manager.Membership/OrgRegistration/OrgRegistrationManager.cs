using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Registration;

namespace Spd.Manager.Membership.OrgRegistration
{
    internal class OrgRegistrationManager
        : IRequestHandler<OrgRegistrationCreateCmd, Unit>,
        IOrgRegistrationManager
    {
        private readonly IOrgRegistrationRepository _orgRegRepository;
        private readonly IMapper _mapper;
        public OrgRegistrationManager(IOrgRegistrationRepository orgRegRepository, IMapper mapper)
        {
            _orgRegRepository = orgRegRepository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(OrgRegistrationCreateCmd request, CancellationToken cancellationToken)
        {
            var createOrgRegistration = _mapper.Map<OrgRegistrationCreateCmd>(request.CreateOrgRegistrationRequest);
            await _orgRegRepository.AddRegistrationAsync(createOrgRegistration, cancellationToken);

            return default;
        }
    }
}
