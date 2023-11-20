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
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId).FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveLicenceApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
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
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null) LinkExpiredLicence(cmd.ExpiredLicenceId, app);
        await _context.SaveChangesAsync();
        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        ProcessCategories(cmd.CategoryData, app);
        await _context.SaveChangesAsync();
        return new LicenceApplicationCmdResp(app.spd_applicationid);
    }

    public async Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        var app = await _context.spd_applications.Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_ApplicantId_contact)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_CurrentExpiredLicenceId)
            .Where(a => a.spd_applicationid == licenceApplicationId).SingleOrDefaultAsync(ct);
        if (app == null)
            throw new ArgumentException("invalid app id");

        return _mapper.Map<LicenceApplicationResp>(app);
    }

    public async Task<IEnumerable<LicenceAppListResp>> QueryAsync(LicenceAppQuery qry, CancellationToken cancellationToken)
    {
        IQueryable<spd_application> apps = _context.spd_applications.Expand(a => a.spd_ServiceTypeId);
        apps = apps.Where(a => a._spd_applicantid_value == qry.ApplicantId);
        var applist = apps.ToList();

        if (qry.ValidWorkerLicenceTypeCodes != null && qry.ValidWorkerLicenceTypeCodes.Any())
        {
            List<Guid?> serviceTypeGuid = qry.ValidWorkerLicenceTypeCodes.Select(c => _context.LookupServiceType(c.ToString()).spd_servicetypeid).ToList();
            applist = applist.Where(a => serviceTypeGuid.Contains(a._spd_servicetypeid_value)).ToList();
        }

        if(qry.ValidPortalStatus != null && qry.ValidPortalStatus.Any())
        {
            List<int> portalStatusInt = qry.ValidPortalStatus.Select(s => (int)Enum.Parse<ApplicationPortalStatus>(s.ToString())).ToList();
            applist = applist.Where(a => portalStatusInt.Contains((int)a.spd_portalstatus)).ToList();
        }
        return _mapper.Map<IList<LicenceAppListResp>>(applist);

    }

    private void ProcessCategories(WorkerLicenceAppCategory[] categories, spd_application app)
    {
        foreach (var c in categories)
        {
            var cat = _context.LookupLicenceCategory(c.WorkerCategoryTypeCode.ToString());
            if (cat != null && !app.spd_application_spd_licencecategory.Any(c => c.spd_licencecategoryid == cat.spd_licencecategoryid))
            {
                _context.AddLink(app, nameof(spd_application.spd_application_spd_licencecategory), cat);
            }
        }
        foreach (var appCategory in app.spd_application_spd_licencecategory)
        {
            var code = DynamicsContextLookupHelpers.LookupLicenceCategoryKey(appCategory.spd_licencecategoryid);
            //if categories do not contain cat
            if (!categories.Any(c => c.WorkerCategoryTypeCode.ToString() == code))
            {
                _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
            }
        }
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

    private void LinkExpiredLicence(Guid? expiredLicenceId, spd_application app)
    {
        if (expiredLicenceId == null) return;
        var licence = _context.spd_licences.Where(l => l.spd_licenceid == expiredLicenceId).FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicenceId), licence);
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
            o.birthdate == new Microsoft.OData.Edm.Date(createApplicationCmd.DateOfBirth.Value.Year, createApplicationCmd.DateOfBirth.Value.Month, createApplicationCmd.DateOfBirth.Value.Day) &&
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
