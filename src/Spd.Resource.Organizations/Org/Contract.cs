using Spd.Resource.Organizations.Registration;

namespace Spd.Resource.Organizations.Org
{
    public interface IOrgRepository
    {
        Task<bool> CheckDuplicateAsync(SearchOrgQry searchOrgQry, CancellationToken cancellationToken);
        Task<OrgQryResult> QueryOrgAsync(OrgQry orgQry, CancellationToken ct);
        Task<OrgManageResult> ManageOrgAsync(OrgCmd orgCmd, CancellationToken ct);
    }
    //command
    public abstract record OrgCmd;
    public record OrgUpdateCmd(Org Org) : OrgCmd;
    public record OrgManageResult(OrgResult Org);

    //query
    public abstract record OrgQry;
    public record OrgByOrgGuidQry(Guid OrgGuid) : OrgQry;
    public record OrgByIdQry(Guid OrgId) : OrgQry;
    public record SearchOrgQry : OrgQry
    {
        public string? GenericEmail { get; set; }
        public string? MailingPostalCode { get; set; }
        public string? OrganizationName { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
    }
    public record OrgQryResult(OrgResult OrgResult) { }

    //shared content
    public record Org
    {
        public Guid Id { get; set; }
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode LicenseesNeedVulnerableSectorScreening { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
    }
    public record OrgResult : Org
    {
        public int MaxContacts { get; } = 6;
        public int MaxPrimaryContacts { get; } = 2;
        public string? AccessCode { get; set; }
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
        public bool GenericUploadEnabled { get; set; }
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
}
