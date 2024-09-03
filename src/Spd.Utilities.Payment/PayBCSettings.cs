namespace Spd.Utilities.Payment
{
    internal class PayBCSettings
    {
        public DirectPaymentSettings DirectPayment { get; set; } = new();
        public DirectRefundSettings DirectRefund { get; set; } = new();
        public ARInvoiceSettings ARInvoice { get; set; } = new();
    }

    internal class DirectPaymentSettings
    {
        public string APIKey { get; set; } = null!;
        public string Host { get; set; } = null!;
        public string DirectPayPath { get; set; } = null!;
    }

    internal class DirectRefundSettings
    {
        public string Host { get; set; } = null!;
        public string DirectRefundPath { get; set; } = null!;
        public OAuthSettings AuthenticationSettings { get; set; } = new();
    }

    internal class ARInvoiceSettings
    {
        public string Host { get; set; } = null!;
        public string InvoicePath { get; set; } = null!;
        public OAuthSettings AuthenticationSettings { get; set; } = new();
        public string BatchSource { get; set; } = "SECURITY PROGRAMS";
        public string CustTransactionType { get; set; } = "Security Screening";
        public string MemoLineName { get; set; } = "Security Screening";
        public string Description { get; set; } = string.Empty;
    }

    internal class OAuthSettings
    {
        public Uri OAuth2TokenEndpointUrl { get; set; } = null!;
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public int OAuthTokenRequestTimeoutInMilliSeconds { get; set; } = 2000;
        public int OAuthTokenRequestMaxRetryTimes { get; set; } = 5;
        public int OAuthTokenCachedInMins { get; set; } = 30;
    }
}