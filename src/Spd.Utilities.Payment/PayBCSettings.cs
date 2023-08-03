using System;

namespace Spd.Utilities.Payment
{
    internal class PayBCSettings
    {
        public string APIKey { get; set; }
        public string Host { get; set; }
        public string DirectPayPath { get; set; }
        public string DirectRefundPath { get; set; }
        public OAuthSettings AuthenticationSettings { get; set; } = new OAuthSettings();
    }
    internal class OAuthSettings
    {
        public Uri OAuth2TokenEndpointUrl { get; set; } = null!;
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
    }
}
