using FluentValidation;
using MediatR;
using Spd.Manager.Membership.Shared;
using System.ComponentModel;

namespace Spd.Manager.Membership.OrgRegistration
{
    public interface IOrgRegistrationManager
    {
        public Task<Unit> Handle(CreateOrgRegistrationCommand request, CancellationToken cancellationToken);
        public Task<CheckDuplicateResponse> Handle(CheckOrgRegistrationDuplicateCommand request, CancellationToken cancellationToken);
    }

    public record CreateOrgRegistrationCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest) : IRequest<Unit>;
    public record CheckOrgRegistrationDuplicateCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest) : IRequest<CheckDuplicateResponse>;

    public class OrgRegistrationCreateRequest
    {
        public bool? AgreeToTermsAndConditions { get; set; } //do not map
        public DateTimeOffset? ContactDateOfBirth { get; set; }
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactGivenName { get; set; }
        public string? ContactJobTitle { get; set; }
        public string? ContactPhoneNumber { get; set; }
        public string? ContactSurname { get; set; }
        public EmployeeInteractionTypeCode EmployeeInteractionFlag { get; set; }
        public string? GenericEmail { get; set; }
        public string? GenericEmailConfirmation { get; set; }
        public string? GenericPhoneNumber { get; set; }
        public BooleanTypeCode EmployeeMonetaryCompensationFlag { get; set; }
        public BooleanTypeCode HasPhoneOrEmail { get; set; }
        public string? MailingAddressLine1 { get; set; }
        public string? MailingAddressLine2 { get; set; }
        public string? MailingCity { get; set; }
        public string? MailingCountry { get; set; }
        public string? MailingPostalCode { get; set; }
        public string? MailingProvince { get; set; }
        public FundsFromBcGovtExceedsThresholdCode OperatingBudgetFlag { get; set; }
        public string? OrganizationName { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
        public ScreeningsCountTypeCode ScreeningsCount { get; set; }
        public string? LoginIdentityGuid { get; set; }
        public string? LoginIdentityProvider { get; set; }
        public PortalUserIdentityTypeCode? PortalUserIdentityTypeCode { get; set; }
    }

    public enum RegistrationTypeCode
    {
        [Description("Employee")]
        Employee,

        [Description("Volunteer")]
        Volunteer
    }

    public enum EmployeeInteractionTypeCode
    {
        [Description("My employees work with children")]
        Children,

        [Description("My employees work with vulnerable adults")]
        Adults,

        [Description("My employees work with children and vulnerable adults")]
        ChildrenAndAdults,

        [Description("Neither")]
        Neither
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

    public enum EmployeeOrganizationTypeCode
    {

        [Description("A childcare facility or daycare")]
        Childcare,

        [Description("A health board, hospital, or care facility")]
        Healthcare,

        [Description("A school board or education authority")]
        Education,

        [Description("An organization or person who receives ongoing provincial funding")]
        Funding,

        [Description("A mainly government-owned corporation")]
        CrownCorp,

        [Description("A provincial government ministry or related agency")]
        ProvGovt,

        [Description("A registered health professional or social worker")]
        Registrant,

        [Description("A governing body under the Health Professions Act or the Social Workers Act")]
        GovnBody,

        [Description("An act- or minister-appointed board, commission, or council")]
        Appointed
    }

    public enum VolunteerOrganizationTypeCode
    {
        [Description("A registered health professional or social worker")]
        Registrant,

        [Description("A registered non profit organization")]
        NonProfit,

        [Description("A childcare facility or daycare")]
        Childcare,

        [Description("A health board, hospital or care facility")]
        Healthcare,

        [Description("A school board or education authority")]
        Education,

        [Description("An organization or person who receives ongoing provincial funding")]
        ProvFunded,

        [Description("A mainly government-owned corporation")]
        CrownCorp,

        [Description("A provincial government ministry or related agency")]
        ProvGovt,

        [Description("A municipality")]
        Municipality,

        [Description("A post-secondary institution")]
        PostSec,
    }

    public enum PortalUserIdentityTypeCode
    {
        [Description("Business BCeID")]
        BusinessBceId,

        [Description("BC Services Card")]
        BcServicesCard,

        [Description("IDIR")]
        Idir,
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

            RuleFor(r => r.ContactDateOfBirth)
                .NotEmpty();

            RuleFor(r => r.ContactPhoneNumber)
                .NotEmpty()
                .MaximumLength(12);

            RuleFor(r => r.HasPhoneOrEmail)
                .IsInEnum();

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
                .NotEmpty();

            RuleFor(r => r.GenericEmail)
                .EmailAddress()
                .When(r => !string.IsNullOrWhiteSpace(r.GenericEmail));

            RuleFor(r => r.GenericEmailConfirmation)
                .EmailAddress()
                .When(r => !string.IsNullOrWhiteSpace(r.GenericEmailConfirmation));

            RuleFor(r => r.GenericPhoneNumber)
                .MaximumLength(12);

            RuleFor(r => r.GenericEmail)
                .NotEmpty()
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.Yes);

            RuleFor(r => r.GenericEmailConfirmation)
                .NotEmpty()
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.Yes);

            RuleFor(r => r.GenericPhoneNumber)
                .NotEmpty()
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.Yes);

            RuleFor(r => r)
                .Must(r => r.GenericEmail!.Equals(r.GenericEmailConfirmation))
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.Yes)
                .WithMessage("Emails must match");

            RuleFor(r => r.PortalUserIdentityTypeCode)
                .IsInEnum()
                .When(r => r.PortalUserIdentityTypeCode.HasValue);
        }
    }
    public class CheckDuplicateResponse
    {
        public bool HasPotentialDuplicate { get; set; } = false;
        public OrgProcess? DuplicateFoundIn { get; set; }
    }
    public enum OrgProcess
    {
        [Description("Org Registration")]
        Registration,

        [Description("Existing Organization")]
        ExistingOrganization,
    }
}
