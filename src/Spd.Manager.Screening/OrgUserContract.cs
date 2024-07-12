using FluentValidation;
using MediatR;
using Spd.Utilities.LogonUser;
using Spd.Manager.Shared;

namespace Spd.Manager.Screening
{
    public interface IOrgUserManager
    {
        public Task<OrgUserResponse> Handle(OrgUserCreateCommand request, CancellationToken ct);
        public Task<OrgUserResponse> Handle(OrgUserUpdateCommand request, CancellationToken ct);
        public Task<OrgUserResponse> Handle(OrgUserGetQuery request, CancellationToken ct);
        public Task<OrgUserListResponse> Handle(OrgUserListQuery request, CancellationToken ct);
        public Task<Unit> Handle(OrgUserDeleteCommand request, CancellationToken ct);
        public Task<InvitationResponse> Handle(VerifyUserInvitation request, CancellationToken ct);
        public Task<Unit> Handle(OrgUserUpdateLoginCommand command, CancellationToken ct);
        public Task<OrgUserResponse> Handle(RegisterBceidPrimaryUserCommand command, CancellationToken ct);
    }

    public record OrgUserCreateCommand(OrgUserCreateRequest OrgUserCreateRequest, string HostUrl, Guid? CreatedByUserId) : IRequest<OrgUserResponse>;
    public record OrgUserUpdateCommand(Guid UserId, OrgUserUpdateRequest OrgUserUpdateRequest, bool OnlyChangePhoneJob = false) : IRequest<OrgUserResponse>;
    public record OrgUserGetQuery(Guid UserId) : IRequest<OrgUserResponse>;
    public record OrgUserListQuery(Guid OrganizationId, bool OnlyReturnActiveUsers = false) : IRequest<OrgUserListResponse>;
    public record OrgUserDeleteCommand(Guid UserId, Guid OrganizationId) : IRequest<Unit>;
    public record OrgUserUpdateLoginCommand(Guid UserId) : IRequest<Unit>;
    public record VerifyUserInvitation(InvitationRequest InvitationRequest, Guid OrgGuid, Guid UserGuid) : IRequest<InvitationResponse>;
    public record RegisterBceidPrimaryUserCommand(Guid OrganizationId, BceidIdentityInfo IdentityInfo) : IRequest<OrgUserResponse>;

    public abstract record OrgUserUpsertRequest
    {
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
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
        public IEnumerable<OrgUserResponse> Users { get; set; } = Array.Empty<OrgUserResponse>();
    }

    public class OrgUserResponse
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public ContactAuthorizationTypeCode ContactAuthorizationTypeCode { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }
    }

    public record InvitationRequest(string InviteEncryptedCode);
    public record InvitationResponse(Guid OrgId);

    public class OrgUserCreateRequestValidator<T> : AbstractValidator<T> where T : OrgUserUpsertRequest
    {
        public OrgUserCreateRequestValidator()
        {
            RuleFor(r => r.ContactAuthorizationTypeCode)
                        .IsInEnum();

            RuleFor(r => r.FirstName)
                .NotEmpty()
                .MaximumLength(40);

            RuleFor(r => r.LastName)
                .NotEmpty()
                .MaximumLength(40);

            RuleFor(r => r.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(75);
        }
    }


    public class OrgUserUpdateRequestValidator : OrgUserCreateRequestValidator<OrgUserUpdateRequest>
    {
        public OrgUserUpdateRequestValidator()
        {

            RuleFor(r => r.PhoneNumber)
                .NotEmpty()
                .MaximumLength(12)
                .When(r => r.Id != Guid.Empty);

            RuleFor(r => r.JobTitle)
                .NotEmpty()
                .MaximumLength(100)
                .When(r => r.Id != Guid.Empty);
        }
    }
}
