﻿using System;

namespace Spd.Utilities.Payment
{
    internal class PayBCSettings
    {
        public DirectPaymentSettings? DirectPayment { get; set; }
        public DirectRefundSettings? DirectRefund { get; set; }
        public ARInvoiceSettings? ARInvoice { get; set; }
    }

    internal class DirectPaymentSettings
    {
        public string APIKey { get; set; }
        public string Host { get; set; }
        public string DirectPayPath { get; set; }
    }

    internal class DirectRefundSettings
    {
        public string Host { get; set; }
        public string DirectRefundPath { get; set; }
        public OAuthSettings AuthenticationSettings { get; set; } = new OAuthSettings();
    }

    internal class ARInvoiceSettings
    {
        public string Host { get; set; }
        public string InvoicePath { get; set; }
        public OAuthSettings AuthenticationSettings { get; set; } = new OAuthSettings();
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
