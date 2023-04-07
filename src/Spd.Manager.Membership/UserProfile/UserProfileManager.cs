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
        private readonly IPrincipal _currentUser;

        public UserProfileManager(
            IOrgUserRepository orgUserRepository,
            IIdentityRepository idRepository,
            IPrincipal currentUser,
            IOrgRepository orgRepository)
        {
            _orgUserRepository = orgUserRepository;
            _currentUser = currentUser;
            _idRepository = idRepository;
            _orgRepository = orgRepository;
        }

        public async Task<UserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct)
        {
            List<SpdUserInfo> spdUserInfos = new();

            var identityResult = await _idRepository.QueryIdentity(
                new IdentityByUserGuidOrgGuidQuery(_currentUser.GetUserGuid(), _currentUser.GetBizGuid()),
                ct);
            if (identityResult?.IdentityInfo != null)
            {
                var result = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersByIdentityIdQry(identityResult.IdentityInfo.Id), ct);
                foreach (UserInfoResult u in result.UserInfoResults)
                {
                    SpdUserInfo ui = new();
                    ui.UserId = u.Id;
                    ui.OrgId = u.OrganizationId;
                    if (u.OrganizationId == null) //org does not exists, but orgRegistration should exists
                    {
                        if(u.OrgRegistrationId!= null)
                            ui.OrgStatusCode = OrgStatusCode.InRegistration;
                    }
                    else
                    {
                        ui.OrgStatusCode = OrgStatusCode.Valid;
                        var orgResult = await _orgRepository.QueryOrgAsync(new OrgByIdQry((Guid)u.OrganizationId), ct);
                        ui.OrgName = orgResult.OrgQryInfo.OrganizationName;
                    }

                    ui.ContactRoleCode = u.ContactAuthorizationTypeCode;
                    spdUserInfos.Add(ui);
                }
            }
            else
            {
                //check if in org-registration
                SpdUserInfo ui = new();
                spdUserInfos.Add(ui);
            }

            UserProfileResponse response = new()
            {
                IsAuthenticated = _currentUser.IsAuthenticated(),
                IdentityProvider = _currentUser.GetIdentityProvider(), //bceidboth
                UserDisplayName = _currentUser.GetUserDisplayName(),
                OrgGuid = _currentUser.GetBizGuid(),
                OrgLegalName = _currentUser.GetBizName(),
                UserFirstName = _currentUser.GetUserFirstName(),
                UserLastName = _currentUser.GetUserLastName(),
                UserEmail = _currentUser.GetUserEmail(),
                UserGuid = _currentUser.GetUserGuid(),
                SpdUserInfos = spdUserInfos
            };
            return response;
        }
    }
}

