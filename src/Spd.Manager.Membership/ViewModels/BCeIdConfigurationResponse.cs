namespace Spd.Manager.Membership.ViewModels
{
    public class BCeIdConfigurationResponse
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }
}
