using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.User;

namespace Spd.Manager.Membership.OrgUser
{
    internal class OrgUserManager
        : IRequestHandler<OrgUserCreateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserUpdateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserGetQuery, OrgUserResponse>,
        IRequestHandler<OrgUserDeleteCommand, Unit>,
        IRequestHandler<OrgUserListQuery, OrgUserListResponse>,
        IOrgUserManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IMapper _mapper;
        public OrgUserManager(IOrgUserRepository orgUserRepository, IMapper mapper)
        {
            _orgUserRepository = orgUserRepository;
            _mapper = mapper;
        }

        public async Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken cancellationToken)
        {
            //check if email already exists for the user
            if(await _orgUserRepository.IfUserEmailExistedAsync(request.OrgUserCreateRequest.OrganizationId, request.OrgUserCreateRequest.Email, cancellationToken))
            {
                throw 
            }
            //check if role is withing the maxium scope

            var createOrgUser = _mapper.Map<CreateUserCmd>(request.OrgUserCreateRequest);
            var response = await _orgUserRepository.AddUserAsync(createOrgUser, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public async Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken cancellationToken)
        {
            var updateOrgUser = _mapper.Map<UpdateUserCmd>(request.OrgUserUpdateRequest);
            var response = await _orgUserRepository.UpdateUserAsync(updateOrgUser, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public async Task<OrgUserResponse> Handle(OrgUserGetQuery request, CancellationToken cancellationToken)
        {
            var response = await _orgUserRepository.GetUserAsync(request.UserId, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public async Task<Unit> Handle(OrgUserDeleteCommand request, CancellationToken cancellationToken)
        {
            await _orgUserRepository.DeleteUserAsync(request.UserId, cancellationToken);
            return default;
        }

        public async Task<OrgUserListResponse> Handle(OrgUserListQuery request, CancellationToken cancellationToken)
        {
            var response = await _orgUserRepository.GetUserListAsync(request.OrganizationId, cancellationToken);
            return _mapper.Map<OrgUserListResponse>(response);
        }
    }
}