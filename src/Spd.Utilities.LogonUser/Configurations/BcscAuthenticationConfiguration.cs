using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.LogonUser.Configurations
{
    public class BcscAuthenticationConfiguration
    {
        [Required]
        public string Authority { get; set; }

        [Required]
        public string Issuer { get; set; }

        [Required]
        public string Audiences { get; set; }

        public const string Name = "BcscAuthentication";

        public const string AuthSchemeName = "Bcsc";
        public string ResponseType { get; set; } = "code";
        public string Scope { get; set; } = "openid profile email offline_access";
        public string ClientId { get; set; } = null!;
        public string PostLogoutRedirectUri { get; set; } = null;
    }
}
