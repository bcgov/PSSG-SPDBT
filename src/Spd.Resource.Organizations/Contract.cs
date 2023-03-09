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
        Children,
        Adults,
        ChildrenAndAdults,
        Neither
    }

    public enum ScreeningsCountTypeCode
    {
        LessThanOneHundred,
        OneToFiveHundred,
        MoreThanFiveHundred
    }

    public enum PayerPreferenceTypeCode
    {
        Organization,
        Applicant
    }

    public enum BooleanTypeCode
    {
        Yes,
        No
    }

    public enum FundsFromBcGovtExceedsThresholdCode
    {
        Yes,
        NotSure
    }

    public enum EmployeeOrganizationTypeCode
    {
        Childcare,
        Healthcare,
        Education,
        Funding,
        CrownCorp,
        ProvGovt,
        Registrant,
        GovnBody,
        Appointed
    }

    public enum VolunteerOrganizationTypeCode
    {
        NonProfit,
        Childcare,
        Healthcare,
        Education,
        ProvFunded,
        CrownCorp,
        ProvGovt,
        Registrant,
        Municipality,
        PostSec,
    }

    public enum PortalUserIdentityTypeCode
    {
        BusinessBceId,
        BcServicesCard,
        Idir,
    }

    public class RegistrationResponse
    {
        public Guid OrgRegistrationId { get; set; }
    }
}
