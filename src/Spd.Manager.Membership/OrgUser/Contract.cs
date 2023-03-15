using MediatR;
using System.ComponentModel;

namespace Spd.Manager.Membership.OrgUser
{
    public interface IOrgUserManager
    {
        public Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken cancellationToken);
        public Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken cancellationToken);
        public Task<OrgUserResponse> Handle(OrgUserGetCommand request, CancellationToken cancellationToken);
        public Task<IEnumerable<OrgUserResponse>> Handle(OrgUserListCommand request, CancellationToken cancellationToken);
        public Task<Unit> Handle(OrgUserDeleteCommand request, CancellationToken cancellationToken);
    }

    public record OrgUserCreateCommand(OrgUserCreateRequest OrgUserCreateRequest) : IRequest<OrgUserResponse>;
    public record OrgUserUpdateCommand(Guid userId, OrgUserUpdateRequest OrgUserUpdateRequest) : IRequest<OrgUserResponse>;
    public record OrgUserGetCommand(Guid userId) : IRequest<OrgUserResponse>;
    public record OrgUserListCommand(Guid organizationId) : IRequest<IEnumerable<OrgUserResponse>>;
    public record OrgUserDeleteCommand(Guid userId) : IRequest<Unit>;

    public record OrgUserCreateRequest
    {
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public record OrgUserUpdateRequest
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class OrgUserResponse
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class OrgUserUpdateResponse
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public enum ContactAuthorizationTypeCode
    {
        [Description("Primary Authorized Contact")]
        Primary,

        [Description("Authorized Contact")]
        Contact
    }
}
