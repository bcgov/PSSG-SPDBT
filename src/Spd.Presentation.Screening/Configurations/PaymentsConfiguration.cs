namespace Spd.Presentation.Screening.Configurations;

public class PaymentsConfiguration
{
    public string ApplicantPortalPaymentSuccessPath { get; set; } = "security-screening/payment-success/";
    public string ApplicantPortalPaymentFailPath { get; set; } = "security-screening/payment-fail/";
    public string ApplicantPortalPaymentCancelPath { get; set; } = "security-screening/crc-list";
    public string ApplicantPortalPaymentErrorPath { get; set; } = "security-screening/payment-error/";
    public int MaxOnlinePaymentFailedTimes { get; set; } = 3;
    public string OrgPortalPaymentSuccessPath { get; set; } = "crrp/payment-success/";
    public string OrgPortalPaymentFailPath { get; set; } = "crrp/payment-fail/";
    public string OrgPortalPaymentCancelPath { get; set; } = "crrp/crc-list";
    public string OrgPortalPaymentErrorPath { get; set; } = "crrp/payment-error/";
    public string CrrpaPaymentSuccessPath { get; set; } = "crca/payment-success/";
    public string CrrpaPaymentFailPath { get; set; } = "crca/payment-fail/";
    public string CrrpaPaymentCancelPath { get; set; } = "crca/crc-list";
    public string CrrpaPaymentErrorPath { get; set; } = "crca/payment-error/";

}
