using AutoMapper;
using MediatR;
using Spd.Manager.Membership.ViewModels;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership
{
    public class OrgRegistrationManager
        : IRequestHandler<CreateOrgRegistrationCommand, Unit>,
        IOrgRegistrationManager
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IMapper _mapper;
        public OrgRegistrationManager(IOrganizationRepository organiztionRepository, IMapper mapper)
        {
            _organizationRepository = organiztionRepository;
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
