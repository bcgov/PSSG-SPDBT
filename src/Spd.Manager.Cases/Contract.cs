using FluentValidation;
using MediatR;
using System.ComponentModel;

namespace Spd.Manager.Cases
{
    public interface IApplicationManager
    {
        public Task<Unit> Handle(ApplicationInviteCreateCommand request, CancellationToken cancellationToken);
        public Task<IEnumerable<CheckApplicationInviteDuplicateResponse>> Handle(CheckApplicationInviteDuplicateQuery request, CancellationToken cancellationToken);
        public Task<Unit> Handle(ApplicationCreateCommand request, CancellationToken cancellationToken);
        public Task<CheckApplicationDuplicateResponse> Handle(CheckApplicationDuplicateQuery request, CancellationToken cancellationToken);

    }

    public record ApplicationInviteCreateCommand(Guid OrgId, IEnumerable<ApplicationInviteCreateRequest> ApplicationInviteCreateRequests) : IRequest<Unit>;
    public record CheckApplicationInviteDuplicateQuery(Guid OrgId, IEnumerable<ApplicationInviteCreateRequest> ApplicationInviteCreateRequests) : IRequest<IEnumerable<CheckApplicationInviteDuplicateResponse>>;
    public record ApplicationCreateCommand(ApplicationCreateRequest ApplicationCreateRequest) : IRequest<Unit>;
    public record CheckApplicationDuplicateQuery(ApplicationCreateRequest ApplicationCreateRequest) : IRequest<CheckApplicationDuplicateResponse>;

    public record ApplicationInviteCreateRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public bool OrgPay { get; set; }
    }

    public record ApplicationInviteCreateResponse
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public class CheckApplicationInviteDuplicateResponse
    {
        public Guid OrgId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool HasPotentialDuplicate { get; set; } = false;
    }
    public record ApplicationCreateRequest
    {
        public Guid OrgId { get; set; }
        public ApplicationOriginTypeCode OriginTypeCode { get; set; }
        public string GivenName { get; set; }
        public string MiddleName1 { get; set; }
        public string MiddleName2 { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string DriversLicense { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string BirthPlace { get; set; }
        public string JobTitle { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public bool? AgreeToCompleteAndAccurate { get; set; }
        public bool? HaveVerifiedIdentity { get; set; }
        public List<AliasCreateRequest> Aliases { get; set; }
    }

    public record AliasCreateRequest
    {
        public string GivenName { get; set; }
        public string MiddleName1 { get; set; }
        public string MiddleName2 { get; set; }
        public string Surname { get; set; }

    }

    public class CheckApplicationDuplicateResponse
    {
        public Guid OrgSpdId { get; set; }
        public string GivenName { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public bool HasPotentialDuplicate { get; set; } = false;
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
        }
    }

    public class ApplicationCreateRequestValidator : AbstractValidator<ApplicationCreateRequest>
    {
        public ApplicationCreateRequestValidator()
        {
            RuleFor(r => r.OriginTypeCode)
                .IsInEnum();

            RuleFor(r => r.GivenName)
                    .NotEmpty()
                    .MaximumLength(40);

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

            RuleForEach(x => x.Aliases).ChildRules(order =>
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
            });
        }
    }
}
