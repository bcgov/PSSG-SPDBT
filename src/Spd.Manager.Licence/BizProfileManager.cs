using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Registration;

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
    private readonly IOrgRepository _orgRepository;
    private readonly IPortalUserRepository _portalUserRepository;
    private readonly IMapper _mapper;

    public BizProfileManager(
        ILogger<IFeeManager> logger,
        IIdentityRepository idRepository,
        IOrgRepository orgRepository,
        IPortalUserRepository portalUserRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _logger = logger;
        _idRepository = idRepository;
        _orgRepository = orgRepository;
        _portalUserRepository = portalUserRepository;
    }

    public async Task<BizUserLoginResponse> Handle(BizLoginCommand cmd, CancellationToken ct)
    {
        //get current user org
        OrgResult? currentUserOrg = null;
        OrgsQryResult orgs = (OrgsQryResult)await _orgRepository.QueryOrgAsync(new OrgsQry(cmd.BceidIdentityInfo.BizGuid), ct);
        if (orgs != null && orgs.OrgResults.Any())
            currentUserOrg = orgs.OrgResults.FirstOrDefault();

        //get current user identity
        Identity? currentUserIdentity = null;
        IdentityQueryResult idResult = await _idRepository.Query(
            new IdentityQry(cmd.BceidIdentityInfo.UserGuid.ToString(), cmd.BceidIdentityInfo.BizGuid, IdentityProviderTypeEnum.BusinessBceId),
            ct);
        if (idResult != null && idResult.Items.Any())
            currentUserIdentity = idResult.Items.FirstOrDefault();

        if (currentUserOrg != null && currentUserOrg.ServiceTypes.Contains(ServiceTypeEnum.SecurityBusinessLicence)) //the org is already there as a security business, so, it is registered
        {
            if (currentUserIdentity == null) //current user is not a manager for this org,
            {
                //var portalUsers = await _portalUserRepository.QueryAsync(new PortalUserQry { OrgId = currentUserOrg.Id }, ct);
                //if (portalUsers.Items.Any(u => u.)
                //if this org does not have any primaryBizManager, then add user as primaryBizManager, and let him in
                //if this org does not has primaryBizManager, tell user to contact primaryBizManager
            }
            else
            {

            }
            //if current user is a manager for this org, then let him login

            //if current user is not a manager for this org, and there is a primaryBizManager, then ask user to .

        }


        //the org is not registered, this is the first time this bceid login to biz portal
        //create org and add user to this org as primary Biz manager
        //

        //the org is not registered, this is the first time this bceid login to biz portal
        //create org and add user to this org as primary Biz manager

        return new BizUserLoginResponse
        {
            BizUserId = Guid.NewGuid(),
        };
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
}
