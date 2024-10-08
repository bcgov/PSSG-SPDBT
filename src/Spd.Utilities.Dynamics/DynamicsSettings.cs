﻿namespace Spd.Utilities.Dynamics
{
    public class DynamicsSettings
    {
        public Uri EndpointUrl { get; set; } = null!;
        public Uri EntityBaseUri { get; set; } = null!;
        public OAuthSettings AuthenticationSettings { get; set; } = new OAuthSettings();
        public TimeSpan HttpClientTimeout { get; set; } = TimeSpan.FromSeconds(120);
    }

    public class OAuthSettings
    {
        public Uri OAuth2TokenEndpointUrl { get; set; } = null!;
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string ServiceAccountDomain { get; set; } = string.Empty;
        public string ServiceAccountName { get; set; } = string.Empty;
        public string ServiceAccountPassword { get; set; } = string.Empty;
        public string ResourceName { get; set; } = string.Empty;
        public int OAuth2TokenRequestTimeoutInMilliSeconds { get; set; } = 2000;
        public int OAuth2TokenRequestMaxRetryTimes { get; set; } = 5;
        public int OAuth2TokenCachedInMins { get; set; } = 30;
    }
}
