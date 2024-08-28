using System.Security.Claims;

namespace Spd.Utilities.LogonUser;

public static class ClaimsPrincipleExtension
{
    public static void UpdateUserClaims(this ClaimsPrincipal claimsPrincipal, string userId, string orgId, string? role, bool? isPSA = null)
    {
        AddUpdateClaim(claimsPrincipal, IPrincipalExtensions.SPD_USERID, userId);
        AddUpdateClaim(claimsPrincipal, IPrincipalExtensions.SPD_ORGID, orgId);
        if (role != null)
            AddUpdateClaim(claimsPrincipal, ClaimTypes.Role, role);
        if (isPSA != null)
            AddUpdateClaim(claimsPrincipal, IPrincipalExtensions.SPD_IDIR_IsPSA, isPSA.ToString()!);
    }

    public static void AddUpdateClaim(this ClaimsPrincipal claimsPrincipal, string key, string value)
    {
        var identity = claimsPrincipal.Identity as ClaimsIdentity;
        if (identity == null)
            return;

        // check for existing claim and remove it
        var existingClaim = identity.FindFirst(key);
        if (existingClaim != null)
            identity.RemoveClaim(existingClaim);

        // add new claim
        identity.AddClaim(new Claim(key, value));
    }

    public static T? GetClaimValue<T>(this ClaimsPrincipal claimsPrincipal, string key) => (T?)GetClaimValue(claimsPrincipal, typeof(T), key);

    private static object? GetClaimValue(this ClaimsPrincipal claimsPrincipal, Type type, string key)
        => type switch
        {
            Type t when t == typeof(string) => claimsPrincipal.FindFirstValue(key),
            Type t when t == typeof(int) => int.TryParse(claimsPrincipal.FindFirstValue(key), out int value) ? value : default,
            Type t when t == typeof(bool) => bool.TryParse(claimsPrincipal.FindFirstValue(key), out bool value) && value,
            Type t when t == typeof(Guid) => Guid.TryParse(claimsPrincipal.FindFirstValue(key), out Guid value) ? value : null,
            _ => default
        };
}