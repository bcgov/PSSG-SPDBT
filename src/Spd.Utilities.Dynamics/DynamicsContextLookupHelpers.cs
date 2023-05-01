using Microsoft.Dynamics.CRM;

namespace Spd.Utilities.Dynamics
{
    public static class DynamicsContextLookupHelpers
    {
        public static Dictionary<string, Guid> OrganizationTypeGuidDictionary = new Dictionary<string, Guid>()
        {
            {"Volunteer-NonProfit", Guid.Parse("c2cc6851-56b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Childcare", Guid.Parse("1b4dbc58-56b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Healthcare", Guid.Parse("b4dc3164-56b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Education", Guid.Parse("5c7ff643-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-ProvFunded", Guid.Parse("93f5c34f-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-CrownCorp", Guid.Parse("1ec4a858-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-ProvGovt", Guid.Parse("ce908e5f-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Registrant", Guid.Parse("e93ee56f-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-Municipality", Guid.Parse("7a7a0b99-59b8-ed11-b83e-00505683fbf4")},
            {"Volunteer-PostSec", Guid.Parse("30b68faf-59b8-ed11-b83e-00505683fbf4")},
            {"Employee-Childcare", Guid.Parse("d2ebf78b-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Healthcare", Guid.Parse("4ba37d93-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Education", Guid.Parse("e6ee8aa9-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Funding", Guid.Parse("054ea3b0-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-CrownCorp", Guid.Parse("b48933b8-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-ProvGovt", Guid.Parse("b30335c1-5ab8-ed11-b83e-00505683fbf4")},
            {"Employee-Registrant", Guid.Parse("489d1f0a-5bb8-ed11-b83e-00505683fbf4")},
            {"Employee-GovnBody", Guid.Parse("fcaa5d11-5bb8-ed11-b83e-00505683fbf4")},
            {"Employee-Appointed", Guid.Parse("61b9301b-5bb8-ed11-b83e-00505683fbf4")},
        };
        public static spd_organizationtype? LookupOrganizationType(this DynamicsContext context, string key)
        {
            var keyExisted = OrganizationTypeGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_organizationtypes
                .Where(s => s.spd_organizationtypeid == guid)
                .FirstOrDefault();
        }

        public static Dictionary<string, Guid> RoleGuidDictionary = new Dictionary<string, Guid>()
        {
            {"Contact", Guid.Parse("47ca4197-12ba-ed11-b83e-00505683fbf4")},
            {"Primary", Guid.Parse("99af5c0a-a1c2-ed11-b840-00505683fbf4")},
        };
        public static spd_role? LookupRole(this DynamicsContext context, string key)
        {
            var keyExisted = RoleGuidDictionary.TryGetValue(key, out Guid guid);
            if (!keyExisted) return null;
            return context.spd_roles
                .Where(s => s.spd_roleid == guid)
                .FirstOrDefault();
        }

        public static string LookupRoleKeyById(this DynamicsContext context, Guid value)
        {
            return RoleGuidDictionary.FirstOrDefault(x => x.Value == value).Key;
        }
        public static async Task<spd_portaluser?> GetUserById(this DynamicsContext context, Guid userId, CancellationToken ct)
            => await context.spd_portalusers.Where(a => a.spd_portaluserid == userId).SingleOrDefaultAsync(ct);

        public static async Task<account?> GetOrgById(this DynamicsContext context, Guid organizationId, CancellationToken ct)
           => await context.accounts.Where(a => a.accountid == organizationId).SingleOrDefaultAsync(ct);
    }
}
