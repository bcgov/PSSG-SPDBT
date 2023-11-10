using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Manager.Membership.OrgRegistration;
using Spd.Resource.Applicants.Contact;
using Spd.Resource.Applicants.PortalUser;
using Spd.Resource.Organizations.Identity;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
using Spd.Resource.Organizations.User;
using Spd.Utilities.BCeIDWS;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ManagerContract;

namespace Spd.Manager.Membership.UserProfile
{
    internal class UserProfileManager
        : IRequestHandler<GetCurrentUserProfileQuery, OrgUserProfileResponse>,
        IRequestHandler<GetApplicantProfileQuery, ApplicantProfileResponse>,
        IRequestHandler<ManageApplicantProfileCommand, ApplicantProfileResponse>,
        IRequestHandler<ManageIdirUserCommand, IdirUserProfileResponse>,
        IRequestHandler<GetIdirUserProfileQuery, IdirUserProfileResponse>,
        IUserProfileManager
    {
        private readonly IOrgUserRepository _orgUserRepository;
        private readonly IIdentityRepository _idRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IOrgRegistrationRepository _orgRegistrationRepository;
        private readonly IPortalUserRepository _portalUserRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IBCeIDService _bceidService;
        private readonly IMapper _mapper;
        private readonly ILogger<IUserProfileManager> _logger;

        public UserProfileManager(
            IOrgUserRepository orgUserRepository,
            IIdentityRepository idRepository,
            IOrgRepository orgRepository,
            IOrgRegistrationRepository orgRegistrationRepository,
            IBCeIDService bceidService,
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
            _orgRegistrationRepository = orgRegistrationRepository;
            _bceidService = bceidService;
            _portalUserRepository = portalUserRepository;
            _contactRepository = contactRepository;
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
                    ui.UserInfoMsgType = UserInfoMsgTypeCode.REGISTRATION_DENIED;
                }
                if (ui.OrgRegistrationStatusCode != OrgRegistrationStatusCode.CompleteSuccess) //if org reg completes successfully, then there should be a valid org.
                {
                    userInfos.Add(ui);
                }
            }

            //get all orgs
            var orgResult = (OrgsQryResult)await _orgRepository.QueryOrgAsync(new OrgsQry(orgGuid), ct);
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

            if (!orgRegisters.OrgRegistrationResults.Any() && !orgResult.OrgResults.Any()) //not found in org registration and org
            {
                UserInfo ui = new UserInfo();
                ui.UserInfoMsgType = UserInfoMsgTypeCode.ACCOUNT_NOT_MATCH_RECORD;
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
            //testing code-remove later
            cmd.BcscIdentityInfo.Sub = "ZJOBEJ5ZFMQXUH3NF66GRNSMB22YYWPA";
            //testing code

            var result = await _idRepository.Query(new IdentityQry(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

            if (result == null || !result.Items.Any()) //first time to use system
            {
                //add identity
                var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);
                CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                createContactCmd.IdentityId = id.Id;
                await _contactRepository.ManageAsync(createContactCmd, ct);
                //add address
            }
            else
            {
                Identity id = result.Items.FirstOrDefault();
                //update contact
                //update address
            }
            
            return _mapper.Map<ApplicantProfileResponse>(result.Items.FirstOrDefault());
        }

        public async Task<IdirUserProfileResponse> Handle(ManageIdirUserCommand cmd, CancellationToken ct)
        {
            IDIRUserDetailResult? idirDetail = (IDIRUserDetailResult?)await _bceidService.HandleQuery(new IDIRUserDetailQuery()
            {
                RequesterGuid = cmd.IdirUserIdentity.UserGuid,
                RequesterAccountType = RequesterAccountTypeEnum.Internal,
                UserGuid = cmd.IdirUserIdentity.UserGuid
            });
            _logger.LogDebug($"userGuid = {cmd.IdirUserIdentity.UserGuid}");
            _logger.LogDebug($"from webservice orgCode = {idirDetail.MinistryCode}");
            var existingIdentities = await _idRepository.Query(new IdentityQry(cmd.IdirUserIdentity.UserGuid, null, IdentityProviderTypeEnum.Idir), ct);
            var identity = existingIdentities.Items.FirstOrDefault();
            Guid? identityId = identity?.Id;
            _logger.LogDebug($"identityId = {identityId}");

            bool isFirstTimeLogin = false;
            if (identity == null)
            {
                var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.IdirUserIdentity.UserGuid, SpdConstants.BC_GOV_ORG_ID, IdentityProviderTypeEnum.Idir), ct);
                identityId = id?.Id;
                isFirstTimeLogin = true;
            }

