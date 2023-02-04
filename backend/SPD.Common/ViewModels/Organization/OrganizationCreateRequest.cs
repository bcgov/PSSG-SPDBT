using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace SPD.Common.ViewModels.Organization
{
    public class OrganizationCreateRequest
    {
        public bool? AgreeToTermsAndConditions { get; set; }
        public DateTimeOffset? ContactDateOfBirth { get; set; }
        public string CheckFeePayer { get; set; }
        public string ContactEmail { get; set; }
        public string ContactGivenName { get; set; }
        public string ContactJobTitle { get; set; }
        public string ContactPhoneExt { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string ContactSurname { get; set; }
        public string EmployeeInteractionFlag { get; set; }
        public string GenericEmail { get; set; }
        public string GenericEmailConfirmation { get; set; }
        public string GenericPhoneExt { get; set; }
        public string GenericPhoneNumber { get; set; }
        public string HasPhoneOrEmail { get; set; }
        public string MailingAddressLine1 { get; set; }
        public string MailingAddressLine2 { get; set; }
        public string MailingCity { get; set; }
        public string MailingCountry { get; set; }
        public string MailingPostalCode { get; set; }
        public string MailingProvince { get; set; }
        public string OperatingBudgetFlag { get; set; }
        public string OrganizationName { get; set; }
        public string OrganizationType { get; set; }
        public string RegistrationTypeCode { get; set; }
        public string ScreeningsCount { get; set; }
    }

    public class OrganizationCreateRequestValidator: AbstractValidator<OrganizationCreateRequest>
    {
        public OrganizationCreateRequestValidator() 
        {
            RuleFor(r => r.OrganizationName)
                .NotEmpty();

            RuleFor(r => r.GenericEmail)
                .EmailAddress();

            RuleFor(r => r.ContactEmail)
                .EmailAddress();
        }
    }


}