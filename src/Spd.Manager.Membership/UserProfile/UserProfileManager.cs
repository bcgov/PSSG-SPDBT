using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.User;
using Spd.Utilities.LogonUser;
using System.Security.Principal;

namespace Spd.Manager.Membership.UserProfile
{
    internal class UserProfileManager
        : IRequestHandler<GetCurrentUserProfileQuery, UserProfileResponse>,
        IUserProfileManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IIdentityRepository _idRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        private readonly IPrincipal _currentUser;

        public UserProfileManager(
            IOrgUserRepository orgUserRepository,
            IIdentityRepository idRepository,
            IPrincipal currentUser,
            IOrgRepository orgRepository,
            IMapper mapper)
        {
            _orgUserRepository = orgUserRepository;
            _currentUser = currentUser;
            _idRepository = idRepository;
            _orgRepository = orgRepository;
            _mapper = mapper;
        }

        public async Task<UserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct)
        {
            List<UserInfo> userInfos = new();

            var identityResult = await _idRepository.QueryIdentity(
                new IdentityByUserGuidQuery(_currentUser.GetUserGuid()),
                ct);
            if (identityResult?.Identities != null)
            {
                foreach (Identity id in identityResult.Identities)
                {
                    var result = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersByIdentityIdQry(id.Id), ct);
                    foreach (UserResult u in result.UserResults)
                    {
                        UserInfo ui = _mapper.Map<UserInfo>(u);
                        if (u.OrganizationId == null) //org does not exists, but orgRegistration should exists
                        {
                            ui.OrgSettings = null;
                            if (u.OrgRegistrationId != null)
                                ui.OrgStatusCode = OrgStatusCode.InRegistration;
                        }
                        else
                        {
                            ui.OrgStatusCode = OrgStatusCode.Valid;
                            var orgResult = await _orgRepository.QueryOrgAsync(new OrgByIdQry((Guid)u.OrganizationId), ct);
                            ui.OrgName = orgResult.OrgResult.OrganizationName;
                            ui.OrgSettings = _mapper.Map<OrgSettings>(orgResult.OrgResult);
                        }
                        userInfos.Add(ui);
                    }
                }
            };

            UserProfileResponse response = new()
            {
                IdentityProvider = _currentUser.GetIdentityProvider(), //bceidboth
                UserDisplayName = _currentUser.GetUserDisplayName(),
                UserGuid = _currentUser.GetUserGuid(),
                UserInfos = userInfos
            };
            return response;
        }
    }
}

