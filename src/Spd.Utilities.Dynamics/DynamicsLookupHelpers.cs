using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Cache;

namespace Spd.Utilities.Dynamics
{
    public interface IDynamicsLookupHelpers
    {
        public Task<spd_organizationtype?> LookupOrganizationType(DynamicsContext context, string key);
        public spd_role? LookupRole(DynamicsContext context, string key);
        public bcgov_tag? LookupTag(DynamicsContext context, string key);
        public Task<spd_servicetype?> LookupServiceType(DynamicsContext context, string? key);
        public spd_licencecategory? LookupLicenceCategory(DynamicsContext context, string? key);
    }
    public class DynamicsLookupHelpers : IDynamicsLookupHelpers
    {
        private readonly IDistributedCache cache;
        public DynamicsLookupHelpers(IDistributedCache cache)
        {
            this.cache = cache;
        }
        #region organization type
        public async Task<spd_organizationtype?> LookupOrganizationType(DynamicsContext context, string key)
        {
            var keyExisted = DynamicsContextLookupHelpers.OrganizationTypeGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            IEnumerable<spd_organizationtype>? organizationtypes = await cache.Get<IEnumerable<spd_organizationtype>>("spd_organizationtypes");
            if (organizationtypes == null)
            {
                organizationtypes = context.spd_organizationtypes.ToList();
                await cache.Set<IEnumerable<spd_organizationtype>>("spd_organizationtypes", organizationtypes, new TimeSpan(1, 0, 0));
            }
            return organizationtypes
                .Where(s => s.spd_organizationtypeid == guid)
                .FirstOrDefault();
        }
        #endregion

        #region role
        public spd_role? LookupRole(DynamicsContext context, string key)
        {
            var keyExisted = DynamicsContextLookupHelpers.RoleGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_roles
                .Where(s => s.spd_roleid == guid)
                .FirstOrDefault();
        }
        #endregion

        #region file tag
        public bcgov_tag? LookupTag(DynamicsContext context, string key)
        {
            var keyExisted = DynamicsContextLookupHelpers.BcGovTagDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.bcgov_tags
                .Where(s => s.bcgov_tagid == guid)
                .FirstOrDefault();
        }
        #endregion

        #region service type
        public async Task<spd_servicetype?> LookupServiceType(DynamicsContext context, string? key)
        {
            if (key == null) return null;
            var keyExisted = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            IEnumerable<spd_servicetype>? servicetypes = await cache.Get<IEnumerable<spd_servicetype>>("spd_servicetypes");
            if (servicetypes == null)
            {
                servicetypes = context.spd_servicetypes.ToList();
                await cache.Set<IEnumerable<spd_servicetype>>("spd_servicetypes", servicetypes, new TimeSpan(1, 0, 0));
            }
            return servicetypes
                .Where(s => s.spd_servicetypeid == guid)
                .Where(s => s.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefault();
        }
        #endregion

        #region worker licence category
        public spd_licencecategory? LookupLicenceCategory(DynamicsContext context, string? key)
        {
            if (key == null) return null;
            var keyExisted = DynamicsContextLookupHelpers.LicenceCategoryDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_licencecategories
                .Where(s => s.spd_licencecategoryid == guid)
                .Where(s => s.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefault();
        }
        #endregion
    }
}
