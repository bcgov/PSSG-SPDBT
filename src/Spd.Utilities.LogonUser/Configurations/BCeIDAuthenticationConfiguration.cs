using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.LogonUser.Configurations
{
    public class BCeIDAuthenticationConfiguration
    {
        [Required]
        public string Authority { get; set; } = null!;

        [Required]
        public string Issuer { get; set; } = null!;

        [Required]
        public string Audiences { get; set; } = null!;

        public const string Name = "BCeIDAuthentication";

        public const string AuthSchemeName = "BCeID";
        public string ResponseType { get; set; } = "code";
        public string Scope { get; set; } = "openid profile email";
        public string ClientId { get; set; } = null!;
        public Uri? PostLogoutRedirectUri { get; set; }
        public string? IdentityProvider { get; set; }
    }
}