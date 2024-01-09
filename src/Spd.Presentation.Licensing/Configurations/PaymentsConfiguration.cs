namespace Spd.Presentation.Licensing.Configurations;

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
    public string CrrpaPaymentSuccessPath { get; set; } = "crrpa/payment-success/";
    public string CrrpaPaymentFailPath { get; set; } = "crrpa/payment-fail/";
    public string CrrpaPaymentCancelPath { get; set; } = "crrpa/crc-list";
    public string CrrpaPaymentErrorPath { get; set; } = "crrpa/payment-error/";

}
