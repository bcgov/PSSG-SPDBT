using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.Contact;
internal class ContactRepository : IContactRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ContactRepository> _logger;

    public ContactRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        ILogger<ContactRepository> logger)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ContactResp> GetAsync(Guid contactId, CancellationToken ct)
    {
        contact? contact = await _context.contacts.Expand(c => c.spd_Contact_Alias)
            .Where(c => c.contactid == contactId)
            .FirstOrDefaultAsync(ct);
        if (contact == null) throw new ArgumentException($"cannot find the contact with contactId : {contactId}");
        return _mapper.Map<ContactResp>(contact);
    }

    public async Task<ContactListResp> QueryAsync(ContactQry qry, CancellationToken ct)
    {
        IQueryable<contact> contacts = _context.contacts.Expand(c => c.spd_Contact_Alias);

        if (!qry.IncludeInactive)
            contacts = contacts.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.UserEmail != null) contacts = contacts.Where(d => d.emailaddress1 == qry.UserEmail);

        List<contact> contactList = contacts.ToList();
        return new ContactListResp
        {
            Items = _mapper.Map<IEnumerable<ContactResp>>(contactList)
        };
    }

    public async Task<ContactResp> ManageAsync(ContactCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            UpdateContactCmd c => await UpdateContactAsync(c, ct),
            CreateContactCmd c => await CreateContactAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<ContactResp> UpdateContactAsync(UpdateContactCmd c, CancellationToken ct)
    {
<<<<<<< Updated upstream:src/Spd.Resource.Repository/Contact/ContactRepository.cs
        contact newContact = _mapper.Map<contact>(c);
        contact existingContact = await _context.UpdateContact(c.Id, newContact, null, _mapper.Map<IEnumerable<spd_alias>>(c.Aliases), ct);
=======
        contact existingContact = await _context.GetContactById(c.Id, ct);

        //when we found name is different than current one, need to put current one to alias.
        if (!NameIsSame(existingContact, c))
        {
            //put old name to alias
            Alias alias = _mapper.Map<Alias>(existingContact);
            AddAlias(alias, existingContact);
            //update current contact
            _mapper.Map(c, existingContact);
        }
        //todo: when we found address is different, need to put current address to previous address.
        existingContact.spd_middlename2 = null;
        _context.UpdateObject(existingContact);
        await _context.SaveChangesAsync();
>>>>>>> Stashed changes:src/Spd.Resource.Applicants/Contact/ContactRepository.cs
        return _mapper.Map<ContactResp>(existingContact);
    }

    private async Task<ContactResp> CreateContactAsync(CreateContactCmd c, CancellationToken ct)
    {
        contact contact = _mapper.Map<contact>(c);
        spd_identity? identity = null;
        if (c.IdentityId != null)
        {
            identity = await _context.GetIdentityById((Guid)c.IdentityId, ct);
            if (identity == null)
            {
                _logger.LogError($"no valid identity for {c.IdentityId}");
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "not valid identity.");
            }
        }
        //two saveChanges because "Associate of 1:N navigation property with Create of Update is not supported in CRM"
        contact = await _context.CreateContact(contact, identity, _mapper.Map<IEnumerable<spd_alias>>(c.Aliases), ct);
        return _mapper.Map<ContactResp>(contact);
    }
<<<<<<< Updated upstream:src/Spd.Resource.Repository/Contact/ContactRepository.cs
=======

    private void AddAlias(Alias createAliasCmd, contact contact)
    {
        spd_alias? matchingAlias = AliasExists(createAliasCmd, contact);
        // if not found, create new alias
        if (matchingAlias == null)
        {
            spd_alias alias = _mapper.Map<spd_alias>(createAliasCmd);
            _context.AddTospd_aliases(alias);
            // associate alias to contact
            _context.SetLink(alias, nameof(alias.spd_ContactId), contact);
        }
    }

    private bool NameIsSame(contact original, ContactCmd newContact)
    {
        return (original.firstname == newContact.firstname
            && original.lastname == newContact.lastname
            && original.spd_middlename1 == newContact.spd_middlename1
            && original.spd_middlename2 == newContact.spd_middlename2);

    }

    private spd_alias? AliasExists(Alias aliasCreateCmd, contact contact)
    {
        var matchingAlias = _context.spd_aliases.Where(o =>
           o.spd_firstname == aliasCreateCmd.GivenName &&
           o.spd_middlename1 == aliasCreateCmd.MiddleName1 &&
           o.spd_middlename2 == aliasCreateCmd.MiddleName2 &&
           o.spd_surname == aliasCreateCmd.Surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contactid_value == contact.contactid &&
           o.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
       ).FirstOrDefault();
        return matchingAlias;
    }
>>>>>>> Stashed changes:src/Spd.Resource.Applicants/Contact/ContactRepository.cs
}


