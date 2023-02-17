using FluentValidation;
using System.ComponentModel;

namespace Spd.Manager.Membership.ViewModels
{
    public class OrgRegistrationCreateRequest
    {
        public bool? AgreeToTermsAndConditions { get; set; } //map to?
        public DateTimeOffset? ContactDateOfBirth { get; set; }
        public CheckFeePayerTypeCode CheckFeePayer { get; set; }
        public string ContactEmail { get; set; }
        public string ContactGivenName { get; set; }
        public string ContactJobTitle { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string ContactSurname { get; set; }
        public EmployeeInteractionTypeCode EmployeeInteractionFlag { get; set; }
        public string GenericEmail { get; set; }
        public string GenericEmailConfirmation { get; set; }
        public string GenericPhoneNumber { get; set; }
        public BooleanTypeCode HasPhoneOrEmail { get; set; }
        public string MailingAddressLine1 { get; set; }
        public string MailingAddressLine2 { get; set; }
        public string MailingCity { get; set; }
        public string MailingCountry { get; set; }
        public string MailingPostalCode { get; set; }
        public string MailingProvince { get; set; }
        public OperatingBudgetTypeCode OperatingBudgetFlag { get; set; }
        public string OrganizationName { get; set; }
        public EmployerOrganizationTypeCode? EmployerOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
        public ScreeningsCountTypeCode ScreeningsCount { get; set; }
    }

    public enum RegistrationTypeCode
    {
        [Description("Employee")]
        EMPLOYEE,

        [Description("Volunteer")]
        VOLUNTEER
    }

    public enum EmployeeInteractionTypeCode
    {
        [Description("My employees work with children")]
        CHILDREN,

        [Description("My employees work with vulnerable adults")]
        ADULTS,

        [Description("My employees work with children and vulnerable adults")]
        CHILDREN_ADULTS,

        [Description("Neither")]
        NEITHER
    }

    public enum ScreeningsCountTypeCode
    {
        [Description("0 - 100")]
        LESS_100,

        [Description("100 - 500")]
        HUNDRED_TO_500,

        [Description("More than 500")]
        MORE_500
    }

    public enum CheckFeePayerTypeCode
    {
        [Description("Organization")]
        ORGANIZATION,

        [Description("Applicant")]
        APPLICANT
    }

    public enum BooleanTypeCode
    {
        [Description("Yes")]
        YES,

        [Description("No")]
        NO
    }

    public enum OperatingBudgetTypeCode
    {
        [Description("Yes")]
        YES,

        [Description("No")]
        NO,

        [Description("Not Sure")]
        NOT_SURE
    }

    public enum EmployerOrganizationTypeCode
    {

        [Description("A childcare facility or daycare")]
        CHILDCARE,

        [Description("A health board, hospital, or care facility")]
        HEALTHCARE,

        [Description("A school board or education authority")]
        EDUCATION,

        [Description("An organization or person who receives ongoing provincial funding")]
        FUNDING,

        [Description("A mainly government-owned corporation")]
        CROWN_CORP,

        [Description("A provincial government ministry or related agency")]
        PROV_GOV,

        [Description("A registered health professional or social worker")]
        HEALTH_PROFESSIONAL,

        [Description("A governing body under the Health Professions Act or the Social Workers Act")]
        GOVN_BODY,

        [Description("An act- or minister-appointed board, commission, or council")]
        APPOINTED
    }

    public enum VolunteerOrganizationTypeCode
    {
        [Description("A registered health professional or social worker")]
        HEALTH_PROFESSIONAL,

        [Description("A registered non profit organization")]
        NON_PROFIT,

        [Description("A childcare facility or daycare")]
        CHILDCARE,

        [Description("A health board, hospital or care facility")]
        HEALTHCARE,

        [Description("A school board or education authority")]
        EDUCATION,

        [Description("An organization or person who receives ongoing provincial funding")]
        FUNDING,

        [Description("A mainly government-owned corporation")]
        CROWN_CORP,

        [Description("A provincial government ministry or related agency")]
        PROV_GOV,

        [Description("A municipality")]
        MUNICIPALITY,

        [Description("A post-secondary institution")]
        POST_SECONDARY,
    }

    public class OrgRegistrationCreateRequestValidator : AbstractValidator<OrgRegistrationCreateRequest>
    {
        public OrgRegistrationCreateRequestValidator()
        {
            RuleFor(r => r.RegistrationTypeCode)
                .IsInEnum();

            RuleFor(r => r.EmployerOrganizationTypeCode)
                .IsInEnum()
                .When(r => r.EmployerOrganizationTypeCode.HasValue);

            RuleFor(r => r.VolunteerOrganizationTypeCode)
                .IsInEnum()
                .When(r => r.VolunteerOrganizationTypeCode.HasValue);

            RuleFor(r => r.EmployerOrganizationTypeCode)
                .NotEmpty()
                .When(r => !r.VolunteerOrganizationTypeCode.HasValue);

            RuleFor(r => r.VolunteerOrganizationTypeCode)
                .NotEmpty()
                .When(r => !r.EmployerOrganizationTypeCode.HasValue);

            RuleFor(r => r)
                .Must(r => !r.EmployerOrganizationTypeCode.HasValue)
                .When(r => r.VolunteerOrganizationTypeCode.HasValue).WithMessage("At least one is required (EmployerOrganizationTypeCode, VolunteerOrganizationTypeCode).")
                .Must(r => !r.VolunteerOrganizationTypeCode.HasValue)
                .When(r => r.EmployerOrganizationTypeCode.HasValue).WithMessage("At least one is required (EmployerOrganizationTypeCode, VolunteerOrganizationTypeCode).");

            RuleFor(r => r.OrganizationName)
                .NotEmpty()
                .MaximumLength(160);

            RuleFor(r => r.EmployeeInteractionFlag)
                .IsInEnum();

            RuleFor(r => r.OperatingBudgetFlag)
                .IsInEnum();

            RuleFor(r => r.CheckFeePayer)
                .IsInEnum();

            RuleFor(r => r.ContactEmail)
                .NotEmpty()
                .EmailAddress();

            RuleFor(r => r.ContactGivenName)
                .NotEmpty();

            RuleFor(r => r.ContactSurname)
                .NotEmpty();

            RuleFor(r => r.ContactJobTitle)
                .NotEmpty();

            RuleFor(r => r.ContactDateOfBirth)
                .NotEmpty();

            RuleFor(r => r.ContactPhoneNumber)
                .NotEmpty()
                .MaximumLength(12);

            RuleFor(r => r.HasPhoneOrEmail)
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
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.YES);

            RuleFor(r => r.GenericEmailConfirmation)
                .NotEmpty()
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.YES);

            RuleFor(r => r.GenericPhoneNumber)
                .NotEmpty()
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.YES);

            RuleFor(r => r)
                .Must(r => r.GenericEmail.Equals(r.GenericEmailConfirmation))
                .When(r => r.HasPhoneOrEmail == BooleanTypeCode.YES)
                .WithMessage("Emails must match");
        }
    }


}