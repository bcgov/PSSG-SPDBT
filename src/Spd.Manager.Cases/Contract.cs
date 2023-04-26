using FluentValidation;
using MediatR;
using System.ComponentModel;

namespace Spd.Manager.Cases
{
    public interface IApplicationManager
    {
        public Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand request, CancellationToken cancellationToken);
        public Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken cancellationToken);
        public Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken cancellationToken);

    }

    public record ApplicationInviteCreateCommand(ApplicationInvitesCreateRequest ApplicationInvitesCreateRequest, Guid OrgId) : IRequest<ApplicationInvitesCreateResponse>;
    public record ApplicationCreateCommand(ApplicationCreateRequest ApplicationCreateRequest) : IRequest<ApplicationCreateResponse>;
    public record ApplicationListQuery(Guid OrgId, int Page, int PageSize) : IRequest<ApplicationListResponse>;

    //application invites
    public record ApplicationInvitesCreateRequest
    {
        public bool RequireDuplicateCheck { get; set; }
        public IEnumerable<ApplicationInviteCreateRequest> ApplicationInviteCreateRequests { get; set; } = Array.Empty<ApplicationInviteCreateRequest>();
    }
    public abstract record ApplicationInvite
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
    public record ApplicationInviteCreateRequest : ApplicationInvite
    {
        public string? JobTitle { get; set; }
        public PayeePreferenceTypeCode PayeeType { get; set; }
    }
    public record ApplicationInvitesCreateResponse(Guid OrgId)
    {
        public bool IsDuplicateCheckRequired { get; set; }
        public bool CreateSuccess { get; set; }
        public string? ErrorReason { get; set; }
        public IEnumerable<ApplicationInviteDuplicateResponse> DuplicateResponses { get; set; } = Array.Empty<ApplicationInviteDuplicateResponse>();
    }
    public record ApplicationInviteDuplicateResponse : ApplicationInvite
    {
        public bool HasPotentialDuplicate { get; set; } = false;
    }

    //application
    public record ApplicationCreateRequest
    {
        public Guid OrgId { get; set; }
        public ApplicationOriginTypeCode OriginTypeCode { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public string? DriversLicense { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? BirthPlace { get; set; }
        public string? JobTitle { get; set; }
        public ScreeningTypeCode? ScreeningTypeCode { get; set; }
        public string? ContractedCompanyName { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Province { get; set; }
        public string? Country { get; set; }
        public bool? OneLegalName { get; set; }
        public bool? AgreeToCompleteAndAccurate { get; set; }
        public bool? HaveVerifiedIdentity { get; set; }
        public IEnumerable<AliasCreateRequest> Aliases { get; set; } = Array.Empty<AliasCreateRequest>();
        public bool CheckDuplicate { get; set; } = false;
    }
    public record AliasCreateRequest
    {
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }

    }
    public class ApplicationCreateResponse
    {
        public bool IsDuplicateCheckRequired { get; set; } = false;
        public bool CreateSuccess { get; set; } = false;
        public Guid? applicationId { get; set; } = null;
        public bool HasPotentialDuplicate { get; set; } = false;
    }

    public class ApplicationListResponse
    {
        public int? FollowUpBusinessDays { get; set; }
        public IEnumerable<ApplicationResponse> Applications { get; set; }
    }

    public record ApplicationResponse
    {
        public Guid Id { get; set; }
        public Guid OrgId { get; set; }
        public string? ApplicationNumber { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public string? EmailAddress { get; set; }
        public string? ContractedCompanyName { get; set; }
        public bool? HaveVerifiedIdentity { get; set; }
        public DateTimeOffset? CreatedOn { get; set; }
    }

    public enum ApplicationOriginTypeCode
    {
        [Description("Portal")]
        Portal,

        [Description("Email")]
        Email,

        [Description("Web Form")]
        WebForm,

        [Description("Mail")]
        Mail,

        [Description("Fax")]
        Fax,

        [Description("Generic Upload")]
        GenericUpload,

        [Description("Organization Submitted")]
        OrganizationSubmitted
    }

    public enum PayeePreferenceTypeCode
    {
        [Description("Organization")]
        Organization,

        [Description("Applicant")]
        Applicant
    }

    public enum ScreeningTypeCode
    {
        [Description("Staff")]
        Staff,

        [Description("Contractor/Licensee")]
        Contractor
    }

    public class ApplicationInviteCreateRequestValidator : AbstractValidator<ApplicationInviteCreateRequest>
    {
        public ApplicationInviteCreateRequestValidator()
        {
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

            RuleFor(r => r.JobTitle)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.PayeeType)
                .IsInEnum();
        }
    }

    public class AliasCreateRequestValidator : AbstractValidator<AliasCreateRequest>
    {
        public AliasCreateRequestValidator()
        {
            RuleFor(r => r.GivenName)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);

            RuleFor(r => r.Surname)
                    .NotEmpty()
                    .MaximumLength(40);
        }
    }

    public class ApplicationCreateRequestValidator : AbstractValidator<ApplicationCreateRequest>
    {
        public ApplicationCreateRequestValidator()
        {
            RuleFor(r => r.OriginTypeCode)
                .IsInEnum();

            RuleFor(r => r.GivenName)
                    .MaximumLength(40);

            RuleFor(r => r.GivenName)
                    .NotEmpty()
                    .When(r => r.OneLegalName != true);

            RuleFor(r => r.MiddleName1)
                    .MaximumLength(40);

            RuleFor(r => r.MiddleName2)
                    .MaximumLength(40);

            RuleFor(r => r.Surname)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.EmailAddress)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(75);

            RuleFor(r => r.PhoneNumber)
                    .NotEmpty();

            RuleFor(r => r.DateOfBirth)
                    .NotEmpty();

            RuleFor(r => r.BirthPlace)
                    .NotEmpty();

            RuleFor(r => r.JobTitle)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.ScreeningTypeCode)
                    .IsInEnum();

            RuleFor(r => r.ContractedCompanyName)
                    .NotEmpty()
                    .When(r => r.ScreeningTypeCode == ScreeningTypeCode.Contractor);

            RuleFor(r => r.AddressLine1)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.AddressLine2)
                    .MaximumLength(100);

            RuleFor(r => r.City)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.PostalCode)
                    .NotEmpty()
                    .MaximumLength(20);

            RuleFor(r => r.Province)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.Country)
                    .NotEmpty()
                    .MaximumLength(100);

            RuleFor(r => r.AgreeToCompleteAndAccurate)
                .NotEmpty()
                .Equal(true);

            RuleFor(r => r.HaveVerifiedIdentity)
                .NotNull(); // Must be true or false
        }
    }
}
