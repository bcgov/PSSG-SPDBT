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

    public record ContactResp
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public string? Gender { get; set; }
        public string? Age { get; set; }
        public string Sub { get; set; } = null!;
        public DateOnly BirthDate { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public ResidentialAddr? ResidentialAddress { get; set; }
        public MailingAddr? MailingAddress { get; set; }
        public IEnumerable<Alias> Aliases { get; set; } = Array.Empty<Alias>();
    }

    public record ContactQry
    {
        public Guid? IdentityId { get; set; }
        public string? UserEmail { get; set; }
        public bool IncludeInactive { get; set; }
    };

    public abstract record ContactCmd
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
    };
    public record UpdateContactCmd : ContactCmd
    {
        public Guid Id { get; set; }
    };
    public record CreateContactCmd : ContactCmd
    {
        public string? DisplayName { get; set; }

        public string Sub { get; set; } = null!;

    }

}
