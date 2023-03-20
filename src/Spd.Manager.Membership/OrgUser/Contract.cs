using MediatR;
using System.ComponentModel;

namespace Spd.Manager.Membership.OrgUser
{
    public interface IOrgUserManager
    {
        public Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken cancellationToken);
        public Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken cancellationToken);
        public Task<OrgUserResponse> Handle(OrgUserGetQuery request, CancellationToken cancellationToken);
        public Task<OrgUserListResponse> Handle(OrgUserListQuery request, CancellationToken cancellationToken);
        public Task<Unit> Handle(OrgUserDeleteCommand request, CancellationToken cancellationToken);
    }

    public record OrgUserCreateCommand(OrgUserCreateRequest OrgUserCreateRequest) : IRequest<OrgUserResponse>;
    public record OrgUserUpdateCommand(Guid UserId, OrgUserUpdateRequest OrgUserUpdateRequest) : IRequest<OrgUserResponse>;
    public record OrgUserGetQuery(Guid UserId) : IRequest<OrgUserResponse>;
    public record OrgUserListQuery(Guid OrganizationId) : IRequest<OrgUserListResponse>;
    public record OrgUserDeleteCommand(Guid UserId, Guid OrganizationId) : IRequest<Unit>;

    public abstract record OrgUserUpsertRequest
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
    public record OrgUserCreateRequest : OrgUserUpsertRequest { }

    public record OrgUserUpdateRequest : OrgUserUpsertRequest
    {
        public Guid Id { get; set; }
    }

    public class OrgUserListResponse
    {
        public int? MaximumNumberOfAuthorizedContacts { get; set; }
        public int? MaximumNumberOfPrimaryAuthorizedContacts { get; set; }
        public IEnumerable<OrgUserResponse> Users { get; set; }
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

    public enum ContactAuthorizationTypeCode
    {
        [Description("Primary Authorized Contact")]
        Primary,

        [Description("Authorized Contact")]
        Contact
    }
}
