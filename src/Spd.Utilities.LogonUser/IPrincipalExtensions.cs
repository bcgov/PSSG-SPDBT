using System.Globalization;
using System.Security.Claims;
using System.Security.Principal;

namespace Spd.Utilities.LogonUser
{
    public static class IPrincipalExtensions
    {
#pragma warning disable CA1707 // Identifiers should not contain underscores
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
        public static readonly string SPD_IDIR_IsPSA = "SPD_IDIR_IsPSA";
        public static readonly string BCeID_GIVEN_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        public static readonly string BCeID_SUR_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
        public static readonly string BCeID_Email = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
#pragma warning restore CA1707 // Identifiers should not contain underscores

        public static bool IsAuthenticated(this IPrincipal principal)
        {
            var claimPrincipal = ValidatePrincipal(principal);
            return claimPrincipal.Identity?.IsAuthenticated ?? false;
        }

        public static string? GetIssuer(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue<string>(ISSUER);

        public static string? GetUserId(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue<string>(SPD_USERID);

        public static bool IsPSA(this IPrincipal principal) =>
            ValidatePrincipal(principal).GetClaimValue<bool>(SPD_IDIR_IsPSA);

        public static string? GetUserRole(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue<string>(ClaimTypes.Role);

        public static BcscIdentityInfo GetBcscUserIdentityInfo(this IPrincipal principal)
        {
            var claim = ValidatePrincipal(principal);
            var middleName = GetMiddleNames(claim.GetClaimValue<string>("given_names"), claim.GetClaimValue<string>("given_name"));
            string? birthDateStr = claim.GetClaimValue<string>("birthdate");
            if (birthDateStr == null)
                throw new ArgumentNullException("principal.birthdate");
            DateOnly birthDate = DateOnly.ParseExact(birthDateStr, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            string? sub = claim.GetClaimValue<string>("sub");
            if (sub == null)
                throw new ArgumentNullException("principal.sub");

            return new BcscIdentityInfo()
            {
                Issuer = claim.GetClaimValue<string>("iss"),
                BirthDate = birthDate,
                Age = claim.GetClaimValue<string>("age"),
                DisplayName = claim.GetClaimValue<string>("display_name"),
                Email = claim.GetClaimValue<string>("email"),
                FirstName = claim.GetClaimValue<string>("given_name"),
                LastName = claim.GetClaimValue<string>("family_name"),
                Gender = claim.GetClaimValue<string>("gender"),
                Address = claim.GetClaimValue<string>("address"),
                Sub = sub,
                EmailVerified = claim.GetClaimValue<bool>("email_verified"),
                MiddleName1 = middleName.Item1,
                MiddleName2 = middleName.Item2,
            };
        }

        public static BceidIdentityInfo GetBceidUserIdentityInfo(this IPrincipal principal)
        {
            var claim = ValidatePrincipal(principal);
            return new BceidIdentityInfo()
            {
                DisplayName = claim.GetClaimValue<string>("display_name"),
                Email = claim.GetClaimValue<string>(BCeID_Email),
                FirstName = claim.GetClaimValue<string>(BCeID_GIVEN_NAME),
                LastName = claim.GetClaimValue<string>(BCeID_SUR_NAME),
                PreferredUserName = claim.GetClaimValue<string>("preferred_username"),
                BCeIDUserName = claim.GetClaimValue<string>("bceid_username"),
                UserGuid = claim.GetClaimValue<Guid?>("bceid_user_guid"),
                EmailVerified = claim.GetClaimValue<bool>("email_verified"),
                BizGuid = claim.GetClaimValue<Guid?>("bceid_business_guid"),
                BizName = claim.GetClaimValue<string>("bceid_business_name"),
                Issuer = claim.GetClaimValue<string>("iss"),
            };
        }

        public static IdirUserIdentityInfo GetIdirUserIdentityInfo(this IPrincipal principal)
        {
            var cp = ValidatePrincipal(principal);
            return new IdirUserIdentityInfo()
            {
                DisplayName = cp.GetClaimValue<string>("display_name"),
                Email = cp.GetClaimValue<string>(ClaimTypes.Email),
                FirstName = cp.GetClaimValue<string>(ClaimTypes.GivenName),
                LastName = cp.GetClaimValue<string>(ClaimTypes.Surname),
                PreferredUserName = cp.GetClaimValue<string>("preferred_username"),
                UserGuid = cp.GetClaimValue<string>("idir_user_guid"),
                EmailVerified = cp.GetClaimValue<bool>("email_verified"),
                Issuer = cp.GetClaimValue<string>("iss"),
                IdirUserName = cp.GetClaimValue<string>("idir_username")
            };
        }

        public static string? GetIdentityProvider(this IPrincipal principal) => ValidatePrincipal(principal).GetClaimValue<string>(IDENTITY_PROVIDER);

        private static ClaimsPrincipal ValidatePrincipal(IPrincipal principal)
        {
            if (principal is not ClaimsPrincipal)
                throw new ArgumentNullException(nameof(principal));

            return (ClaimsPrincipal)principal;
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