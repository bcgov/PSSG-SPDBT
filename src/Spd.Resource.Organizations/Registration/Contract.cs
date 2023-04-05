namespace Spd.Resource.Organizations.Registration
{
    public interface IOrgRegistrationRepository
    {
        Task<bool> AddRegistrationAsync(OrgRegistrationCreateCmd createRegistrationCmd, CancellationToken cancellationToken);
        Task<bool> CheckDuplicateAsync(SearchRegistrationQry searchQry, CancellationToken cancellationToken);
    }

    public record OrgRegistrationCreateCmd
    {
        public bool? AgreeToTermsAndConditions { get; set; } //map to?
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
        public IdentityProviderTypeCode? IdentityProviderTypeCode { get; set; }
        public Guid? BizIdentityGuid { get; set; }
        public Guid? BCeIDUserGuid { get; set; }
        public BooleanTypeCode HasPotentialDuplicate { get; set; } = BooleanTypeCode.No;
    }

    public record SearchRegistrationQry
    {
        public string? GenericEmail { get; set; }
        public string? MailingPostalCode { get; set; }
        public string? OrganizationName { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
    }

    public enum RegistrationTypeCode
    {
        Employee,
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

    public enum IdentityProviderTypeCode
    {
        BusinessBceId,
        BcServicesCard,
        Idir,
    }
}
