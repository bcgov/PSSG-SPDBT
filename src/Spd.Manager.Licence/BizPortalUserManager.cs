using AutoMapper;
using MediatR;
using Spd.Resource.Repository.PortalUser;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Licence;
internal class BizPortalUserManager
    : IRequestHandler<BizPortalUserCreateCommand, BizPortalUserResponse>,
    IBizPortalUserManager
{
    private readonly IMapper _mapper;
    private readonly IPortalUserRepository _portalUserRepository;

    public BizPortalUserManager(IMapper mapper, IPortalUserRepository portalUserRepository)
    {
        _mapper = mapper;
        _portalUserRepository = portalUserRepository;
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

        return new BizPortalUserResponse();
    }
}