            if (cmd.IdirUserIdentity.Email != null)
            {
                var existingUser = (PortalUserListResp)await _portalUserRepository.QueryAsync(
                    new PortalUserQry() { UserEmail = cmd.IdirUserIdentity.Email, OrgIdOrParentOrgId = SpdConstants.BC_GOV_ORG_ID },
                    ct);

                var result = existingUser.Items.FirstOrDefault();

                if (result == null)
                {
                    CreatePortalUserCmd createUserCmd = new CreatePortalUserCmd()
                    {
                        OrgId = SpdConstants.BC_GOV_ORG_ID,
                        EmailAddress = cmd.IdirUserIdentity.Email,
                        FirstName = cmd.IdirUserIdentity.FirstName,
                        LastName = cmd.IdirUserIdentity.LastName,
                        IdentityId = identityId,
                    };
                    result = await _portalUserRepository.ManageAsync(createUserCmd, ct);
                }
                else
                {
                    _logger.LogDebug($"userId = {result.Id}, username={result.LastName}, {result.FirstName}");
                    UpdatePortalUserCmd updateUserCmd = new UpdatePortalUserCmd()
                    {
                        Id = result.Id,
                        OrgId = SpdConstants.BC_GOV_ORG_ID,
                        EmailAddress = cmd.IdirUserIdentity.Email,
                        FirstName = cmd.IdirUserIdentity.FirstName,
                        LastName = cmd.IdirUserIdentity.LastName,
                        IdentityId = identityId,
                    };
                    result = await _portalUserRepository.ManageAsync(updateUserCmd, ct);
                }
                var response = _mapper.Map<IdirUserProfileResponse>(result);
                response.OrgName = idirDetail?.MinistryName;
                response.UserGuid = cmd.IdirUserIdentity?.UserGuid;
                response.UserDisplayName = cmd.IdirUserIdentity?.DisplayName;
                response.IdirUserName = cmd.IdirUserIdentity?.IdirUserName;
                response.IsFirstTimeLogin = isFirstTimeLogin;
                //todo: temp hardcode
                response.OrgId = Guid.Parse("64540211-d346-ee11-b845-00505683fbf4");
                return response;
            }
            else
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "no email from idir.");
            }
        }

        public async Task<IdirUserProfileResponse?> Handle(GetIdirUserProfileQuery qry, CancellationToken ct)
        {
            var existingIdentities = await _idRepository.Query(new IdentityQry(qry.IdirUserIdentity.UserGuid, null, IdentityProviderTypeEnum.Idir), ct);
            var identity = existingIdentities.Items.FirstOrDefault();
            Guid? identityId = identity?.Id;
            if (identity != null)
            {
                var existingUser = (PortalUserListResp)await _portalUserRepository.QueryAsync(
                    new PortalUserQry() { IdentityId = identityId, OrgIdOrParentOrgId = SpdConstants.BC_GOV_ORG_ID },
                    ct);
                var result = existingUser.Items.FirstOrDefault();
                if (result != null)
                {
                    var response = _mapper.Map<IdirUserProfileResponse>(result);
                    response.UserGuid = qry.IdirUserIdentity?.UserGuid;
                    response.UserDisplayName = qry.IdirUserIdentity?.DisplayName;
                    response.IdirUserName = qry.IdirUserIdentity?.IdirUserName;
                    response.OrgId = Guid.Parse("64540211-d346-ee11-b845-00505683fbf4");
                    return response;
                }
                return null;
            }
            else
            {
                return null;
            }
        }
    }
}

