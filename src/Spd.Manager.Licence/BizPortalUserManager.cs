﻿using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
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
    private readonly IBizRepository _bizRepository;

    public BizPortalUserManager(IMapper mapper, IPortalUserRepository portalUserRepository, IBizRepository bizRepository)
    {
        _mapper = mapper;
        _portalUserRepository = portalUserRepository;
        _bizRepository = bizRepository;
    }

    public async Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct)
    {
        PortalUserListResp existingUsersResult = await _portalUserRepository.QueryAsync(
            new PortalUserQry() 
            { 
                OrgId = request.BizPortalUserCreateRequest.BizId, 
                ContactRoleCode = new List<ContactRoleCode> { ContactRoleCode.PrimaryBusinessManager, ContactRoleCode.BusinessManager } 
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
        var response = await _portalUserRepository.ManageAsync(createPortalUserCmd, ct);

        return _mapper.Map<BizPortalUserResponse>(response);
    }
}