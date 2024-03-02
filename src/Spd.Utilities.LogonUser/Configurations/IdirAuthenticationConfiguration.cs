using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.LogonUser.Configurations
{
    public class IdirAuthenticationConfiguration
    {
        [Required]
        public string Authority { get; set; } = null!;

        [Required]
        public string Issuer { get; set; } = null!;

        [Required]
        public string Audiences { get; set; } = null!;

        public const string Name = "IdirAuthentication";

        public const string AuthSchemeName = "Idir";
        public string ResponseType { get; set; } = "code";
        public string Scope { get; set; } = "openid profile email";
        public string ClientId { get; set; } = null!;
        public Uri? PostLogoutRedirectUri { get; set; }
        public string? IdentityProvider { get; set; }
    }
}