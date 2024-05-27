using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository;
internal static class SharedRepositoryFuncs
{
    public static void ProcessCategories(DynamicsContext _context, IEnumerable<WorkerCategoryTypeEnum> categories, spd_application app)
    {
        foreach (var c in categories)
        {
            var cat = _context.LookupLicenceCategory(c.ToString());
            if (cat != null && !app.spd_application_spd_licencecategory.Any(c => c.spd_licencecategoryid == cat.spd_licencecategoryid))
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

    public static void LinkServiceType(DynamicsContext _context, WorkerLicenceTypeEnum? licenceType, spd_application app)
    {
        if (licenceType == null) throw new ArgumentException("invalid LicenceApplication type");
        spd_servicetype? servicetype = _context.LookupServiceType(licenceType.ToString());
        if (servicetype != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), servicetype);
        }
    }

    public static void LinkExpiredLicence(DynamicsContext _context, Guid? expiredLicenceId, spd_application app)
    {
        if (expiredLicenceId == null) return;
        var licence = _context.spd_licences.Where(l => l.spd_licenceid == expiredLicenceId).FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicenceId), licence);
        }
    }
}
