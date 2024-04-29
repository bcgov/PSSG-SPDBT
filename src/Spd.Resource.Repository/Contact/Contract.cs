using Spd.Resource.Repository.Alias;

namespace Spd.Resource.Repository.Contact
{
    public interface IContactRepository
    {
        public Task<ContactListResp> QueryAsync(ContactQry qry, CancellationToken cancellationToken);
        public Task<ContactResp> ManageAsync(ContactCmd cmd, CancellationToken cancellationToken);
        public Task<ContactResp> GetAsync(Guid contactId, CancellationToken cancellationToken);
        public Task<bool> MergeContactsAsync(MergeContactsCmd cmd, CancellationToken cancellationToken);
    }

    public record ContactListResp
    {
        public IEnumerable<ContactResp> Items { get; set; } = Array.Empty<ContactResp>();
    }

    public record Contact
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? EmailAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly BirthDate { get; set; }
        public GenderEnum? Gender { get; set; }
        public ResidentialAddr? ResidentialAddress { get; set; }
        public MailingAddr? MailingAddress { get; set; }
        public IEnumerable<AliasResp> Aliases { get; set; } = Array.Empty<AliasResp>();
        public bool? IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public bool? IsTreatedForMHC { get; set; }
        public bool? HasCriminalHistory { get; set; }
        public string? CriminalChargeDescription { get; set; }
        public string? BirthPlace { get; set; }
    }
    public record ContactResp : Contact
    {
        public Guid Id { get; set; }
        public DateTime? LastestScreeningLogin { get; set; }
        public DateTimeOffset? LicensingTermAgreedDateTime { get; set; }
        public IEnumerable<LicenceInfo> LicenceInfos { get; set; } = [];
        public bool IsActive { get; set; } = true;
    }
    public record LicenceInfo
    {
        public Guid Id { get; set; }
        public string? LicenceNumber { get; set; }
        public DateOnly ExpiryDate { get; set; }
    }
    public record ContactQry
    {
        public Guid? IdentityId { get; set; }
        public string? UserEmail { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly? BirthDate { get; set; }
        public bool IncludeInactive { get; set; }
        public bool ReturnLicenceInfo { get; set; }
    };

    public abstract record ContactCmd : Contact;
    public record UpdateContactCmd : ContactCmd
    {
        public Guid Id { get; set; }
        public Guid? IdentityId { get; set; }
    };
    public record TermAgreementCmd(Guid Id) : ContactCmd;
    public record CreateContactCmd : ContactCmd
    {
        public Guid? IdentityId { get; set; }
        public string? DisplayName { get; set; }
        public string Sub { get; set; } = null!;
    }
    public record MergeContactsCmd
    {
        public Guid OldContactId { get; set; }
        public Guid NewContactId { get; set; }
    }
}
