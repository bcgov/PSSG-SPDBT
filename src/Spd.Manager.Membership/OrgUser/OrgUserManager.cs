using AutoMapper;
using MediatR;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership.OrgUser
{
    public class OrgUserManager
        : IRequestHandler<OrgUserCreateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserGetCommand, OrgUserResponse>,
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

        public async Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken cancellationToken)
        {
            var updateOrgUser = _mapper.Map<CreateUserCmd>(request.OrgUserUpdateRequest);
            var response = await _organizationRepository.AddUserAsync(updateOrgUser, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public async Task<OrgUserResponse> Handle(OrgUserGetCommand request, CancellationToken cancellationToken)
        {
            var response = await _organizationRepository.GetUserAsync(request.UserId, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public async Task<IEnumerable<OrgUserResponse>> Handle(OrgUserListCommand request, CancellationToken cancellationToken)
        {
            var response = await _organizationRepository.GetUsersAsync(request.organizationId, cancellationToken);
            return _mapper.Map<IEnumerable<OrgUserResponse>>(response);
        }

        public async Task<Unit> Handle(OrgUserDeleteCommand request, CancellationToken cancellationToken)
        {
           // await _organizationRepository.OrgUserDeleteAsync(request.userId, cancellationToken);
            return default;
        }
    }
}