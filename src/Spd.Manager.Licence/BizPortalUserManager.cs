using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.User;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class BizPortalUserManager
    : IRequestHandler<BizPortalUserCreateCommand, BizPortalUserResponse>,
    IBizPortalUserManager
{
    private readonly IMapper _mapper;
    private readonly IPortalUserRepository _portalUserRepository;
    private readonly IOrgRepository _orgRepository;

    public BizPortalUserManager(IMapper mapper, IPortalUserRepository portalUserRepository, IOrgRepository orgRepository)
    {
        _mapper = mapper;
        _portalUserRepository = portalUserRepository;
        _orgRepository = orgRepository;
    }

    public async Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct)
    {
        PortalUserListResp existingUsersResult = await _portalUserRepository.QueryAsync(
            new PortalUserQry() { OrgId = request.BizPortalUserCreateRequest.OrganizationId },
            ct);

        //check if email already exists for the user
        if (existingUsersResult.Items.Any(u => u.UserEmail != null && u.UserEmail.Equals(request.BizPortalUserCreateRequest.Email, StringComparison.InvariantCultureIgnoreCase)))
        {
            throw new DuplicateException(HttpStatusCode.BadRequest, $"User email {request.BizPortalUserCreateRequest.Email} has been used by another user");
        }

        //check if role is withing the maxium number scope
        var newlist = _mapper.Map<List<UserResult>>(existingUsersResult.Items.ToList());
        newlist.Add(_mapper.Map<UserResult>(request.BizPortalUserCreateRequest));
        ////var org = _portalUserRepository.QueryAsync(new PortalUserQry() { OrgId = request.BizPortalUserCreateRequest.OrganizationId }, ct);
        var org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(request.BizPortalUserCreateRequest.OrganizationId), ct);
        SharedManagerFuncs.CheckMaxRoleNumberRuleAsync(org, newlist);

        //var user = _mapper.Map<User>(request.BizPortalUserCreateRequest);
        var createPortalUserCmd = _mapper.Map<CreatePortalUserCmd>(command.CreateRequest);
        var response = await _portalUserRepository.ManageAsync(new CreatePortalUserCmd())

        //var response = await _orgUserRepository.ManageOrgUserAsync(
        //    new UserCreateCmd(user, request.HostUrl, CreatedByUserId: request.CreatedByUserId),
        //    ct);
        //return _mapper.Map<OrgUserResponse>(response.UserResult);

        return new BizPortalUserResponse();
    }
}
