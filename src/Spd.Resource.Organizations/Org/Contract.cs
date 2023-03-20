namespace Spd.Resource.Organizations.Org
{
    public interface IOrgRepository
    {
        Task<OrgResponse> OrgUpdateAsync(OrgUpdateCommand orgUpdateCommand, CancellationToken cancellationToken);
        Task<OrgResponse> OrgGetAsync(Guid orgId, CancellationToken cancellationToken);
    }
    public record OrgUpdateCommand
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
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
    }
    public record OrgResponse
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
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
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
