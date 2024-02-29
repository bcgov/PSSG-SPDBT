using AutoMapper;
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
            TermAgreementCmd c => await TermAgreeAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
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
        if(existingContact == null)
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


