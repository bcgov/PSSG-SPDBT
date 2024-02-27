using System.Data.Common;

namespace Spd.Resource.Repository.Contact
{
    public interface IContactRepository
    {
        public Task<ContactListResp> QueryAsync(ContactQry qry, CancellationToken cancellationToken);
        public Task<ContactResp> ManageAsync(ContactCmd cmd, CancellationToken cancellationToken);
        public Task<ContactResp> GetAsync(Guid contactId, CancellationToken cancellationToken);
    }

    public record ContactListResp
    {
        public IEnumerable<ContactResp> Items { get; set; } = Array.Empty<ContactResp>();
    }

    public record Contact
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? EmailAddress { get; set; }
        public Guid? IdentityId { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public DateOnly BirthDate { get; set; }
        public GenderEnum? Gender { get; set; }
        public ResidentialAddr? ResidentialAddress { get; set; }
        public MailingAddr? MailingAddress { get; set; }
        public IEnumerable<Alias> Aliases { get; set; } = Array.Empty<Alias>();
        public bool? IsPoliceOrPeaceOfficer { get; set; }
        public PoliceOfficerRoleEnum? PoliceOfficerRoleCode { get; set; }
        public string? OtherOfficerRole { get; set; }
        public bool? IsTreatedForMHC { get; set; }
        public bool? HasCriminalHistory { get; set; }
        public string? CriminalChargeDescription { get; set; }
    }
    public record ContactResp : Contact
    {
        public Guid Id { get; set; }
        public string? DisplayName { get; set; }
        public string Sub { get; set; } = null!;
        public bool? IsFirstTimeLoginScreening { get; set; } = false;
        public bool? IsFirstTimeLoginLicensing { get; set; } = false;
    }

    public record ContactQry
    {
        public Guid? IdentityId { get; set; }
        public string? UserEmail { get; set; }
        public bool IncludeInactive { get; set; }
    };

    public abstract record ContactCmd : Contact;
    public record UpdateContactCmd : ContactCmd
    {
        public Guid Id { get; set; }
        public SourceEnum Source { get; set; } = SourceEnum.SCREENING;

    };
    public record CreateContactCmd : ContactCmd
    {
        public string? DisplayName { get; set; }
        public SourceEnum Source { get; set; } = SourceEnum.SCREENING;

        public string Sub { get; set; } = null!;
    }

    public enum SourceEnum
    {
        LICENSING,
        SCREENING
    }
}
