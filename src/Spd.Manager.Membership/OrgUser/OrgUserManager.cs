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
            var existingUsers = await _orgUserRepository.GetUserListAsync(request.OrgUserCreateRequest.OrganizationId, cancellationToken);
            //check if email already exists for the user
            if (existingUsers.Users.Any(u => u.Email.Equals(request.OrgUserCreateRequest.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                throw new DuplicateException(@"User email {request.OrgUserCreateRequest.Email} has been used by other users.");
            }

            //check if role is withing the maxium number scope
            var newlist = existingUsers.Users.ToList();
            newlist.Add(_mapper.Map<UserResponse>(request.OrgUserCreateRequest));
            existingUsers.Users = newlist;
            CheckMaxRoleNumberRule(existingUsers);

            var createOrgUser = _mapper.Map<CreateUserCmd>(request.OrgUserCreateRequest);
            var response = await _orgUserRepository.AddUserAsync(createOrgUser, cancellationToken);
            return _mapper.Map<OrgUserResponse>(response);
        }

        public async Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken cancellationToken)
        {
            var existingUsers = await _orgUserRepository.GetUserListAsync(request.OrgUserUpdateRequest.OrganizationId, cancellationToken);
            //check email rule
            if (existingUsers.Users.Any(u =>
                u.Email.Equals(request.OrgUserUpdateRequest.Email, StringComparison.InvariantCultureIgnoreCase) &&
                u.Id != request.OrgUserUpdateRequest.Id))
            {
                throw new DuplicateException(@"User email {request.OrgUserCreateRequest.Email} has been used by other users.");
            }

            //check max role number rule
            var existingUser = existingUsers.Users.FirstOrDefault(u => u.Id == request.OrgUserUpdateRequest.Id);
            _mapper.Map(request.OrgUserUpdateRequest, existingUser);
            CheckMaxRoleNumberRule(existingUsers);

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
            //check role max number rule
            var existingUsers = await _orgUserRepository.GetUserListAsync(request.OrganizationId, cancellationToken);
            var toDeleteUser = existingUsers.Users.FirstOrDefault(u => u.Id == request.UserId);
            var newUsers = existingUsers.Users.ToList();
            newUsers.Remove(toDeleteUser);
            existingUsers.Users = newUsers;
            CheckMaxRoleNumberRule(existingUsers);

            await _orgUserRepository.DeleteUserAsync(request.UserId, cancellationToken);
            return default;
        }

        public async Task<OrgUserListResponse> Handle(OrgUserListQuery request, CancellationToken cancellationToken)
        {
            var response = await _orgUserRepository.GetUserListAsync(request.OrganizationId, cancellationToken);
            return _mapper.Map<OrgUserListResponse>(response);
        }

        private void CheckMaxRoleNumberRule(OrgUserListCmdResponse userList)
        {
            int userNo = userList.Users.Count();
            if (userNo > userList.MaximumNumberOfAuthorizedContacts)
            {
                throw new OutOfRangeException("There is already maxium number of contacts, could not add more.");
            }
            int primaryUserNo = userList.Users.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.Primary);
            if (primaryUserNo > userList.MaximumNumberOfPrimaryAuthorizedContacts)
            {
                throw new OutOfRangeException("There is already maxium number of primary contacts, could not add more.");
            }
            if (primaryUserNo < 1)
            {
                throw new OutOfRangeException("There must be at least one primary user.");
            }
        }
    }
}