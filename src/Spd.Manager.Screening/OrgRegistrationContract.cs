using FluentValidation;
using MediatR;
using Spd.Manager.Shared;
using System.ComponentModel;

namespace Spd.Manager.Screening
{
    public interface IOrgRegistrationManager
    {
        public Task<OrgRegistrationCreateResponse> Handle(RegisterOrganizationCommand request, CancellationToken cancellationToken);
        public Task<OrgRegistrationPortalStatusResponse> Handle(GetOrgRegistrationStatusQuery query, CancellationToken cancellationToken);
    }

    public record RegisterOrganizationCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest, string HostUrl) : IRequest<OrgRegistrationCreateResponse>;
    public record GetOrgRegistrationStatusQuery(string RegistrationNumber) : IRequest<OrgRegistrationPortalStatusResponse>;

    public record OrgRegistrationPortalStatusResponse(OrgRegistrationStatusCode Status);

    public class OrgRegistrationCreateRequest
    {
        public bool? AgreeToTermsAndConditions { get; set; } //do not map
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactGivenName { get; set; }
        public string? ContactJobTitle { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public string? ContactSurname { get; set; }
        public EmployeeInteractionTypeCode EmployeeInteractionFlag { get; set; }
        public string? GenericEmail { get; set; }
        public string? GenericPhoneNumber { get; set; }
        public BooleanTypeCode EmployeeMonetaryCompensationFlag { get; set; }
        public string? MailingAddressLine1 { get; set; }
        public string? MailingAddressLine2 { get; set; }
        public string? MailingCity { get; set; }
        public string? MailingCountry { get; set; }
        public string? MailingPostalCode { get; set; }
        public string? MailingProvince { get; set; }
        public FundsFromBcGovtExceedsThresholdCode OperatingBudgetFlag { get; set; }
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
        public ScreeningsCountTypeCode ScreeningsCount { get; set; }
        public string? LoginIdentityGuid { get; set; }
        public string? LoginIdentityProvider { get; set; }
        public IdentityProviderTypeCode? PortalUserIdentityTypeCode { get; set; }
        public BooleanTypeCode HasPotentialDuplicate { get; set; } = BooleanTypeCode.No;
        public bool RequireDuplicateCheck { get; set; } = true;
    }

    /// <summary>
    /// for Anonymous OrgRegistration
    /// </summary>
    public class AnonymousOrgRegistrationCreateRequest : OrgRegistrationCreateRequest
    {
        public string Recaptcha { get; set; } = null!;
    }

    public enum RegistrationTypeCode
    {
        [Description("Employee")]
        Employee,

        [Description("Volunteer")]
        Volunteer
    }

    public enum ScreeningsCountTypeCode
    {
        [Description("0 - 100")]
        LessThanOneHundred,

        [Description("100 - 500")]
        OneToFiveHundred,

        [Description("More than 500")]
        MoreThanFiveHundred
    }

    public enum FundsFromBcGovtExceedsThresholdCode
    {
        [Description("Yes")]
        Yes,

        [Description("Not Sure")]
        NotSure
    }


    public class OrgRegistrationCreateRequestValidator : AbstractValidator<OrgRegistrationCreateRequest>
    {
        public OrgRegistrationCreateRequestValidator()
        {
            RuleFor(r => r.RegistrationTypeCode)
                .IsInEnum();

            RuleFor(r => r.EmployeeOrganizationTypeCode)
                .IsInEnum()
                .When(r => r.EmployeeOrganizationTypeCode.HasValue);

            RuleFor(r => r.VolunteerOrganizationTypeCode)
                .IsInEnum()
                .When(r => r.VolunteerOrganizationTypeCode.HasValue);

            RuleFor(r => r.EmployeeOrganizationTypeCode)
                .NotEmpty()
                .When(r => r.RegistrationTypeCode == RegistrationTypeCode.Employee);

            RuleFor(r => r.VolunteerOrganizationTypeCode)
                .NotEmpty()
                .When(r => r.RegistrationTypeCode == RegistrationTypeCode.Volunteer);

            RuleFor(r => r.OrganizationName)
                .NotEmpty()
                .MaximumLength(160);

            RuleFor(r => r.EmployeeInteractionFlag)
                .IsInEnum();

            RuleFor(r => r.OperatingBudgetFlag)
                .IsInEnum();

            RuleFor(r => r.PayerPreference)
                .IsInEnum();

            RuleFor(r => r.ContactEmail)
                .NotEmpty()
                .EmailAddress();

            RuleFor(r => r.ContactGivenName)
                .NotEmpty()
                .MaximumLength(40);

            RuleFor(r => r.ContactSurname)
                .NotEmpty()
                .MaximumLength(40);

            RuleFor(r => r.ContactJobTitle)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.ContactPhoneNumber)
                .NotEmpty()
                .MaximumLength(12);

            RuleFor(r => r.EmployeeMonetaryCompensationFlag)
                .IsInEnum();

            RuleFor(r => r.MailingAddressLine1)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.MailingAddressLine2)
                .MaximumLength(100);

            RuleFor(r => r.MailingCity)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.MailingProvince)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.MailingCountry)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.MailingPostalCode)
                .NotEmpty()
                .MaximumLength(20);

            RuleFor(r => r.ScreeningsCount)
                .IsInEnum();

            RuleFor(r => r.AgreeToTermsAndConditions)
                .NotEmpty()
                .Equal(true);

            RuleFor(r => r.GenericEmail)
                .EmailAddress()
                .When(r => !string.IsNullOrWhiteSpace(r.GenericEmail));

            RuleFor(r => r.GenericPhoneNumber)
                .MaximumLength(12);

            RuleFor(r => r.GenericEmail)
                .EmailAddress();

            RuleFor(r => r.PortalUserIdentityTypeCode)
                .IsInEnum()
                .When(r => r.PortalUserIdentityTypeCode.HasValue);
        }
    }

    public class AnonymousOrgRegistrationCreateRequestValidator : AbstractValidator<AnonymousOrgRegistrationCreateRequest>
    {
        public AnonymousOrgRegistrationCreateRequestValidator()
        {
            Include(new OrgRegistrationCreateRequestValidator());
        }
    }

    public class OrgRegistrationCreateResponse
    {
        public bool IsDuplicateCheckRequired { get; set; } = false;
        public bool CreateSuccess { get; set; }
        public bool? HasPotentialDuplicate { get; set; } = null;
        public OrgProcess? DuplicateFoundIn { get; set; } = null;
    }
    public enum OrgProcess
    {
        [Description("Org Registration")]
        Registration,

        [Description("Existing Organization")]
        ExistingOrganization,
    }
    public enum OrgRegistrationStatusCode
    {
        ApplicationSubmitted,
        InProgress,
        CompleteSuccess,
        CompleteFailed
    }
}
