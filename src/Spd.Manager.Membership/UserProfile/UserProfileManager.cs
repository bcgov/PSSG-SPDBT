using AutoMapper;
using MediatR;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
using Spd.Resource.Organizations.User;
using Spd.Utilities.Shared;

namespace Spd.Manager.Membership.UserProfile
{
    internal class UserProfileManager
        : IRequestHandler<GetCurrentUserProfileQuery, OrgUserProfileResponse>,
        IRequestHandler<GetApplicantProfileQuery, ApplicantProfileResponse>,
        IRequestHandler<ManageIdirUserCommand, IdirUserProfileResponse>,
        IUserProfileManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IIdentityRepository _idRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IOrgRegistrationRepository _orgRegistrationRepository;
        private readonly IMapper _mapper;

        public UserProfileManager(
            IOrgUserRepository orgUserRepository,
            IIdentityRepository idRepository,
            IOrgRepository orgRepository,
            IOrgRegistrationRepository orgRegistrationRepository,
            IMapper mapper)
        {
            _orgUserRepository = orgUserRepository;
            _idRepository = idRepository;
            _orgRepository = orgRepository;
            _mapper = mapper;
            _orgRegistrationRepository = orgRegistrationRepository;
        }

        public async Task<OrgUserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct)
        {
            Guid orgGuid = request.PortalUserIdentity.BizGuid;
            Guid? userGuid = request.PortalUserIdentity.UserGuid;
            List<UserInfo> userInfos = new();

            //get all org reqistation which is not approved yet.
            var orgRegisters = await _orgRegistrationRepository.Query(new OrgRegistrationQuery(null, orgGuid, IncludeInactive: true), ct);
            foreach (var orgRegister in orgRegisters.OrgRegistrationResults)
            {
                UserInfo ui = new UserInfo();
                if (orgRegister == null)
                {
                    ui.UserInfoMsgType = UserInfoMsgTypeCode.ACCOUNT_NOT_MATCH_RECORD;
                }
                else
                {
                    ui.OrgRegistrationStatusCode = orgRegister?.OrgRegistrationStatusStr switch
                    {
                        "New" => OrgRegistrationStatusCode.ApplicationSubmitted,
                        "InProgress" => OrgRegistrationStatusCode.InProgress,
                        "AwaitingOrganization" => OrgRegistrationStatusCode.InProgress,
                        "Approved" => OrgRegistrationStatusCode.CompleteSuccess,
                        _ => OrgRegistrationStatusCode.CompleteFailed,
                    };
                    ui.OrgRegistrationId = orgRegister?.OrgRegistrationId;
                    ui.OrgName = orgRegister?.OrganizationName;
                    ui.OrgRegistrationNumber = orgRegister?.OrgRegistrationNumber;
                    if (ui.OrgRegistrationStatusCode == OrgRegistrationStatusCode.CompleteFailed)
                    {
                        ui.UserInfoMsgType = UserInfoMsgTypeCode.REGISTRATION_NOT_APPROVED;
                    }
                }
                if (ui.OrgRegistrationStatusCode != OrgRegistrationStatusCode.CompleteSuccess) //if org reg completes successfully, then there should be a valid org.
                {
                    userInfos.Add(ui);
                }
            }

            //get all orgs
            var orgResult = (OrgsQryResult)await _orgRepository.QueryOrgAsync(new OrgByOrgGuidQry(orgGuid), ct);
            foreach (OrgResult org in orgResult.OrgResults)
            {
                UserInfo ui = new UserInfo();
                var orgUsers = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersSearch(org.Id), ct);
                var u = orgUsers.UserResults.FirstOrDefault(u => u.UserGuid == userGuid && u.IsActive);
                if (u != null)
                    ui = _mapper.Map<UserInfo>(u);
                else
                    ui = new UserInfo() { UserInfoMsgType = UserInfoMsgTypeCode.NO_ACTIVE_ACCOUNT_FOR_ORG };
                ui.OrgName = org.OrganizationName;
                ui.OrgId = org.Id;
                ui.OrgSettings = _mapper.Map<OrgSettings>(org);
                userInfos.Add(ui);
            }

            return new OrgUserProfileResponse()
            {
                IdentityProviderType = IdentityProviderTypeCode.BusinessBceId,
                UserDisplayName = request.PortalUserIdentity.DisplayName,
                UserGuid = request.PortalUserIdentity.UserGuid,
                UserInfos = userInfos
            };
        }

        public async Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct)
        {
            var result = await _idRepository.Query(new IdentityQry(request.BcscSub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

            return _mapper.Map<ApplicantProfileResponse>(result.Items.FirstOrDefault());
        }

        public async Task<IdirUserProfileResponse> Handle(ManageIdirUserCommand cmd, CancellationToken ct)
        {
            var existingIdentities = await _idRepository.Query(new IdentityQry(cmd.IdirUserIdentity.UserGuid, null, IdentityProviderTypeEnum.Idir), ct);
            var identity = existingIdentities.Items.FirstOrDefault();
            Guid? identityId = identity?.Id;
            if (identity == null)
            {
                var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.IdirUserIdentity.UserGuid, SpdConstants.BC_GOV_ORG_ID, IdentityProviderTypeEnum.Idir), ct);
                identityId = id?.Id;
            }

            var existingUser = (OrgUsersResult)await _orgUserRepository.QueryOrgUserAsync(new OrgUsersSearch(SpdConstants.BC_GOV_ORG_ID, identityId), ct);
            var result = existingUser.UserResults.FirstOrDefault();
            if (result == null)
            {
                User user = new User()
                {
                    OrganizationId = SpdConstants.BC_GOV_ORG_ID,
                    Email = cmd.IdirUserIdentity.Email,
                    FirstName = cmd.IdirUserIdentity.FirstName,
                    LastName = cmd.IdirUserIdentity.LastName,
                };

                var userOrgResult = await _orgUserRepository.ManageOrgUserAsync(new UserCreateCmd(user, null, identityId), ct);
                result = userOrgResult.UserResult;
            }
            var response = _mapper.Map<IdirUserProfileResponse>(result);
            response.UserGuid = cmd.IdirUserIdentity?.UserGuid;
            response.UserDisplayName = cmd.IdirUserIdentity?.DisplayName;
            response.IdirUserName = cmd.IdirUserIdentity?.IdirUserName;
            return response;
        }
    }
}

