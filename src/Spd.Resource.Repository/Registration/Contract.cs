namespace Spd.Resource.Repository.Registration
{
    public interface IOrgRegistrationRepository
    {
        Task<bool> AddRegistrationAsync(CreateOrganizationRegistrationCommand createRegistrationCmd, CancellationToken ct);
        Task<bool> CheckDuplicateAsync(SearchRegistrationQry searchQry, CancellationToken ct);
        Task<OrgRegistrationQueryResult> Query(OrgRegistrationQuery query, CancellationToken ct);
    }

    //queries
    public record OrgRegistrationQuery(Guid? UserGuid, Guid? OrgGuid, string? RegistrationNumber = null, bool IncludeInactive = false);
    public record SearchRegistrationQry()
    {
        public string? GenericEmail { get; set; }
        public string? MailingPostalCode { get; set; }
        public string? OrganizationName { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
    }
    public record OrgRegistrationQueryResult(IEnumerable<OrgRegistrationResult> OrgRegistrationResults);

    //commands
    public record CreateOrganizationRegistrationCommand(OrgRegistration OrgRegistration, string HostUrl);

    //shared contents
    public record OrgRegistration
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
        public IdentityProviderTypeEnum? IdentityProviderTypeCode { get; set; }
        public Guid? BizIdentityGuid { get; set; }
        public Guid? BCeIDUserGuid { get; set; }
        public BooleanTypeCode HasPotentialDuplicate { get; set; } = BooleanTypeCode.No;
    }

    public record OrgRegistrationResult : OrgRegistration
    {
        public Guid OrgRegistrationId { get; set; }
        public string OrgRegistrationStatusStr { get; set; } = null!;
        public DateTimeOffset CreatedOn { get; set; }
        public string OrgRegistrationNumber { get; set; }
    };

    public enum RegistrationTypeCode
    {
        Employee,
        Volunteer
    }

    public enum ScreeningsCountTypeCode
    {
        LessThanOneHundred,
        OneToFiveHundred,
        MoreThanFiveHundred
    }

    public enum FundsFromBcGovtExceedsThresholdCode
    {
        Yes,
        NotSure
    }

    public enum IdentityProviderTypeEnum
    {
        BusinessBceId,
        BcServicesCard,
        Idir,
    }
}
