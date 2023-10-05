using System.Globalization;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Utilities.LogonUser
{
    public static class IPrincipalExtensions
    {
        public static readonly string[] BCeID_IDENTITY_PROVIDERS = { "bceidboth", "bceidbusiness" };
        public static readonly string IDIR_IDENTITY_PROVIDER = "idir";
        public static readonly string BCeID_USER_NAME = "bceid_username";
        public static readonly string BCeID_DISPLAY_USER_NAME = "display_name";
        public static readonly string BCeID_USER_GUID = "bceid_user_guid";
        public static readonly string BCeID_BUSINESS_NAME = "bceid_business_name";
        public static readonly string BCeID_BUSINESS_GUID = "bceid_business_guid";
        public static readonly string IDENTITY_PROVIDER = "identity_provider";
        public static readonly string SPD_USERID = "spd_userid";
        public static readonly string SPD_ORGID = "spd_orgid";
        public static readonly string ISSUER = "iss";
        public static readonly string SUB = "sub";
        public static bool IsAuthenticated(this IPrincipal principal)
        {
            var claimPrincipal = ValidatePrincipal(principal);
            return claimPrincipal.Identity?.IsAuthenticated ?? false;
        }

        public static string? GetIssuer(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ISSUER);
        public static string? GetUserId(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(SPD_USERID);
        public static bool IsPSA(this IPrincipal principal) => false;
        public static string? GetUserRole(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue(ClaimTypes.Role);

        public static BcscIdentityInfo GetBcscUserIdentityInfo(this IPrincipal principal)
        {
            var claim = ValidatePrincipal(principal);
            var middleName = GetMiddleNames(claim.GetClaimValue("given_names"), claim.GetClaimValue("given_name"));
            string? birthDateStr = claim.GetClaimValue("birthdate");
            if (birthDateStr == null)
                throw new ArgumentNullException("principal.birthdate");
            DateOnly birthDate = DateOnly.ParseExact(birthDateStr, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            string? sub = claim.GetClaimValue("sub");
            if (sub == null)
                throw new ArgumentNullException("principal.sub");

            return new BcscIdentityInfo()
            {
                Issuer = claim.GetClaimValue("iss"),
                BirthDate = birthDate,
                Age = claim.GetClaimValue("age"),
                DisplayName = claim.GetClaimValue("display_name"),
                Email = claim.GetClaimValue("email"),
                FirstName = claim.GetClaimValue("given_name"),
                LastName = claim.GetClaimValue("family_name"),
                Gender = claim.GetClaimValue("gender"),
                Sub = sub,
                EmailVerified = claim.GetClaimValue("email_verified") == null ? null : bool.Parse(claim.GetClaimValue("email_verified")),
                MiddleName1 = middleName.Item1,
                MiddleName2 = middleName.Item2,
            };
        }

        public static BceidIdentityInfo GetBceidUserIdentityInfo(this IPrincipal principal)
        {
            var claim = ValidatePrincipal(principal);
            return new BceidIdentityInfo()
            {
                DisplayName = claim.GetClaimValue("display_name"),
                Email = claim.GetClaimValue("email"),
                FirstName = claim.GetClaimValue("given_name"),
                LastName = claim.GetClaimValue("family_name"),
                PreferredUserName = claim.GetClaimValue("preferred_username"),
                BCeIDUserName = claim.GetClaimValue("bceid_username"),
                UserGuid = claim.GetClaimValue("bceid_user_guid") == null ? Guid.Empty : Guid.Parse(claim.GetClaimValue("bceid_user_guid")),
                EmailVerified = claim.GetClaimValue("email_verified") == null ? null : Boolean.Parse(claim.GetClaimValue("email_verified")),
                BizGuid = claim.GetClaimValue("bceid_business_guid") == null ? Guid.Empty : Guid.Parse(claim.GetClaimValue("bceid_business_guid")),
                BizName = claim.GetClaimValue("bceid_business_name"),
                Issuer = claim.GetClaimValue("iss"),
            };
        }

        public static IdirUserIdentityInfo GetIdirUserIdentityInfo(this IPrincipal principal)
        {
            var claim = ValidatePrincipal(principal);
            return new IdirUserIdentityInfo()
            {
                DisplayName = claim.GetClaimValue("display_name"),
                Email = claim.GetClaimValue(ClaimTypes.Email),
                FirstName = claim.GetClaimValue(ClaimTypes.GivenName),
                LastName = claim.GetClaimValue(ClaimTypes.Surname),
                PreferredUserName = claim.GetClaimValue("preferred_username"),
                UserGuid = claim.GetClaimValue("idir_user_guid"),
                EmailVerified = claim.GetClaimValue("email_verified") == null ? null : Boolean.Parse(claim.GetClaimValue("email_verified")),
                Issuer = claim.GetClaimValue("iss"),
                IdirUserName = claim.GetClaimValue("idir_username")
            };
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

        private static (string?, string?) GetMiddleNames(string? givenNames, string? firstName)
        {
            if (givenNames != null)
            {
                if (firstName == null) firstName = string.Empty;
                string str = givenNames.Replace(firstName, string.Empty).Trim();
                var strs = str.Split(' ');
                return (strs.Length > 0 ? strs[0] : null, strs.Length > 1 ? strs[1] : null);
            }
            return (null, null);
        }
    }
}
