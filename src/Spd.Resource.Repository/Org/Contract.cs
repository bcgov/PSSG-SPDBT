using Spd.Resource.Repository.Registration;

namespace Spd.Resource.Repository.Org
{
    public interface IOrgRepository
    {
        Task<bool> CheckDuplicateAsync(SearchOrgQry searchOrgQry, CancellationToken cancellationToken);
        Task<OrgQryData> QueryOrgAsync(OrgQry orgQry, CancellationToken ct);
        Task<OrgManageResult> ManageOrgAsync(OrgCmd orgCmd, CancellationToken ct);
    }
    //command
    public abstract record OrgCmd;
    public record OrgUpdateCmd(Org Org) : OrgCmd;
    public record OrgGuidUpdateCmd(Guid OrgId, string? OrgGuid) : OrgCmd;
    public record OrgManageResult(OrgResult Org);

    //query
    public abstract record OrgQry;
    public record OrgsQry(Guid? OrgGuid = null, Guid? ParentOrgId = null, bool IncludeInactive = false, string? OrgCode = null, IEnumerable<ServiceTypeCode>? ServiceTypes = null) : OrgQry;
    public record OrgByIdentifierQry(Guid? OrgId, string? AccessCode = null) : OrgQry;
    public record SearchOrgQry : OrgQry
    {
        public string? GenericEmail { get; set; }
        public string? MailingPostalCode { get; set; }
        public string? OrganizationName { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public RegistrationTypeCode RegistrationTypeCode { get; set; }
    }
    public abstract record OrgQryData;
    public record OrgQryResult(OrgResult OrgResult) : OrgQryData;
    public record OrgsQryResult(IEnumerable<OrgResult> OrgResults) : OrgQryData;

    //shared content
    public record Org
    {
        public Guid Id { get; set; }
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode? LicenseesNeedVulnerableSectorScreening { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
        public EmployeeInteractionTypeCode? EmployeeInteractionType { get; set; }
        public bool HasInvoiceSupport { get; set; }
    }
    public record OrgResult : Org
    {
        public int MaxContacts { get; } = 6;
        public int MaxPrimaryContacts { get; } = 2;
        public string? AccessCode { get; set; }
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
        public bool GenericUploadEnabled { get; set; }
        public string? EmployeeOrganizationTypeCode { get; set; }
        public string? VolunteerOrganizationTypeCode { get; set; }
        public IEnumerable<ServiceTypeCode> ServiceTypes { get; set; } = Array.Empty<ServiceTypeCode>();
        public bool IsActive { get; set; } = true;
        public Guid? ParentOrgId { get; set; }
    }
}
