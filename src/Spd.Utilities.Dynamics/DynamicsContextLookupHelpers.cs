using Microsoft.Dynamics.CRM;

namespace Spd.Utilities.Dynamics
{
    public static class DynamicsContextLookupHelpers
    {
        public static spd_organizationtype? LookupOrganizationType(this DynamicsContext context, int orgCategory, string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return null;
            return context.spd_organizationtypes
                .Where(s => s.spd_organizationcategory == orgCategory && s.spd_name == name)
                .FirstOrDefault();
        }
    }
}
