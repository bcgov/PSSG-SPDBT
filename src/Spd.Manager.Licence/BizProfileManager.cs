using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository;
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
        IBizProfileManager
{

    private readonly ILogger<IFeeManager> _logger;
    private readonly IIdentityRepository _idRepository;
    private readonly IBizRepository _bizRepository;
    private readonly IPortalUserRepository _portalUserRepository;
    private readonly IMapper _mapper;

    public BizProfileManager(
        ILogger<IFeeManager> logger,
        IIdentityRepository idRepository,
        IBizRepository bizRepository,
        IPortalUserRepository portalUserRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _logger = logger;
        _idRepository = idRepository;
        _bizRepository = bizRepository;
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
            PortalUserResp portalUser = await IsCurrentUserBizManager(cmd, currentUserIdentity, ct);
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

    public Task<BizProfileResponse> Handle(GetBizProfileQuery query, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<Unit> Handle(BizTermAgreeCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<Unit> Handle(BizProfileUpdateCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    private async Task<bool> IsBizFirstTimeLogin(BizLoginCommand cmd, CancellationToken ct)
    {
        if (cmd.BizId == null) return true;
        BizResult? biz = await _bizRepository.GetBizAsync((Guid)cmd.BizId, ct);
        if (biz == null) return true;
        if (!biz.ServiceTypes.Contains(ServiceTypeEnum.SecurityBusinessLicence))
            return true;

        var portalUsers = await _portalUserRepository.QueryAsync(new PortalUserQry { OrgId = cmd.BizId }, ct);
        if (!portalUsers.Items.Any(u => u.ContactRoleCode == ContactRoleCode.PrimaryBusinessManager || u.ContactRoleCode == ContactRoleCode.BusinessManager))
        {
            return true; //when no user has primary biz manager role, means it is first time login
        }
        return false;
    }

    private async Task<PortalUserResp?> IsCurrentUserBizManager(BizLoginCommand cmd, Identity currentUserIdentity, CancellationToken ct)
    {
        //get current user identity
        if (currentUserIdentity == null)
            return null;

        var portalUsers = await _portalUserRepository.QueryAsync(new PortalUserQry { OrgId = cmd.BizId, IdentityId = currentUserIdentity.Id }, ct);
        PortalUserResp resp = portalUsers.Items.FirstOrDefault();
        if (resp != null && (resp.ContactRoleCode == ContactRoleCode.PrimaryBusinessManager || resp.ContactRoleCode == ContactRoleCode.BusinessManager))
            return resp;
        return null;
    }

    private async Task<Guid> CreateUserIdentity(BizLoginCommand cmd, CancellationToken ct)
    {
        IdentityCmdResult id = await _idRepository.Manage(new CreateIdentityCmd(
            cmd.BceidIdentityInfo.UserGuid.ToString(),
            cmd.BceidIdentityInfo.BizGuid,
            IdentityProviderTypeEnum.BusinessBceId), ct);
        return id.Id;
    }

    private async Task<BizResult> CreateBiz(BizLoginCommand cmd, CancellationToken ct)
    {
        Biz b = new()
        {
            ServiceTypes = new List<ServiceTypeEnum> { ServiceTypeEnum.SecurityBusinessLicence },
            BizLegalName = cmd.BceidIdentityInfo.BizName,
            Email = cmd.BceidIdentityInfo.Email,
        };
        return await _bizRepository.ManageBizAsync(new BizCreateCmd(b), ct);
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
            ContactRoleCode = ContactRoleCode.PrimaryBusinessManager
        }, ct);
    }
}
