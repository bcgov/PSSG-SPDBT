using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Utilities.LogonUser
{
    public static class IPrincipalExtensions
    {
        public static readonly string[] BCeID_IDENTITY_PROVIDERS = { "bceidboth", "bceidbusiness", "bceidbasic" };
        public static readonly string BCeID_USER_NAME = "bceid_username";
        public static readonly string BCeID_DISPLAY_USER_NAME = "display_name";
        public static readonly string BCeID_USER_GUID = "bceid_user_guid";
        public static readonly string BCeID_BUSINESS_NAME = "bceid_business_name";
        public static readonly string BCeID_BUSINESS_GUID = "bceid_business_guid";
        public static readonly string IDENTITY_PROVIDER = "identity_provider";
        public static readonly string SPD_USERID = "spd_userid";
        public static readonly string SPD_ORGID = "spd_orgid";
        public static readonly string ISSUER = "iss";
        public static bool IsAuthenticated(this IPrincipal principal)
        {
            var claimPrincipal = ValidatePrincipal(principal);
            return claimPrincipal.Identity?.IsAuthenticated ?? false;
        }

        public static string? GetIssuer(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ISSUER);

        public static string? GetUserName(this IPrincipal principal)
        {
            if (BCeID_IDENTITY_PROVIDERS.Contains(principal.GetIdentityProvider()))
                return ValidatePrincipal(principal).GetClaimValue(BCeID_USER_NAME);
            return null;
        }

        public static string? GetUserDisplayName(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(BCeID_DISPLAY_USER_NAME);

        public static string? GetUserFirstName(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ClaimTypes.GivenName);

        public static string? GetUserLastName(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ClaimTypes.Surname);

        public static string? GetUserEmail(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ClaimTypes.Email);

        public static Guid GetUserGuid(this IPrincipal principal)
        {
            if (BCeID_IDENTITY_PROVIDERS.Contains(principal.GetIdentityProvider()))
            {
                var claim = ValidatePrincipal(principal).GetClaimValue(BCeID_USER_GUID);
                return claim == null ? Guid.Empty : Guid.Parse(claim);
            }
            return Guid.Empty;
        }

        public static string? GetUserId(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(SPD_USERID);

        public static string? GetOrgId(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(SPD_ORGID);

        public static string? GetUserRole(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ClaimTypes.Role);

        public static string? GetBizName(this IPrincipal principal)
        {
            if (BCeID_IDENTITY_PROVIDERS.Contains(principal.GetIdentityProvider()))
            {
                var claim = ValidatePrincipal(principal).GetClaimValue(BCeID_BUSINESS_NAME);
                return claim;
            }
            return null;
        }

        public static Guid GetBizGuid(this IPrincipal principal)
        {
            if (BCeID_IDENTITY_PROVIDERS.Contains(principal.GetIdentityProvider()))
            {
                var claim = ValidatePrincipal(principal).GetClaimValue(BCeID_BUSINESS_GUID);
                return claim == null ? Guid.Empty : Guid.Parse(claim);
            }
            return Guid.Empty;
        }
        public static string? GetIdentityProvider(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(IDENTITY_PROVIDER);


        private static ClaimsPrincipal ValidatePrincipal(IPrincipal principal)
        {
            if (principal is not ClaimsPrincipal)
                throw new ArgumentNullException(nameof(principal));

            return (ClaimsPrincipal)principal;
        }

        private static string? GetClaimValue(this ClaimsPrincipal claimsPrincipal, string key)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            var claim = identity.Claims.FirstOrDefault(c => c.Type == key);
            return claim?.Value;
        }
    }
}
