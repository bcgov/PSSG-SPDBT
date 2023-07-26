using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.LogonUser.Configurations
{
    public class IdirAuthenticationConfiguration
    {
        [Required]
        public string Authority { get; set; }

        [Required]
        public string Issuer { get; set; }

        [Required]
        public string Audiences { get; set; }

        public const string Name = "IdirAuthentication";

        public const string AuthSchemeName = "Idir";
        public string ResponseType { get; set; } = "code";
        public string Scope { get; set; } = "openid profile email offline_access";
        public string ClientId { get; set; } = null!;
        public string PostLogoutRedirectUri { get; set; } = null;

    }
}
