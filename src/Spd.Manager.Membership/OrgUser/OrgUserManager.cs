using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.User;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Membership.OrgUser
{
    internal class OrgUserManager
        : IRequestHandler<OrgUserCreateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserUpdateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserGetQuery, OrgUserResponse>,
        IRequestHandler<OrgUserDeleteCommand, Unit>,
        IRequestHandler<OrgUserListQuery, OrgUserListResponse>,
        IRequestHandler<VerifyUserInvitation, Unit>,
        IOrgUserManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IMapper _mapper;
        private readonly IOrgRepository _orgRepository;
        public OrgUserManager(IOrgUserRepository orgUserRepository, IMapper mapper, IOrgRepository orgRepository)
        {
            _orgUserRepository = orgUserRepository;
            _mapper = mapper;
            _orgRepository = orgRepository;
        }

        public async Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken ct)
        {
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrgUserCreateRequest.OrganizationId, null),
                ct);

            //check if email already exists for the user
            if (existingUsersResult.UserResults.Any(u => u.Email != null && u.Email.Equals(request.OrgUserCreateRequest.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                throw new DuplicateException(HttpStatusCode.BadRequest, $"User email {request.OrgUserCreateRequest.Email} has been used by another user");
            }

            //check if role is withing the maxium number scope
            var newlist = existingUsersResult.UserResults.ToList();
            newlist.Add(_mapper.Map<UserResult>(request.OrgUserCreateRequest));
            await CheckMaxRoleNumberRuleAsync(newlist, request.OrgUserCreateRequest.OrganizationId, ct);

            var user = _mapper.Map<User>(request.OrgUserCreateRequest);
            var response = await _orgUserRepository.ManageOrgUserAsync(
                new UserCreateCmd(user, request.HostUrl),
                ct);
            return _mapper.Map<OrgUserResponse>(response.UserResult);
        }

        public async Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken ct)
        {
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrgUserUpdateRequest.OrganizationId, null),
                ct);            //check email rule

            if (existingUsersResult.UserResults.Any(u =>
                u.Email.Equals(request.OrgUserUpdateRequest.Email, StringComparison.InvariantCultureIgnoreCase) &&
                u.Id != request.OrgUserUpdateRequest.Id))
            {
                throw new DuplicateException(HttpStatusCode.BadRequest, $"User email {request.OrgUserUpdateRequest.Email} has been used by another user");
            }

            //check max role number rule
            var existingUser = existingUsersResult.UserResults.FirstOrDefault(u => u.Id == request.OrgUserUpdateRequest.Id);
            _mapper.Map(request.OrgUserUpdateRequest, existingUser);
            await CheckMaxRoleNumberRuleAsync(
                existingUsersResult.UserResults.ToList(),
                request.OrgUserUpdateRequest.OrganizationId,
                ct);

            var user = _mapper.Map<User>(request.OrgUserUpdateRequest);
            var response = await _orgUserRepository.ManageOrgUserAsync(
                new UserUpdateCmd(request.OrgUserUpdateRequest.Id, user),
                ct);
            return _mapper.Map<OrgUserResponse>(response.UserResult);
        }

        public async Task<OrgUserResponse> Handle(OrgUserGetQuery request, CancellationToken ct)
        {
            var response = (OrgUserResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUserByIdQry(request.UserId),
                ct);
            return _mapper.Map<OrgUserResponse>(response.UserResult);
        }

        public async Task<Unit> Handle(OrgUserDeleteCommand request, CancellationToken ct)
        {
            //check role max number rule
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrganizationId, null),
                ct);
            var toDeleteUser = existingUsersResult.UserResults.FirstOrDefault(u => u.Id == request.UserId);
            var newUsers = existingUsersResult.UserResults.ToList();
            if (toDeleteUser == null) return default;
            newUsers.Remove(toDeleteUser);
            await CheckMaxRoleNumberRuleAsync(newUsers, request.OrganizationId, ct);

            await _orgUserRepository.ManageOrgUserAsync(
                new UserDeleteCmd(request.UserId),
                ct);
            return default;
        }

        public async Task<OrgUserListResponse> Handle(OrgUserListQuery request, CancellationToken ct)
        {
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrganizationId, null),
                ct);

            var userResps = _mapper.Map<IEnumerable<OrgUserResponse>>(existingUsersResult.UserResults);
            var org = await _orgRepository.QueryOrgAsync(new OrgByIdQry(request.OrganizationId), ct);

            return new OrgUserListResponse
            {
                MaximumNumberOfAuthorizedContacts = org != null ? org.OrgResult.MaxContacts : 0,
                MaximumNumberOfPrimaryAuthorizedContacts = org != null ? org.OrgResult.MaxPrimaryContacts : 0,
                Users = userResps
            };
        }

        public async Task<Unit> Handle(VerifyUserInvitation request, CancellationToken ct)
        {
           await _orgUserRepository.ManageOrgUserAsync(
                new UserInvitationVerify(request.InvitationRequest.InviteEncryptedCode, request.OrgGuid, request.UserGuid),
                ct);
           return default;
        }
        private async Task CheckMaxRoleNumberRuleAsync(List<UserResult> userList, Guid orgId, CancellationToken ct)
        {
            var org = await _orgRepository.QueryOrgAsync(new OrgByIdQry(orgId), ct);
            int maxContacts = org != null ? org.OrgResult.MaxContacts : 0;
            int maxPrimaryContacts = org != null ? org.OrgResult.MaxPrimaryContacts : 0;
            int userNo = userList.Count;
            if (userNo > maxContacts)
            {
                throw new OutOfRangeException(HttpStatusCode.BadRequest, $"No more contacts can be created. The limit of {maxContacts} contacts has been reached.");
            }
            int primaryUserNo = userList.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.Primary);
            if (primaryUserNo > maxPrimaryContacts)
            {
                throw new OutOfRangeException(HttpStatusCode.BadRequest, $"No more primary contacts can be created. The limit of {maxPrimaryContacts} primary contacts has been reached.");
            }
            if (primaryUserNo < 1)
            {
                throw new OutOfRangeException(HttpStatusCode.BadRequest, "There must be at least one primary user");
            }
        }
    }
}