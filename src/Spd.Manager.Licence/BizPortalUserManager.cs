using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.User;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class BizPortalUserManager :
    IRequestHandler<BizPortalUserCreateCommand, BizPortalUserResponse>,
    IRequestHandler<BizPortalUserUpdateCommand, BizPortalUserResponse>,
    IRequestHandler<BizPortalUserListQuery, BizPortalUserListResponse>,
    IRequestHandler<BizPortalUserDeleteCommand, Unit>,
    IRequestHandler<BizPortalUserGetQuery, BizPortalUserResponse>,
    IBizPortalUserManager
{
    private readonly IMapper _mapper;
    private readonly IPortalUserRepository _portalUserRepository;
    private readonly IBizRepository _bizRepository;

    public BizPortalUserManager(IMapper mapper, IPortalUserRepository portalUserRepository, IBizRepository bizRepository)
    {
        _mapper = mapper;
        _portalUserRepository = portalUserRepository;
        _bizRepository = bizRepository;
    }

    public async Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct)
    {
        PortalUserListResp existingUsersResult = (PortalUserListResp)await _portalUserRepository.QueryAsync(
            new PortalUserQry()
            {
                OrgId = request.BizPortalUserCreateRequest.BizId,
                ContactRoleCode = new List<ContactRoleCode> { ContactRoleCode.PrimaryBusinessManager, ContactRoleCode.BusinessManager },
                PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing
            },
            ct);

        //check if email already exists for the user
        if (existingUsersResult.Items.Any(u => u.UserEmail != null && u.UserEmail.Equals(request.BizPortalUserCreateRequest.Email, StringComparison.InvariantCultureIgnoreCase)))
        {
            throw new DuplicateException(HttpStatusCode.BadRequest, $"User email {request.BizPortalUserCreateRequest.Email} has been used by another user");
        }

        //check if role is within the maxium number scope
        var newlist = _mapper.Map<List<UserResult>>(existingUsersResult.Items.ToList());
        newlist.Add(_mapper.Map<UserResult>(request.BizPortalUserCreateRequest));
        BizResult biz = await _bizRepository.GetBizAsync(request.BizPortalUserCreateRequest.BizId, ct);
        int primaryUserNo = newlist.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.PrimaryBusinessManager);
        SharedManagerFuncs.CheckMaxRoleNumberRuleAsync(biz.MaxContacts, biz.MaxPrimaryContacts, primaryUserNo, newlist.Count);

        var createPortalUserCmd = _mapper.Map<CreatePortalUserCmd>(request.BizPortalUserCreateRequest);
        createPortalUserCmd.HostUrl = request.HostUrl;
        createPortalUserCmd.CreatedByUserId = request.CreatedByUserId;
        var response = await _portalUserRepository.ManageAsync(createPortalUserCmd, ct);

        return _mapper.Map<BizPortalUserResponse>(response);
    }

    public async Task<BizPortalUserResponse> Handle(BizPortalUserUpdateCommand request, CancellationToken ct)
    {
        PortalUserListResp existingUsersResult = (PortalUserListResp)await _portalUserRepository.QueryAsync(
            new PortalUserQry()
            {
                OrgId = request.BizPortalUserUpdateRequest.BizId,
                ContactRoleCode = new List<ContactRoleCode> { ContactRoleCode.PrimaryBusinessManager, ContactRoleCode.BusinessManager },
                PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing
            },
            ct);

        //check if email already exists for the other users
        if (existingUsersResult.Items
            .Where(u => u.Id != request.BizPortalUserUpdateRequest.Id)
            .Any(u => u.UserEmail != null && u.UserEmail.Equals(request.BizPortalUserUpdateRequest.Email, StringComparison.InvariantCultureIgnoreCase)))
        {
            throw new DuplicateException(HttpStatusCode.BadRequest, $"User email {request.BizPortalUserUpdateRequest.Email} has been used by another user");
        }

        //check if user id in request exists in result list
        var existingUser = existingUsersResult.Items.FirstOrDefault(u => u.Id == request.BizPortalUserUpdateRequest.Id);
        if (existingUser == null)
            throw new NotFoundException(HttpStatusCode.BadRequest, $"Cannot find the user");

        BizResult biz = await _bizRepository.GetBizAsync(request.BizPortalUserUpdateRequest.BizId, ct);

        var updatePortalUserCmd = _mapper.Map<UpdatePortalUserCmd>(request.BizPortalUserUpdateRequest);
        var response = await _portalUserRepository.ManageAsync(updatePortalUserCmd, ct);

        return _mapper.Map<BizPortalUserResponse>(response);
    }

    public async Task<BizPortalUserResponse> Handle(BizPortalUserGetQuery request, CancellationToken ct)
    {
        var response = (PortalUserResp)await _portalUserRepository.QueryAsync(
                new PortalUserByIdQry(request.UserId),
                ct);
        return _mapper.Map<BizPortalUserResponse>(response);
    }

    public async Task<BizPortalUserListResponse> Handle(BizPortalUserListQuery query, CancellationToken ct)
    {
        PortalUserListResp existingUsersResult = (PortalUserListResp)await _portalUserRepository.QueryAsync(
            new PortalUserQry()
            {
                OrgId = query.BizId,
                IncludeInactive = !query.OnlyReturnActiveUsers,
                ContactRoleCode = new List<ContactRoleCode>() { ContactRoleCode.PrimaryBusinessManager, ContactRoleCode.BusinessManager },
                PortalUserServiceCategory = PortalUserServiceCategoryEnum.Licensing
            },
            ct);

        var userResps = _mapper.Map<IEnumerable<BizPortalUserResponse>>(existingUsersResult.Items);
        BizResult? biz = await _bizRepository.GetBizAsync(query.BizId, ct);

        return new BizPortalUserListResponse
        {
            MaximumNumberOfAuthorizedContacts = biz != null ? biz.MaxContacts : 0,
            MaximumNumberOfPrimaryAuthorizedContacts = biz != null ? biz.MaxPrimaryContacts : 0,
            Users = userResps
        };
    }

    public async Task<Unit> Handle(BizPortalUserDeleteCommand request, CancellationToken cancellationToken)
    {
        //check role max number rule
        var existingUsersResult = (PortalUserListResp)await _portalUserRepository.QueryAsync(
            new PortalUserQry() { OrgId = request.BizId },
            cancellationToken);
        var toDeleteUser = existingUsersResult.Items.FirstOrDefault(u => u.Id == request.UserId);
        var newUsers = existingUsersResult.Items.ToList();
        if (toDeleteUser == null) return default;
        newUsers.Remove(toDeleteUser);
        var biz = await _bizRepository.QueryBizAsync(new BizsQry(request.BizId), cancellationToken);
        int primaryUserNo = newUsers.Count(u => u.ContactRoleCode == ContactRoleCode.PrimaryBusinessManager);
        SharedManagerFuncs.CheckMaxRoleNumberRuleAsync(biz.First().MaxContacts, biz.First().MaxPrimaryContacts, primaryUserNo, newUsers.Count);

        await _portalUserRepository.ManageAsync(
            new PortalUserDeleteCmd(request.UserId),
            cancellationToken);
        return default;
    }
}
