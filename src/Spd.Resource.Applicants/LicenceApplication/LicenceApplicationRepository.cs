using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.IdentityModel.Tokens;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.LicenceApplication;
internal class LicenceApplicationRepository : ILicenceApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicenceApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceApplicationId != null)
        {
            app = await _context.GetApplicationById((Guid)cmd.LicenceApplicationId, ct);
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveLicenceApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceApplicationId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        //create contact
        contact? contact;
        if (cmd.BcscGuid != null)//authenticated with 
        {
            contact = ProcessContactWithBcscApplicant(cmd);
        }
        else
        {
            //no authentication
            contact = AddContact(cmd);
        }
        // associate contact to application
        _context.SetLink(app, nameof(app.spd_ApplicantId_contact), contact);

        //create alias
        if (cmd.HasPreviousName != null && cmd.HasPreviousName.Value)
        {
            foreach (var item in cmd.Aliases)
            {
                AddAlias(item, contact);
            }
        }
        LinkServiceType(cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true) LinkExpiredLicence(cmd.ExpiredLicenceNumber, cmd.ExpiryDate, app);
        await _context.SaveChangesAsync();
        return new LicenceApplicationCmdResp(app.spd_applicationid);
    }

    public async Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        var app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_ApplicantId_contact)
            .Where(a => a.spd_applicationid == licenceApplicationId).SingleOrDefaultAsync(ct);
        if (app == null)
            throw new ArgumentException("invalid app id");

        return _mapper.Map<LicenceApplicationResp>(app);
    }

    private void LinkServiceType(WorkerLicenceTypeEnum? licenceType, spd_application app)
    {
        if (licenceType == null) throw new ArgumentException("invalid LicenceApplication type");
        spd_servicetype? servicetype = _context.LookupServiceType(licenceType.ToString());
        if (servicetype != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), servicetype);
        }
    }

    private void LinkExpiredLicence(string? expiredLicenceNumber, DateTimeOffset? expiryDate, spd_application app)
    {
        if (expiredLicenceNumber == null || expiryDate == null) return;
        var licence = _context.spd_licenses.Where(l => l.spd_licensenumber == expiredLicenceNumber
            && l.spd_licenceexpirydate == expiryDate.Value.Date)
            .FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicense), licence);
        }
    }

    private contact ProcessContactWithBcscApplicant(SaveLicenceApplicationCmd createApplicationCmd)
    {
        var identity = _context.spd_identities
               .Expand(i => i.spd_ContactId)
               .Where(i => i.spd_userguid == createApplicationCmd.BcscGuid)
               .Where(i => i.spd_type == (int)IdentityTypeOptionSet.BcServicesCard)
               .FirstOrDefault();
        if (identity == null)
        {
            identity = new spd_identity
            {
                spd_identityid = Guid.NewGuid(),
                spd_userguid = createApplicationCmd.BcscGuid,
                spd_type = (int)IdentityTypeOptionSet.BcServicesCard
            };
            _context.AddTospd_identities(identity);
            var contact = AddContact(createApplicationCmd);
            _context.SetLink(identity, nameof(identity.spd_ContactId), contact);
            return contact;
        }
        else
        {
            if (identity.spd_ContactId != null) //existing identity already connected with a contact
            {
                //if the same name
                var existingContact = identity.spd_ContactId;
                if (!(string.Equals(existingContact.firstname, createApplicationCmd.GivenName, StringComparison.InvariantCultureIgnoreCase)
                    && string.Equals(existingContact.lastname, createApplicationCmd.Surname, StringComparison.InvariantCultureIgnoreCase)))
                {
                    //if the contact first name and lastname is different. make existing one to be alias and add the new one.
                    Alias newAlias = new Alias
                    {
                        Surname = existingContact.lastname,
                        GivenName = existingContact.firstname,
                    };
                    AddAlias(newAlias, existingContact);
                }
                _mapper.Map<SaveLicenceApplicationCmd, contact>(createApplicationCmd, existingContact);
                _context.UpdateObject(existingContact);
                return existingContact;
            }
            else
            {
                var contact = AddContact(createApplicationCmd);
                _context.SetLink(identity, nameof(identity.spd_ContactId), contact);
                return contact;
            }
        }
    }

    private contact AddContact(SaveLicenceApplicationCmd createApplicationCmd)
    {
        var contact = GetContact(createApplicationCmd);
        // if not found, create new contact
        if (contact == null)
        {
            contact = _mapper.Map<contact>(createApplicationCmd);
            contact.contactid = Guid.NewGuid();
            _context.AddTocontacts(contact);
        }
        else
        {
            //update existing one
            _mapper.Map<SaveLicenceApplicationCmd, contact>(createApplicationCmd, contact);
            _context.UpdateObject(contact);
        }
        return contact;
    }

    private void AddAlias(Alias createAliasCmd, contact contact)
    {
        spd_alias? matchingAlias = GetAlias(createAliasCmd, contact);
        // if not found, create new alias
        if (matchingAlias == null)
        {
            spd_alias alias = _mapper.Map<spd_alias>(createAliasCmd);
            _context.AddTospd_aliases(alias);
            // associate alias to contact
            _context.SetLink(alias, nameof(alias.spd_ContactId), contact);
        }
    }

    private contact? GetContact(SaveLicenceApplicationCmd createApplicationCmd)
    {
        if (createApplicationCmd.DateOfBirth == null)
            throw new ArgumentException("dateofBirth cannot be null");

        var contacts = _context.contacts
            .Where(o =>
            o.firstname == createApplicationCmd.GivenName &&
            o.lastname == createApplicationCmd.Surname &&
            o.birthdate == new Microsoft.OData.Edm.Date(createApplicationCmd.DateOfBirth.Year, createApplicationCmd.DateOfBirth.Month, createApplicationCmd.DateOfBirth.Day) &&
            o.statecode != DynamicsConstants.StateCode_Inactive);

        var list = contacts.ToList();
        if (createApplicationCmd.BcDriversLicenceNumber == null || createApplicationCmd.BcDriversLicenceNumber.IsNullOrEmpty())
        {
            return contacts.FirstOrDefault();
        }
        else
        {
            contacts = contacts
            .Where(o => o.spd_bcdriverslicense == null || o.spd_bcdriverslicense == createApplicationCmd.BcDriversLicenceNumber);
            return contacts.FirstOrDefault();
        }
    }

    private spd_alias? GetAlias(Alias aliasCreateCmd, contact contact)
    {
        var matchingAlias = _context.spd_aliases.Where(o =>
           o.spd_firstname == aliasCreateCmd.GivenName &&
           o.spd_middlename1 == aliasCreateCmd.MiddleName1 &&
           o.spd_middlename2 == aliasCreateCmd.MiddleName2 &&
           o.spd_surname == aliasCreateCmd.Surname &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o._spd_contactid_value == contact.contactid
       ).FirstOrDefault();
        return matchingAlias;
    }
}
