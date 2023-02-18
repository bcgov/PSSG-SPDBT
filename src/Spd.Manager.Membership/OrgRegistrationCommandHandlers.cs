using AutoMapper;
using Spd.Manager.Membership.ViewModels;
using Spd.Resource.Organizations;
using Spd.Utilities.Messaging.Contract;

namespace Spd.Manager.Membership
{
    public class OrgRegistrationCommandHandlers
    {
        public IOrganizationRepository _organizationRepository;
        public IMapper _mapper;
        public OrgRegistrationCommandHandlers(IOrganizationRepository organiztionRepository, IMapper mapper)
        {
            _organizationRepository = organiztionRepository;
            _mapper = mapper;
        }

        public async Task Handle(CreateOrgRegistrationCommand createOrgRegistrationCommand, CancellationToken cancellationToken)
        {
            var createOrgRegistration = _mapper.Map<CreateRegistrationCmd>(createOrgRegistrationCommand.CreateOrgRegistrationRequest);
            await _organizationRepository.RegisterAsync(createOrgRegistration, cancellationToken);
        }
    }
    public record CreateOrgRegistrationCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest) : Command;
}
