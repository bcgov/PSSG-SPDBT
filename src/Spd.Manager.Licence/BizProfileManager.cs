using AutoMapper;
using MediatR;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Registration;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Licence;
internal class BizProfileManager :
        IRequestHandler<BizLoginCommand, BizUserLoginResponse>,
        IRequestHandler<GetBizProfileQuery, BizProfileResponse>,
        IRequestHandler<BizTermAgreeCommand, Unit>,
        IRequestHandler<BizProfileUpdateCommand, Unit>,
        IRequestHandler<GetBizsQuery, IEnumerable<BizListResponse>>,
        IBizProfileManager
{
    private readonly IIdentityRepository _idRepository;
    private readonly IBizRepository _bizRepository;
    private readonly IPortalUserRepository _portalUserRepository;
    private readonly IAddressRepository _addressRepository;
    private readonly IMapper _mapper;

    public BizProfileManager(
        IIdentityRepository idRepository,
        IBizRepository bizRepository,
        IPortalUserRepository portalUserRepository,
        IAddressRepository addressRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _idRepository = idRepository;
        _bizRepository = bizRepository;
        _addressRepository = addressRepository;
        _portalUserRepository = portalUserRepository;
    }

    public async Task<BizUserLoginResponse> Handle(BizLoginCommand cmd, CancellationToken ct)
    {
        Identity? currentUserIdentity = null;
        IdentityQueryResult idResult = await _idRepository.Query(
            new IdentityQry(cmd.BceidIdentityInfo.UserGuid.ToString(), cmd.BceidIdentityInfo.BizGuid, IdentityProviderTypeEnum.BusinessBceId),
            ct);
        if (idResult != null && idResult.Items.Any())
            currentUserIdentity = idResult.Items.FirstOrDefault();

        if (await IsBizFirstTimeLogin(cmd, ct))
        {
            //add current user to Biz as primary biz manager
            Guid? identityId = currentUserIdentity?.Id;
            Guid? bizId = cmd.BizId;

            if (cmd.BizId == null)
                bizId = (await CreateBiz(cmd, ct)).Id;
            else
            {
                //add biz type to org
                BizResult b = await _bizRepository.ManageBizAsync(new BizAddServiceTypeCmd((Guid)cmd.BizId, ServiceTypeEnum.SecurityBusinessLicence), ct);
                bizId = b.Id;
            }

            if (currentUserIdentity == null)
                identityId = await CreateUserIdentity(cmd, ct);

            PortalUserResp resp = await AddPortalUserToBiz(cmd.BceidIdentityInfo, (Guid)identityId, (Guid)bizId, ct);
            return _mapper.Map<BizUserLoginResponse>(resp);
        }
        else
        {
            PortalUserResp? portalUser = await GetBizManagerForCurrentUser(cmd, currentUserIdentity, ct);
            if (portalUser != null)
            {
                //let user login
                //return the loginResponse
                return _mapper.Map<BizUserLoginResponse>(portalUser);
            }
            else
            {
                //deny user login
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "NO_ACTIVE_ACCOUNT_FOR_ORG");
            }
        }
    }

    public async Task<IEnumerable<BizListResponse>> Handle(GetBizsQuery query, CancellationToken ct)
    {
        IEnumerable<BizResult> result = await _bizRepository.QueryBizAsync(new BizsQry(query.BizGuid), ct);
        return _mapper.Map<IEnumerable<BizListResponse>>(result);
    }

    public async Task<BizProfileResponse> Handle(GetBizProfileQuery query, CancellationToken ct)
    {
        BizResult? result = await _bizRepository.GetBizAsync(query.BizId, ct);

        return _mapper.Map<BizProfileResponse>(result);
    }

    public async Task<Unit> Handle(BizTermAgreeCommand cmd, CancellationToken ct)
    {
        await _portalUserRepository.ManageAsync(
            new UpdatePortalUserCmd() { Id = cmd.BizUserId, TermAgreeTime = DateTimeOffset.UtcNow },
            ct);
        return default;
    }

    public async Task<Unit> Handle(BizProfileUpdateCommand cmd, CancellationToken ct)
    {
        BizUpdateCmd bizUpdateCmd = _mapper.Map<BizUpdateCmd>(cmd.BizProfileUpdateRequest);

        await _bizRepository.ManageBizAsync(bizUpdateCmd, ct);

        AddressQry qry = new AddressQry() { OrganizationId = bizUpdateCmd.Id, Type = AddressTypeEnum.Branch };
        IEnumerable<AddressResp> addressesResp = await _addressRepository.QueryAsync(qry, ct);

        IEnumerable<BranchAddr> addresses = _mapper.Map<IEnumerable<BranchAddr>>(addressesResp);

        await ProcessBranchAddresses(addresses.ToList(), bizUpdateCmd.BranchAddresses.ToList(), ct);

        return default;
    }

    private async Task<bool> IsBizFirstTimeLogin(BizLoginCommand cmd, CancellationToken ct)
    {
        if (cmd.BizId == null) return true;
        BizResult? biz = await _bizRepository.GetBizAsync((Guid)cmd.BizId, ct);
        if (biz == null) return true;
        if (!biz.ServiceTypes.Contains(ServiceTypeEnum.SecurityBusinessLicence))
            return true;

        var portalUsers = await _portalUserRepository.QueryAsync(
            new PortalUserQry { OrgId = cmd.BizId, PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing },
            ct);
        if (portalUsers == null || !portalUsers.Items.Any())
        {
            return true; //no user registered as licensing means it is first time login
        }
        return false;
    }

    private async Task<PortalUserResp?> GetBizManagerForCurrentUser(BizLoginCommand cmd, Identity currentUserIdentity, CancellationToken ct)
    {
        //get current user identity
        if (currentUserIdentity == null)
            return null;

        var portalUsers = await _portalUserRepository.QueryAsync(
            new PortalUserQry { OrgId = cmd.BizId, IdentityId = currentUserIdentity.Id, PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing },
            ct);
        PortalUserResp resp = portalUsers.Items.FirstOrDefault();
        if (resp != null && (resp.ContactRoleCode == ContactRoleCode.PrimaryBusinessManager || resp.ContactRoleCode == ContactRoleCode.BusinessManager))
            return resp;
        return null;
    }

    private async Task<Guid> CreateUserIdentity(BizLoginCommand cmd, CancellationToken ct)
    {
        IdentityCmdResult? identity = await _idRepository.Manage(new CreateIdentityCmd(
            cmd.BceidIdentityInfo.UserGuid.ToString(),
            cmd.BceidIdentityInfo.BizGuid,
            IdentityProviderTypeEnum.BusinessBceId), ct);
        if ((identity == null))
        {
            throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "create identity failed.");
        }
        else
        {
            return identity.Id;
        }
    }

    private async Task<BizResult> CreateBiz(BizLoginCommand cmd, CancellationToken ct)
    {
        BizCreateCmd createCmd = new BizCreateCmd() 
        {
            ServiceTypes = new List<ServiceTypeEnum> { ServiceTypeEnum.SecurityBusinessLicence },
            BizLegalName = cmd.BceidIdentityInfo.BizName,
            BizName = cmd.BceidIdentityInfo.BizName,
            Email = cmd.BceidIdentityInfo.Email,
            BizGuid = cmd.BceidIdentityInfo.BizGuid,
        };

        return await _bizRepository.ManageBizAsync(createCmd, ct);
    }

    private async Task<PortalUserResp> AddPortalUserToBiz(BceidIdentityInfo info, Guid identityId, Guid bizId, CancellationToken ct)
    {
        return await _portalUserRepository.ManageAsync(new CreatePortalUserCmd()
        {
            IdentityId = identityId,
            EmailAddress = info.Email,
            FirstName = info.FirstName,
            LastName = info.LastName,
            OrgId = bizId,
            ContactRoleCode = ContactRoleCode.PrimaryBusinessManager,
            PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing
        }, ct);
    }

    private async Task ProcessBranchAddresses(List<BranchAddr> branches, List<BranchAddr> branchesToProcess, CancellationToken ct)
    {
        // Remove branches defined in the entity that are not part of the request
        var modifiedBrances = branchesToProcess.Where(b => b.BranchId != Guid.Empty && b.BranchId != null);
        List<Guid?> addressesToRemove = branches.Where(b => modifiedBrances.All(mb => mb.BranchId != b.BranchId)).Select(b => b.BranchId).ToList();

        await _addressRepository.DeleteAddressesAsync(addressesToRemove, ct);

        UpsertAddressCmd updateAddressCmd = new()
        {
            Addresses = modifiedBrances
        };

        await _addressRepository.UpdateAddressesAsync(updateAddressCmd, ct);

        List<BranchAddr> addressesToCreate = branchesToProcess.Where(b => b.BranchId == Guid.Empty || b.BranchId == null).ToList();

        UpsertAddressCmd createAddressCmd = new()
        {
            Addresses = modifiedBrances
        };

        await _addressRepository.CreateAddressesAsync(createAddressCmd, ct);
    }
}
