namespace Spd.Presentation.Licensing.Configurations;

public class PaymentsConfiguration
{
    public string UnauthPersonalLicPaymentSuccessPath { get; set; } = "security-licensing/payment-success/";
    public string UnauthPersonalLicPaymentFailPath { get; set; } = "security-licensing/payment-fail/";
    public string UnauthPersonalLicPaymentCancelPath { get; set; } = "security-licensing/crc-list";
    public string UnauthPersonalLicPaymentErrorPath { get; set; } = "security-licensing/payment-error/";
    public string AuthPersonalLicPaymentSuccessPath { get; set; } = "security-licensing/payment-success/";
    public string AuthPersonalLicPaymentFailPath { get; set; } = "security-licensing/payment-fail/";
    public string AuthPersonalLicPaymentCancelPath { get; set; } = "security-licensing/crc-list";
    public string AuthPersonalLicPaymentErrorPath { get; set; } = "security-licensing/payment-error/";
    public int MaxOnlinePaymentFailedTimes { get; set; } = 3;
}
