using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
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
        private readonly IOrgRegistrationRepository _orgRegistrationRepository;
        private readonly IMapper _mapper;
        private readonly IPrincipal _currentUser;

        public UserProfileManager(
            IOrgUserRepository orgUserRepository,
            IIdentityRepository idRepository,
            IPrincipal currentUser,
            IOrgRepository orgRepository,
            IOrgRegistrationRepository orgRegistrationRepository,
            IMapper mapper)
        {
            _orgUserRepository = orgUserRepository;
            _currentUser = currentUser;
            _idRepository = idRepository;
            _orgRepository = orgRepository;
            _mapper = mapper;
            _orgRegistrationRepository = orgRegistrationRepository;
        }

        public async Task<UserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct)
        {
            Guid userGuid = _currentUser.GetUserGuid();
            List<UserInfo> userInfos = new();

            //check registration
            var orgRegResult = await _orgRegistrationRepository.Query(new OrgRegistrationQueryByUserGuid(userGuid), ct);
            if (orgRegResult != null)
            {
                foreach(OrgRegistrationResult reg in orgRegResult.OrgRegistrationResults)
                {
                    UserInfo ui = new UserInfo();
                    ui.OrgRegistrationId = reg.OrgRegistrationId;
                    ui.OrgName = reg.OrganizationName;
                    userInfos.Add(ui);
                }
            }

            //check org portal user
            var identityResult = await _idRepository.Query(
                new IdentityQuery(userGuid, null),
                ct);
            if (identityResult?.Identities != null)
            {
                foreach (Identity id in identityResult.Identities)
                {
                    var result = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersByIdentityIdQry(id.Id), ct);
                    foreach (UserResult u in result.UserResults)
                    {
                        UserInfo ui = _mapper.Map<UserInfo>(u);                
                        var orgResult = await _orgRepository.QueryOrgAsync(new OrgByIdQry((Guid)u.OrganizationId), ct);
                        ui.OrgName = orgResult.OrgResult.OrganizationName;
                        ui.OrgSettings = _mapper.Map<OrgSettings>(orgResult.OrgResult);
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

