namespace Spd.Presentation.Licensing.Configurations;

public class PaymentsConfiguration
{
    public string UnauthPersonalLicPaymentSuccessPath { get; set; } = "security-screening/payment-success/";
    public string UnauthPersonalLicPaymentFailPath { get; set; } = "security-screening/payment-fail/";
    public string UnauthPersonalLicPaymentCancelPath { get; set; } = "security-screening/crc-list";
    public string UnauthPersonalLicPaymentErrorPath { get; set; } = "security-screening/payment-error/";
    public int MaxOnlinePaymentFailedTimes { get; set; } = 3;
}
