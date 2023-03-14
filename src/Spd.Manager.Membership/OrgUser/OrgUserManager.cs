using AutoMapper;
using MediatR;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership.OrgUser
{
    public class OrgUserManager
        : IRequestHandler<CreateOrgUserCommand, Unit>,
        IOrgUserManager
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IMapper _mapper;
        public OrgUserManager(IOrganizationRepository organizationRepository, IMapper mapper)
        {
            _organizationRepository = organizationRepository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(CreateOrgUserCommand request, CancellationToken cancellationToken)
        {
            var createOrgUser = _mapper.Map<CreateUserCmd>(request.CreateOrgUserRequest);
            await _organizationRepository.AddUserAsync(createOrgUser, cancellationToken);

            return default;
        }
    }
}
