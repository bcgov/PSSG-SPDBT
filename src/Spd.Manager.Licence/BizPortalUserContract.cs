using MediatR;
using System.ComponentModel;

namespace Spd.Manager.Licence;
public interface IBizPortalUserManager
{
    public Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct);
}

public record BizPortalUserCreateCommand(BizPortalUserCreateRequest BizPortalUserCreateRequest, string HostUrl, Guid? CreatedByUserId) : IRequest<BizPortalUserResponse>;

public record BizPortalUserCreateRequest : BizPortalUserUpsertRequest { }

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

public class BizPortalUserResponse
{
    public Guid Id { get; set; }
    public Guid BizId { get; set; }
    public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public enum ContactAuthorizationTypeCode
{
    [Description("Primary Authorized Business Manager Contact")]
    PrimaryBusinessManager,

    [Description("Authorized Business Manager Contact")]
    BusinessManager
}