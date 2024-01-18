using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Applicants.Contact;
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
        IQueryable<contact> contacts = _context.contacts;

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
        contact contact = await _context.GetContactById(c.Id, ct);
        contact newContact = _mapper.Map<contact>(c);
        //when we found name is different than current one, need to put current one to alias.
        if (!NameIsSame(contact, newContact))
        {
            //put old name to alias

            //update current contact
            _mapper.Map(c, contact);
        }
        //todo: when we found address is different, need to put current address to previous address.
        contact.spd_middlename2 = null;
        _context.UpdateObject(contact);
        await _context.SaveChangesAsync();
        return _mapper.Map<ContactResp>(contact);
    }

    private async Task<ContactResp> CreateContactAsync(CreateContactCmd c, CancellationToken ct)
    {
        contact contact = _mapper.Map<contact>(c);
        _context.AddTocontacts(contact);
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
        await _context.SaveChangesAsync(ct);
        if (identity != null)
            _context.AddLink(contact, nameof(contact.spd_contact_spd_identity), identity);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<ContactResp>(contact);
    }

    private bool NameIsSame(contact original, contact newContact)
    {
        return (original.firstname == newContact.firstname
            && original.lastname == newContact.lastname
            && original.spd_middlename1 == newContact.spd_middlename1
            && original.spd_middlename2 == newContact.spd_middlename2);

    }
}


