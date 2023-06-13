using AutoMapper;
using MediatR;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
using Spd.Resource.Organizations.User;
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
            Guid orgGuid = request.PortalUserIdentity.BizGuid;
            Guid? userGuid = request.PortalUserIdentity.UserGuid;
            var orgResult = (OrgsQryResult)await _orgRepository.QueryOrgAsync(new OrgByOrgGuidQry(orgGuid), ct);
            List<UserInfo> userInfos = new();
            if (orgResult == null || !orgResult.OrgResults.Any()) //no active org
            {
                var orgRegisters = await _orgRegistrationRepository.Query(new OrgRegistrationQuery(null, orgGuid, IncludeInactive: true), ct);
                var latestReg = orgRegisters.OrgRegistrationResults.OrderByDescending(reg => reg.CreatedOn).FirstOrDefault();
                UserInfo ui = new UserInfo();
                if (latestReg == null)
                {
                    ui.UserInfoMsgType = UserInfoMsgTypeCode.ACCOUNT_NOT_MATCH_RECORD;
                }
                else
                {
                    ui.OrgRegistrationStatusCode = latestReg?.OrgRegistrationStatusStr switch
                    {
                        "New" => OrgRegistrationStatusCode.ApplicationSubmitted,
                        "InProgress" => OrgRegistrationStatusCode.InProgress,
                        "AwaitingOrganization" => OrgRegistrationStatusCode.InProgress,
                        "Approved" => OrgRegistrationStatusCode.CompleteSuccess,
                        _ => OrgRegistrationStatusCode.CompleteFailed,
                    };
                    ui.OrgRegistrationId = latestReg?.OrgRegistrationId;
                    ui.OrgName = latestReg.OrganizationName;
                    if (ui.OrgRegistrationStatusCode == OrgRegistrationStatusCode.CompleteFailed)
                    {
                        ui.UserInfoMsgType = UserInfoMsgTypeCode.REGISTRATION_NOT_APPROVED;
                    }
                }
                userInfos.Add(ui);
                UserProfileResponse response = new()
                {
                    IdentityProviderType = IdentityProviderTypeCode.BusinessBceId,
                    UserDisplayName = request.PortalUserIdentity.DisplayName,
                    UserGuid = request.PortalUserIdentity.UserGuid,
                    UserInfos = userInfos
                };
                return response;
            }

            foreach (OrgResult org in orgResult.OrgResults)
            {
                UserInfo ui;
                var orgUsers = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersSearch(org.Id), ct);
                var u = orgUsers.UserResults.FirstOrDefault(u => u.UserGuid == userGuid && u.IsActive);
                if (u != null)
                    ui = _mapper.Map<UserInfo>(u);
                else
                    ui = new UserInfo() { UserInfoMsgType = UserInfoMsgTypeCode.REGISTRATION_NOT_APPROVED };
                ui.OrgName = org.OrganizationName;
                ui.OrgSettings = _mapper.Map<OrgSettings>(org);
                userInfos.Add(ui);
            }

            return new UserProfileResponse()
            {
                IdentityProviderType = IdentityProviderTypeCode.BusinessBceId,
                UserDisplayName = request.PortalUserIdentity.DisplayName,
                UserGuid = request.PortalUserIdentity.UserGuid,
                UserInfos = userInfos
            };
        }
    }
}

