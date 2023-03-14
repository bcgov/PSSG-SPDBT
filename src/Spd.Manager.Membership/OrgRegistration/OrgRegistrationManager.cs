using AutoMapper;
using MediatR;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership.OrgRegistration
{
    public class OrgRegistrationManager
        : IRequestHandler<CreateOrgRegistrationCommand, Unit>,
        IOrgRegistrationManager
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IMapper _mapper;
        public OrgRegistrationManager(IOrganizationRepository organizationRepository, IMapper mapper)
        {
            _organizationRepository = organizationRepository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(CreateOrgRegistrationCommand request, CancellationToken cancellationToken)
        {
            var createOrgRegistration = _mapper.Map<CreateRegistrationCmd>(request.CreateOrgRegistrationRequest);
            await _organizationRepository.RegisterAsync(createOrgRegistration, cancellationToken);

            return default;
        }
    }
}
