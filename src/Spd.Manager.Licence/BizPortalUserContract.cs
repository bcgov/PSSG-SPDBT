﻿using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface IBizPortalUserManager
{
    public Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct);
    public Task<BizPortalUserResponse> Handle(BizPortalUserUpdateCommand request, CancellationToken ct);
    public Task<BizPortalUserListResponse> Handle(BizPortalUserListQuery request, CancellationToken ct);
    public Task<BizPortalUserResponse> Handle(BizPortalUserGetQuery request, CancellationToken ct);
    public Task<Unit> Handle(BizPortalUserDeleteCommand request, CancellationToken ct);
    public Task<InvitationResponse> Handle(VerifyUserInvitation request, CancellationToken ct);
}

public record BizPortalUserCreateCommand(BizPortalUserCreateRequest BizPortalUserCreateRequest, string HostUrl, Guid? CreatedByUserId) : IRequest<BizPortalUserResponse>;
public record BizPortalUserUpdateCommand(Guid UserId, BizPortalUserUpdateRequest BizPortalUserUpdateRequest) : IRequest<BizPortalUserResponse>;
public record BizPortalUserDeleteCommand(Guid UserId, Guid BizId) : IRequest<Unit>;
public record VerifyUserInvitation(InvitationRequest InvitationRequest, Guid BizGuid, Guid UserGuid) : IRequest<InvitationResponse>;

public record BizPortalUserCreateRequest : BizPortalUserUpsertRequest { }

public record BizPortalUserUpdateRequest : BizPortalUserUpsertRequest
{
    public Guid Id { get; set; }
}

public record BizPortalUserListQuery(Guid BizId, bool OnlyReturnActiveUsers = false) : IRequest<BizPortalUserListResponse>;
public record BizPortalUserGetQuery(Guid UserId) : IRequest<BizPortalUserResponse>;
public abstract record BizPortalUserUpsertRequest
{
    public Guid BizId { get; set; }
    public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? JobTitle { get; set; }
    public string? PhoneNumber { get; set; }
}

public record BizPortalUserResponse : BizPortalUserUpsertRequest
{
    public Guid Id { get; set; }
    public bool? IsActive { get; set; }
}

public record BizPortalUserListResponse
{
    public int? MaximumNumberOfAuthorizedContacts { get; set; }
    public int? MaximumNumberOfPrimaryAuthorizedContacts { get; set; }
    public IEnumerable<BizPortalUserResponse> Users { get; set; } = Array.Empty<BizPortalUserResponse>();
}

public record InvitationRequest(string InviteEncryptedCode);
public record InvitationResponse(Guid BizId);