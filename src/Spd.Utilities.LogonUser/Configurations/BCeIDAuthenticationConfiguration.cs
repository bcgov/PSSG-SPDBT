using System.ComponentModel.DataAnnotations;

namespace Spd.Utilities.LogonUser.Configurations
{
    public class BCeIDAuthenticationConfiguration 
    {
        [Required]
        public string Authority { get; set; }

        [Required]
        public string Issuer { get; set; }

        [Required]
        public List<string> Audiences { get; set; }

        public const string Name = "BCeIDAuthentication";

        public const string AuthSchemeName = "BCeID";
    }
}
