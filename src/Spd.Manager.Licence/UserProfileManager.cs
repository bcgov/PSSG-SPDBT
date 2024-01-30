using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Registration;
using Spd.Resource.Repository.User;

namespace Spd.Manager.Licence
{
    internal class UserProfileManager
        : IRequestHandler<GetCurrentUserProfileQuery, OrgUserProfileResponse>,
        IRequestHandler<GetApplicantProfileQuery, ApplicantProfileResponse>,
        IRequestHandler<ManageApplicantProfileCommand, ApplicantProfileResponse>,
        IUserProfileManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IIdentityRepository _idRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IPortalUserRepository _portalUserRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<IUserProfileManager> _logger;

        public UserProfileManager(
            IOrgUserRepository orgUserRepository,
            IIdentityRepository idRepository,
            IOrgRepository orgRepository,
            IPortalUserRepository portalUserRepository,
            IContactRepository contactRepository,
            IMapper mapper,
            ILogger<IUserProfileManager> logger)
        {
            _orgUserRepository = orgUserRepository;
            _idRepository = idRepository;
            _orgRepository = orgRepository;
            _mapper = mapper;
            _logger = logger;
            _portalUserRepository = portalUserRepository;
            _contactRepository = contactRepository;
        }

        public async Task<OrgUserProfileResponse> Handle(GetCurrentUserProfileQuery request, CancellationToken ct)
        {
            Guid orgGuid = request.PortalUserIdentity.BizGuid;
            Guid? userGuid = request.PortalUserIdentity.UserGuid;
            List<UserInfo> userInfos = new();

            //get all orgs
            var orgResult = (OrgsQryResult)await _orgRepository.QueryOrgAsync(
                new OrgsQry(orgGuid, ServiceTypes: IApplicationRepository.ScreeningServiceTypes),
                ct);
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

        public async Task<ApplicantProfileResponse> Handle(ManageApplicantProfileCommand cmd, CancellationToken ct)
        {
            ContactResp contactResp = null;
            var result = await _idRepository.Query(new IdentityQry(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

            if (result == null || !result.Items.Any()) //first time to use system
            {
                //add identity
                var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);
                CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                createContactCmd.IdentityId = id.Id;
                contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
                //add address
            }
            else
            {
                Identity id = result.Items.FirstOrDefault();
                if (id.ContactId != null)
                {
                    //depends on requirement, probably update later when user select "yes" in user profile for licensing portal.
                    UpdateContactCmd updateContactCmd = _mapper.Map<UpdateContactCmd>(cmd);
                    updateContactCmd.Id = (Guid)id.ContactId;
                    updateContactCmd.IdentityId = id.Id;
                    contactResp = await _contactRepository.ManageAsync(updateContactCmd, ct);
                }
                else
                {
                    //there is identity, but no contact
                    CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                    createContactCmd.IdentityId = id.Id;
                    contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
                }
                //update address
            }

            return _mapper.Map<ApplicantProfileResponse>(contactResp);
        }
    }
}

