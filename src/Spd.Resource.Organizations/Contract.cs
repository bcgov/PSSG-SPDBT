using System.ComponentModel;

namespace Spd.Resource.Organizations
{
    public interface IOrganizationRepository
    {
        Task<bool> RegisterAsync(CreateRegistrationCmd createRequest, CancellationToken cancellationToken);
        Task<List<RegistrationResponse>> GetAllOrgRegistrations();
    }

    public class CreateRegistrationCmd
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
        CHILDREN,
        ADULTS,
        CHILDREN_ADULTS,
        NEITHER
    }

    public enum ScreeningsCountTypeCode
    {
        LESS_100,

        HUNDRED_TO_500,

        MORE_500
    }

    public enum CheckFeePayerTypeCode
    {
        ORGANIZATION,

        APPLICANT
    }

    public enum BooleanTypeCode
    {
        YES,

        NO
    }

    public enum OperatingBudgetTypeCode
    {
        YES,

        NO,

        NOT_SURE
    }

    public enum EmployerOrganizationTypeCode
    {

        CHILDCARE,

        HEALTHCARE,

        EDUCATION,

        FUNDING,

        CROWN_CORP,

        PROV_GOV,

        HEALTH_PROFESSIONAL,

        GOVN_BODY,

        APPOINTED
    }

    public enum VolunteerOrganizationTypeCode
    {
        HEALTH_PROFESSIONAL,

        NON_PROFIT,

        CHILDCARE,

        HEALTHCARE,

        EDUCATION,

        FUNDING,

        CROWN_CORP,

        PROV_GOV,

        MUNICIPALITY,

        POST_SECONDARY,
    }
    public class RegistrationResponse
    {
        public Guid OrgRegistrationId { get; set; }
    }
}
