using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Utilities.LogonUser
{
    public static class IPrincipalExtensions
    {
        public static readonly string BCeID_IDENTITY_PROVIDER = "bceidboth";
        public static readonly string BCeID_USERNAME = "bceid_username";
        public static readonly string BCeID_USERGUID = "bceid_user_guid";
        public static bool IfUserAuthenticated(this IPrincipal principal)
        {
            var claimPrincipal = ValidatePrincipal(principal);
            return claimPrincipal.Identity?.IsAuthenticated ?? false;
        }

        public static string GetUserName(this IPrincipal principal)
        {
            if(principal.GetIdentityProvider() == BCeID_IDENTITY_PROVIDER)
                return ValidatePrincipal(principal).GetClaimValue(BCeID_USERNAME);
            return null;
        }

        public static string GetUserFirstName(this IPrincipal principal)
        {
            return ValidatePrincipal(principal).GetClaimValue(ClaimTypes.GivenName);
        }

        public static string GetUserLastName(this IPrincipal principal)
        {
            return ValidatePrincipal(principal).GetClaimValue(ClaimTypes.Surname);
        }

        public static string GetUserEmail(this IPrincipal principal)
        {
            return ValidatePrincipal(principal).GetClaimValue(ClaimTypes.Email);
        }

        public static Guid GetUserGuid(this IPrincipal principal)
        {
            if (principal.GetIdentityProvider() == BCeID_IDENTITY_PROVIDER)
            {
                var claim = ValidatePrincipal(principal).GetClaimValue(BCeID_USERGUID);
                return claim == null ? Guid.Empty : Guid.Parse(claim);
            }
            return Guid.Empty;
        }

        public static string GetIdentityProvider(this IPrincipal principal)
        {
            var cmsUserClaim = ValidatePrincipal(principal).GetClaimValue("identity_provider");
            return cmsUserClaim == null ? Guid.Empty.ToString() : cmsUserClaim;
        }

        private static ClaimsPrincipal ValidatePrincipal(IPrincipal principal)
        {
            if (principal is not ClaimsPrincipal)
                throw new ArgumentNullException(nameof(principal));

            return (ClaimsPrincipal)principal;
        }

        private static string GetClaimValue(this ClaimsPrincipal claimsPrincipal, string key)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            var claim = identity.Claims.FirstOrDefault(c => c.Type == key);
            return claim?.Value;
        }
    }
}
