using AutoMapper;
using MediatR;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Registration;
using Spd.Resource.Repository.User;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Screening
{
    internal class OrgUserManager
        : IRequestHandler<OrgUserCreateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserUpdateCommand, OrgUserResponse>,
        IRequestHandler<OrgUserGetQuery, OrgUserResponse>,
        IRequestHandler<OrgUserDeleteCommand, Unit>,
        IRequestHandler<OrgUserUpdateLoginCommand, Unit>,
        IRequestHandler<OrgUserListQuery, OrgUserListResponse>,
        IRequestHandler<VerifyUserInvitation, InvitationResponse>,
        IRequestHandler<RegisterBceidPrimaryUserCommand, OrgUserResponse>,
        IOrgUserManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IMapper _mapper;
        private readonly IOrgRepository _orgRepository;
        private readonly IIdentityRepository _idRepository;

        public OrgUserManager(IOrgUserRepository orgUserRepository, IMapper mapper, IOrgRepository orgRepository, IIdentityRepository idRepository)
        {
            _orgUserRepository = orgUserRepository;
            _mapper = mapper;
            _orgRepository = orgRepository;
            _idRepository = idRepository;
        }

        public async Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken ct)
        {
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrgUserCreateRequest.OrganizationId, null),
                ct);

            //check if email already exists for the user
            if (existingUsersResult.UserResults.Any(u => u.Email != null && u.Email.Equals(request.OrgUserCreateRequest.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                throw new DuplicateException(HttpStatusCode.BadRequest, $"This email '{request.OrgUserCreateRequest.Email}' has been used by another user.");
            }

            //check if role is withing the maxium number scope
            var newlist = existingUsersResult.UserResults.ToList();
            newlist.Add(_mapper.Map<UserResult>(request.OrgUserCreateRequest));
            await CheckMaxRoleNumberRuleAsync(newlist, request.OrgUserCreateRequest.OrganizationId, ct);

            var user = _mapper.Map<User>(request.OrgUserCreateRequest);
            var response = await _orgUserRepository.ManageOrgUserAsync(
                new UserCreateCmd(user, request.HostUrl, CreatedByUserId: request.CreatedByUserId),
                ct);
            return _mapper.Map<OrgUserResponse>(response.UserResult);
        }

        public async Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken ct)
        {
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrgUserUpdateRequest.OrganizationId, null),
                ct);

            //check email rule
            if (existingUsersResult.UserResults.Any(u =>
                u.Email.Equals(request.OrgUserUpdateRequest.Email, StringComparison.InvariantCultureIgnoreCase) &&
                u.Id != request.OrgUserUpdateRequest.Id))
            {
                throw new DuplicateException(HttpStatusCode.BadRequest, $"This email '{request.OrgUserUpdateRequest.Email}' has been used by another user.");
            }

            //check max role number rule
            var existingUser = existingUsersResult.UserResults.FirstOrDefault(u => u.Id == request.OrgUserUpdateRequest.Id);
            if (existingUser == null)
                throw new NotFoundException(HttpStatusCode.BadRequest, $"The user cannot be found.");

            _mapper.Map(request.OrgUserUpdateRequest, existingUser);
            await CheckMaxRoleNumberRuleAsync(
                existingUsersResult.UserResults.ToList(),
                request.OrgUserUpdateRequest.OrganizationId,
                ct);

            var user = _mapper.Map<User>(request.OrgUserUpdateRequest);
            var response = await _orgUserRepository.ManageOrgUserAsync(
                new UserUpdateCmd(request.OrgUserUpdateRequest.Id, user, request.OnlyChangePhoneJob),
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

        public async Task<Unit> Handle(OrgUserUpdateLoginCommand cmd, CancellationToken ct)
        {
            await _orgUserRepository.ManageOrgUserAsync(
                new UserUpdateLoginCmd(cmd.UserId),
                ct);
            return default;
        }

        public async Task<OrgUserListResponse> Handle(OrgUserListQuery request, CancellationToken ct)
        {
            var existingUsersResult = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(
                new OrgUsersSearch(request.OrganizationId, null),
                ct);

            var userResps = _mapper.Map<IEnumerable<OrgUserResponse>>(existingUsersResult.UserResults);
            if (request.OnlyReturnActiveUsers)
            {
                userResps = userResps.Where(u => u.IsActive);
            }
            var org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(request.OrganizationId), ct);

            return new OrgUserListResponse
            {
                MaximumNumberOfAuthorizedContacts = org != null ? org.OrgResult.MaxContacts : 0,
                MaximumNumberOfPrimaryAuthorizedContacts = org != null ? org.OrgResult.MaxPrimaryContacts : 0,
                Users = userResps
            };
        }

        public async Task<InvitationResponse?> Handle(VerifyUserInvitation request, CancellationToken ct)
        {
            var result = await _orgUserRepository.ManageOrgUserAsync(
                 new UserInvitationVerify(request.InvitationRequest.InviteEncryptedCode, request.OrgGuid, request.UserGuid),
                 ct);
            if (result.UserResult?.OrganizationId == null)
                return null;
            return new InvitationResponse((Guid)result.UserResult.OrganizationId);
        }

        public async Task<OrgUserResponse> Handle(RegisterBceidPrimaryUserCommand request, CancellationToken ct)
        {
            Guid identityId;
            IdentityQueryResult idResult = await _idRepository.Query(new IdentityQry(request.IdentityInfo.UserGuid.ToString(),
                request.IdentityInfo.BizGuid,
                IdentityProviderTypeEnum.BusinessBceId),
                ct);

            if (idResult == null || !idResult.Items.Any())
            {
                IdentityCmdResult result = await _idRepository.Manage(new CreateIdentityCmd(request.IdentityInfo.UserGuid.ToString(),
                   request.IdentityInfo.BizGuid,
                   IdentityProviderTypeEnum.BusinessBceId),
                ct);
                identityId = result.Id;
            }
            else
            {
                identityId = idResult.Items.First().Id;
            }

            //update org with orgGuid
            await _orgRepository.ManageOrgAsync(new OrgGuidUpdateCmd(request.OrganizationId, request.IdentityInfo.BizGuid.ToString()), ct);

            OrgUsersResult orgUser = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersSearch(request.OrganizationId, null), ct);
            if (orgUser != null && orgUser.UserResults.Any(u => u.UserGuid == request.IdentityInfo.UserGuid))
            {
                throw new ApiException(HttpStatusCode.BadRequest, "You are already a registered user of this organization.");
            }
            if (orgUser != null && orgUser.UserResults.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.Primary) >= 2)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "The maximum number of primary contacts has already been reached. We cannot add another contact.");
            }

            User user = _mapper.Map<User>(request.IdentityInfo);
            user.OrganizationId = request.OrganizationId;
            var response = await _orgUserRepository.ManageOrgUserAsync(new UserCreateCmd(user, null, identityId, null), ct);
            return _mapper.Map<OrgUserResponse>(response.UserResult);
        }

        private async Task CheckMaxRoleNumberRuleAsync(List<UserResult> userList, Guid orgId, CancellationToken ct)
        {
            var org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(orgId), ct);
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
                throw new OutOfRangeException(HttpStatusCode.BadRequest, "There must be at least one primary user.");
            }
        }
    }
}