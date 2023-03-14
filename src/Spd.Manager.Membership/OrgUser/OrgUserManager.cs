using AutoMapper;
using MediatR;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership.OrgUser
{
    public class OrgUserManager
        : IRequestHandler<OrgUserCreateCommand, OrgUserResponse>,
        IOrgUserManager
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IMapper _mapper;
        public OrgUserManager(IOrganizationRepository organizationRepository, IMapper mapper)
        {
            _organizationRepository = organizationRepository;
            _mapper = mapper;
        }

        public async Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken cancellationToken)
        {
            var createOrgUser = _mapper.Map<CreateUserCmd>(request.OrgUserCreateRequest);
            var response = await _organizationRepository.AddUserAsync(createOrgUser, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}