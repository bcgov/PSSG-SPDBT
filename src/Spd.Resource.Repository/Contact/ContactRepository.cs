using AutoMapper;
using MediatR;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
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
        IQueryable<contact> contacts = _context.contacts.Expand(c => c.spd_Contact_Alias).Expand(c => c.spd_contact_spd_identity);

        if (!qry.IncludeInactive)
            contacts = contacts.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.UserEmail != null) contacts = contacts.Where(d => d.emailaddress1 == qry.UserEmail);
        if (qry.FirstName != null) contacts = contacts.Where(d => d.firstname == qry.FirstName);
        if (qry.LastName != null) contacts = contacts.Where(d => d.lastname == qry.LastName);
        if (qry.MiddleName1 != null) contacts = contacts.Where(d => d.spd_middlename1 == qry.MiddleName1);
        if (qry.MiddleName2 != null) contacts = contacts.Where(d => d.spd_middlename2 == qry.MiddleName2);
        if (qry.BirthDate != null)
        {
            var birthdate = new Microsoft.OData.Edm.Date(qry.BirthDate.Value.Year, qry.BirthDate.Value.Month, qry.BirthDate.Value.Day);
            contacts = contacts.Where(d => d.birthdate == birthdate);
        }
        if (qry.IdentityId != null)
        {
            if (qry.IdentityId == Guid.Empty)
                contacts = contacts.Where(d => !d.spd_contact_spd_identity.Any());
        }
        List<contact> contactList = contacts.ToList();
        var result = new ContactListResp
        {
            Items = _mapper.Map<IEnumerable<ContactResp>>(contactList)
        };
        if (qry.ReturnLicenceInfo)
        {
            foreach (ContactResp resp in result.Items)
            {
                resp.LicenceInfos = _mapper.Map<IEnumerable<LicenceInfo>>(_context.spd_licences.Where(l => l._spd_licenceholder_value == resp.Id).ToList());
            }
        }
        return result;
    }

    public async Task<ContactResp> ManageAsync(ContactCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            UpdateContactCmd c => await UpdateContactAsync(c, ct),
            CreateContactCmd c => await CreateContactAsync(c, ct),
            TermAgreementCmd c => await TermAgreeAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    public async Task<bool> MergeContactsAsync(MergeContactsCmd cmd, CancellationToken ct)
    {
        contact? oldContact = await _context.GetContactById(cmd.OldContactId, ct);
        contact? newContact = await _context.GetContactById(cmd.NewContactId, ct);
        if (oldContact == null || newContact == null)
        {
            _logger.LogError($"Merge contacts cannot find at least one of the contact");
            throw new ArgumentException("cannot find contact for merging");
        }

        var result = await _context.spd_MergeContacts(oldContact, newContact).GetValueAsync(ct);
        await _context.SaveChangesAsync(ct);
        if (result.IsSuccess == null || !(result.IsSuccess.Value))
        {
            _logger.LogError($"Merge contacts failed for merging oldContact {cmd.OldContactId} to newContact {cmd.NewContactId}");
            throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "merge contacts failed.");
        }
        return true;
    }

    public async Task<Unit> CreateAliasAsync(CreateAliasCommand cmd, CancellationToken ct)
    {
        contact? contact = await _context.GetContactById(cmd.ContactId, ct);

        if (cmd.Alias.Id == Guid.Empty)
            cmd.Alias.Id = null;

        await _context.CreateAlias(contact, _mapper.Map<spd_alias>(cmd.Alias), ct); 
        await _context.SaveChangesAsync(ct);

        return default;
    }

    public async Task DeleteAliasAsync(Guid aliasId, CancellationToken ct)
    {
        spd_alias? alias = _context.spd_aliases.Where(a =>
            a.spd_aliasid == aliasId &&
            a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
        ).FirstOrDefault();

        if (alias == null)
        {
            _logger.LogError($"Alias to be deleted was not found");
            throw new ArgumentException("cannot find alias to be deleted");
        }

        alias.statecode = DynamicsConstants.StateCode_Inactive;
        alias.statuscode = DynamicsConstants.StatusCode_Inactive;
        _context.UpdateObject(alias);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAliasAsync(UpdateAliasCommand cmd, CancellationToken ct)
    {
        foreach (Alias alias in cmd.Aliases)
        {
            spd_alias? existingAlias = _context.spd_aliases.Where(a =>
                a.spd_aliasid == alias.Id &&
                a.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
            ).FirstOrDefault();

            if (existingAlias == null)
            {
                _logger.LogError($"Alias to be updated was not found");
                throw new ArgumentException("cannot find alias to be updated");
            }

            existingAlias.spd_firstname = alias.GivenName;
            existingAlias.spd_surname = alias.Surname;
            existingAlias.spd_middlename1 = alias.MiddleName1;
            existingAlias.spd_middlename2 = alias.MiddleName2;
            _context.UpdateObject(existingAlias);
        }
        await _context.SaveChangesAsync(ct);
    }

    private async Task<ContactResp> UpdateContactAsync(UpdateContactCmd c, CancellationToken ct)
    {
        contact newContact = _mapper.Map<contact>(c);
        ContactResp resp = new();
        contact? existingContact = await _context.GetContactById(c.Id, ct);
        existingContact = await _context.UpdateContact(existingContact, newContact, null, _mapper.Map<IEnumerable<spd_alias>>(c.Aliases), ct);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<contact, ContactResp>(existingContact, resp);
    }

    private async Task<ContactResp> CreateContactAsync(CreateContactCmd c, CancellationToken ct)
    {
        contact contact = _mapper.Map<contact>(c);
        contact.spd_lastloggedinscreeningportal = null;
        contact.spd_lastloggedinlicensingportal = null;
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
        await _context.SaveChangesAsync(ct);
        ContactResp resp = _mapper.Map<ContactResp>(contact);
        return resp;
    }

    private async Task<ContactResp> TermAgreeAsync(TermAgreementCmd c, CancellationToken ct)
    {
        ContactResp resp = new();
        contact? existingContact = await _context.GetContactById(c.Id, ct);
        if (existingContact == null)
        {
            _logger.LogError($"no valid contact for {c.Id}");
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "not valid contact id.");
        }
        existingContact.spd_lastloggedinlicensingportal = DateTimeOffset.UtcNow;
        _context.UpdateObject(existingContact);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<contact, ContactResp>(existingContact, resp);
    }
}


