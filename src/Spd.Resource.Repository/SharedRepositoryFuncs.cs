using Microsoft.Dynamics.CRM;
using Polly;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository;
internal static class SharedRepositoryFuncs
{
    public static void ProcessCategories(DynamicsContext _context, IEnumerable<WorkerCategoryTypeEnum> categories, spd_application app)
    {
        foreach (var c in categories)
        {
            var cat = _context.LookupLicenceCategory(c.ToString());
            if (cat == null)
                throw new ArgumentException($"licence category not found for {c.ToString()}");

            if (!app.spd_application_spd_licencecategory.Any(c => c.spd_licencecategoryid == cat.spd_licencecategoryid))
            {
                _context.AddLink(app, nameof(spd_application.spd_application_spd_licencecategory), cat);
            }
        }
        foreach (var appCategory in app.spd_application_spd_licencecategory)
        {
            var code = DynamicsContextLookupHelpers.LookupLicenceCategoryKey(appCategory.spd_licencecategoryid);
            //if categories do not contain cat
            if (!categories.Any(c => c.ToString() == code))
            {
                _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licencecategory), appCategory);
            }
        }
    }

    public static void LinkServiceType(DynamicsContext _context, ServiceTypeEnum? licenceType, spd_application app)
    {
        if (licenceType == null) throw new ArgumentException("invalid LicenceApplication type");
        spd_servicetype? servicetype = _context.LookupServiceType(licenceType.ToString());
        if (servicetype != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), servicetype);
        }
    }

    public static void LinkLicence(DynamicsContext _context, Guid? licenceId, spd_application app)
    {
        if (licenceId == null) return;
        var licence = _context.spd_licences.Where(l => l.spd_licenceid == licenceId).FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicenceId), licence);
        }
    }
    public static void LinkTeam(DynamicsContext _context, string teamGuidStr, spd_application app)
    {
        Guid teamGuid = Guid.Parse(teamGuidStr);
        team? serviceTeam = _context.teams.Where(t => t.teamid == teamGuid).FirstOrDefault();
        _context.SetLink(app, nameof(spd_application.ownerid), serviceTeam);
    }

    public static List<spd_alias>? GetAliases(Guid contactId, DynamicsContext _context)
    {
        var matchingAliases = _context.spd_aliases.Where(o =>
           o._spd_contactid_value == contactId &&
           o.statecode != DynamicsConstants.StateCode_Inactive &&
           o.spd_source == (int)AliasSourceTypeOptionSet.UserEntered
       ).ToList();
        return matchingAliases;
    }
    public static contact? GetDuplicateContact(DynamicsContext context, contact contact, CancellationToken ct)
    {
        var query = context.contacts.Where(x => x.birthdate == contact.birthdate);
        if (!string.IsNullOrEmpty(contact.spd_bcdriverslicense))
            query = query.Where(a => a.spd_bcdriverslicense == contact.spd_bcdriverslicense);

        return query.ToList().Where(a => string.Equals(a.firstname, contact.firstname, StringComparison.OrdinalIgnoreCase) &&
                        string.Equals(a.lastname, contact.lastname, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
    }
    public static contact? GetLicenceHolderContact(DynamicsContext context, Guid expiredLicenceId)
    {
        return context.spd_licences
            .Expand(l => l.spd_LicenceHolder_contact)
            .Where(l => l.spd_licenceid == expiredLicenceId)
            .FirstOrDefault()?.spd_LicenceHolder_contact;
    }
}