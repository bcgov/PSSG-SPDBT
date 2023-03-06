using Microsoft.Dynamics.CRM;

namespace Spd.Utilities.Dynamics
{
    public static class DynamicsContextLookupHelpers
    {
        public static Spd_organizationtype? LookupOrganizationType(this DynamicsContext context, int orgCategory, string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return null;
            return context.Spd_organizationtypes
                .Where(s => s.Spd_organizationcategory == orgCategory && s.Spd_name == name)
                .FirstOrDefault();
        }
    }
}
