using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;
public interface IBizPortalUserManager
{
    public Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct);
    public Task<BizPortalUserResponse> Handle(BizPortalUserUpdateCommand request, CancellationToken ct);
}

public record BizPortalUserCreateCommand(BizPortalUserCreateRequest BizPortalUserCreateRequest, string HostUrl, Guid? CreatedByUserId) : IRequest<BizPortalUserResponse>;
public record BizPortalUserUpdateCommand(Guid UserId, BizPortalUserUpdateRequest BizPortalUserUpdateRequest, bool OnlyChangePhoneJob = false) : IRequest<BizPortalUserResponse>;

public record BizPortalUserCreateRequest : BizPortalUserUpsertRequest { }

public record BizPortalUserUpdateRequest : BizPortalUserUpsertRequest 
{
    public Guid Id { get; set; }
}

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
}