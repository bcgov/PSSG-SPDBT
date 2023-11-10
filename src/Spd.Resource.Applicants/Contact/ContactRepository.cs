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
        spd_identity? identity = null;
        if (c.FirstName != null) contact.firstname = c.FirstName;
        if (c.LastName != null) contact.lastname = c.LastName;
        if (c.EmailAddress != null) contact.emailaddress1 = c.EmailAddress;
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
        if (identity != null)
            _context.AddLink(contact, nameof(contact.spd_contact_spd_identity), identity);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<ContactResp>(contact);
    }
}


