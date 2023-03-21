using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Registration;

namespace Spd.Manager.Membership.OrgRegistration
{
    internal class OrgRegistrationManager
        : IRequestHandler<OrgRegistrationCreateCommand, Unit>,
        IOrgRegistrationManager
    {
        private readonly IOrgRegistrationRepository _orgRegRepository;
        private readonly IMapper _mapper;
        public OrgRegistrationManager(IOrgRegistrationRepository orgRegRepository, IMapper mapper)
        {
            _orgRegRepository = orgRegRepository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(OrgRegistrationCreateCommand request, CancellationToken cacellationToken)
        {
            var createOrgRegistration = _mapper.Map<OrgRegistrationCreateCmd>(request.CreateOrgRegistrationRequest);
            await _orgRegRepository.AddRegistrationAsync(createOrgRegistration, cacellationToken);

            return default;
        }
    }
}
